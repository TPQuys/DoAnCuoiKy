require('dotenv').config();
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const PaymentRepository = require('../repositories/paymentRepository');
const bookingRepository = require('../repositories/bookingRepository');
const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment'); // npm install moment
const ngrok = require('ngrok');
const nodemailer = require('nodemailer');
const Booking = require('../models/Booking');

const config = {
    app_id: "2554",
    key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
    key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};
class PaymentService {
    // Hàm để tính tổng giá dựa trên dữ liệu và liên kết (foods hoặc drinks)
    calculateTotal(items, throughField) {
        return items.reduce((total, item) => {
            const unitPrice = item?.dataValues?.UnitPrice || 0; // Giá của từng món
            const quantity = 1
            return total + (unitPrice * quantity);
        }, 0); // Bắt đầu từ 0
    }

    getDecorePrice(event, decore) {
        let total = 0;
        if (decore?.LobbyDecore) {
            total += decore?.DecorePrice?.LobbyDecorePrice; // Sử dụng += để cộng dồn
        }
        if (decore?.StageDecore) {
            total += decore?.DecorePrice?.StageDecorePrice; // Sử dụng += để cộng dồn
        }
        if (decore?.TableDecore) {
            total += (decore?.DecorePrice?.TableDecorePrice) * event?.TotalTable; // Sử dụng += để cộng dồn
        }
        return total; // Trả về tổng giá trị
    };

    async sendSuccessEmail(email, payment, invoice) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        // Tạo hóa đơn PDF
        const pdfBuffer = await this.generateInvoicePDF(invoice);

        const mailOptions = {
            from: 'quy097255@gmail.com',
            to: email,
            subject: 'Thông báo thanh toán thành công',
            text: `Xin chào! Bạn đã thanh toán thành công. Thông tin thanh toán:\n
            - Số tiền: ${payment.Amount}\n
            - Phương thức thanh toán: ${payment.PaymentMethod}\n
            - Ngày thanh toán: ${payment.PaymentDate.toLocaleDateString()}\n
            Hóa đơn thanh toán được đính kèm.\n
            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.\n\nTrân trọng,\nĐội ngũ hỗ trợ`,
            attachments: [
                {
                    filename: `invoice_${invoice.invoiceId}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf',
                }
            ]
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log("Email và hóa đơn đã được gửi thành công!");
            return pdfBuffer
        } catch (error) {
            console.error("Không thể gửi email:", error);
        }
    }


    async createPayment(paymentData) {
        return await PaymentRepository.createPayment(paymentData);
    }

    async getAllPayments() {
        return await PaymentRepository.getAllPayments();
    }

    rommPriceByEvent(event, roomPrice) {
        if (event?.Time === "ALLDAY") {
            return roomPrice * 2
        } else if (event?.Time === "CUSTOM") {
            const from = new Date(event.From)
            const to = new Date(event.To)
            const diff = (to - from) / (1000 * 60 * 60)

            console.log(diff)
            return roomPrice * diff
        }
        else {
            return roomPrice
        }
    }
    roundUpToMultiple(value) {
        return Math.round(value);
    }

    async postZaloApi(booking, backendURL) {
        try {
            ngrok.kill()
        } catch { }
        const url = backendURL.includes("8000") ? await ngrok.connect(8000) : backendURL
        // const url = "https://160b-116-106-193-155.ngrok-free.app"
        // console.log(url)
        const findBooking = await bookingRepository.getBookingById(booking.BookingID)
        // if(findBooking.PaymentLink && (findBooking.LinkExpiry> new Date())){
        //     return {order_url:findBooking.PaymentLink}
        // }
        console.log(booking)
        if (booking.Payment == null) {
            const eventData = findBooking?.Event || {};
            const roomEventData = eventData?.RoomEvent || {};
            const menuData = eventData?.Menu || {};
            const foodData = menuData?.Food || [];
            const drinkData = menuData?.Drinks || [];

            // Tính tổng giá của thức ăn và đồ uống
            const totalPriceFoods = this.calculateTotal(foodData, 'MenuFoods');
            const totalPriceDrinks = this.calculateTotal(drinkData, 'MenuDrinks');

            const totalTable = eventData?.TotalTable || 1; // Tổng số bàn, mặc định là 1 nếu không có
            const Time = eventData?.Time; // Tổng số bàn, mặc định là 1 nếu không có
            const roomPrice = this.rommPriceByEvent(eventData, roomEventData.Price)
            // console.log(roomPrice)
            // Tính tổng tiền thanh toán
            const Amount = ((totalPriceFoods + totalPriceDrinks) * totalTable + this.getDecorePrice(eventData, eventData.Decore) + roomPrice) * 1.1;
            const BookingID = findBooking.BookingID
            const embed_data = {
                redirecturl: `${process.env.FRONTEND_URL}/payment`
            };
            if (Amount && BookingID && url) {
                const items = [BookingID, findBooking.User.email];
                const transID = Math.floor(Math.random() * 1000000);
                const order = {
                    app_id: config.app_id,
                    app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
                    app_user: "user123",
                    app_time: Date.now(), // miliseconds
                    item: JSON.stringify(items),
                    embed_data: JSON.stringify(embed_data),
                    amount: this.roundUpToMultiple(Amount),
                    description: `Thanh toán đơn đặt #${transID}`,
                    bank_code: "",
                    callback_url: url + "/v1/payment/callback"
                };

                // appid|app_trans_id|appuser|amount|apptime|embeddata|item
                const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
                order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

                try {
                    const result = await axios.post(config.endpoint, null, { params: order })
                    console.log(result.data)
                    if (result?.data?.return_code == 1) {
                        const linkExpiry = new Date();
                        linkExpiry.setMinutes(linkExpiry.getMinutes() + 15);
                        await Booking.update(
                            {
                                PaymentLink: result.data.order_url,
                                LinkExpiry: linkExpiry
                            },
                            { where: { BookingID: findBooking.BookingID } }
                        );
                        return result.data
                    }

                } catch (error) {
                    return error
                }
            }
        } else
            throw new Error('Sự kiện này đã được thanh toán trước')
    }

    async callback(req) {
        let result = {};

        try {
            let dataStr = req.body.data;
            let reqMac = req.body.mac;

            let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
            // console.log("mac =", mac);


            // kiểm tra callback hợp lệ (đến từ ZaloPay server)
            if (reqMac !== mac) {
                // callback không hợp lệ
                result.return_code = -1;
                result.return_message = "mac not equal";
            }
            else {
                // thanh toán thành công
                // merchant cập nhật trạng thái cho đơn hàng
                let dataJson = JSON.parse(dataStr, config.key2);
                console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);
                const items = JSON.parse(dataJson.item)
                const booking = items[0]
                const email = items[1]
                if (items[0]) {
                    const payment = {
                        Amount: dataJson.amount,
                        PaymentDate: new Date(),
                        PaymentMethod: "BANKTRANSFER",
                        BookingID: booking
                    };

                    const newPayment = await PaymentRepository.createPayment(payment);

                    if (newPayment) {
                        const findBooking = await bookingRepository.getBookingById(booking);
                        const invoice = await this.generateInvoice(findBooking);
                        const pdfBuffer = await this.sendSuccessEmail(email, payment, invoice);
                        await newPayment.update({Invoice:pdfBuffer})
                        console.log("set invoice successfull")
                    }
                }

                result.return_code = 1;
                result.return_message = "success";
            }
        } catch (ex) {
            result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
            result.return_message = ex.message;
        }
        return result
    }
    async generateInvoice(booking) {
        try {
            const eventData = booking?.Event || {};
            const menuData = eventData?.Menu || {};
            const foodData = menuData?.Food || [];
            const drinkData = menuData?.Drinks || [];

            const totalPriceFoods = this.calculateTotal(foodData, 'MenuFoods');
            const totalPriceDrinks = this.calculateTotal(drinkData, 'MenuDrinks');
            const totalTable = eventData?.TotalTable || 1;
            const roomPrice = this.rommPriceByEvent(eventData, eventData.RoomEvent?.Price || 0);
            const decoresPrice = this.getDecorePrice(eventData, eventData.Decore || {});

            const totalAmount = ((totalPriceFoods + totalPriceDrinks) * totalTable + decoresPrice + roomPrice) * 1.1;

            const invoice = {
                invoiceId: `INV_${moment().format('YYMMDD')}_${Math.floor(Math.random() * 100000)}`, // Mã hóa đơn
                bookingId: booking.BookingID, // Mã đặt chỗ
                customerEmail: booking.User?.email || 'Unknown', // Email khách hàng
                eventDate: eventData?.EventDate || 'Unknown', // Ngày tổ chức
                time: eventData?.Time || 'Unknown', // Giờ tổ chức
                totalTables: totalTable, // Tổng số bàn
                totalFoods: totalPriceFoods, // Tổng tiền món ăn
                totalDrinks: totalPriceDrinks, // Tổng tiền đồ uống
                roomPrice, // Giá thuê phòng
                decorePrice: decoresPrice, // Giá trang trí
                totalAmount, // Tổng tiền thanh toán
                createdAt: new Date().toISOString(), // Ngày lập hóa đơn
            };

            return invoice;
        } catch (error) {
            console.error("Error generating invoice:", error);
            throw new Error('Lỗi tạo hóa đơn');
        }
    }
    async generateInvoicePDF(invoice) {
        // Đường dẫn tuyệt đối đến font
        const fontPath = path.resolve(__dirname, '../fonts/Roboto-Regular.ttf');
    
        // Kiểm tra xem font có tồn tại không
        if (!fs.existsSync(fontPath)) {
            throw new Error(`Font file not found at path: ${fontPath}`);
        }
    
        // Chỉnh chiều dài PDF xuống còn 2/3
        const doc = new PDFDocument({ size: [595.28, 841.89 * (2 / 3)], margin: 50 });
        const buffers = [];
    
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {});
    
        // Sử dụng font Unicode
        doc.font(fontPath);
    
        // Header hóa đơn
        doc.fontSize(18).text('HÓA ĐƠN THANH TOÁN', { align: 'center' }).moveDown();
        doc.fontSize(12).text(`Mã hóa đơn: ${invoice.invoiceId}`);
        doc.text(`Ngày lập hóa đơn: ${new Date(invoice.createdAt).toLocaleString()}`);
        doc.text(`Khách hàng: ${invoice.customerEmail}`).moveDown();
    
        // Nội dung hóa đơn
        doc.text(`Ngày tổ chức: ${new Date(invoice.eventDate).toLocaleDateString()}`);
        doc.text(`Tổng số bàn: ${invoice.totalTables}`);
        doc.text(`Tiền món ăn: ${invoice.totalFoods.toLocaleString()} VND`);
        doc.text(`Tiền đồ uống: ${invoice.totalDrinks.toLocaleString()} VND`);
        doc.text(`Giá thuê phòng: ${invoice.roomPrice.toLocaleString()} VND`);
        doc.text(`Giá trang trí: ${invoice.decorePrice.toLocaleString()} VND`).moveDown();
    
        // Tổng tiền
        doc.fontSize(14).text(`Tổng tiền thanh toán: ${invoice.totalAmount.toLocaleString()} VND`, { align: 'right' });
    
        doc.end();
    
        return new Promise((resolve, reject) => {
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);
        });
    }

    async getPaymentById(paymentId) {
        return await PaymentRepository.getPaymentById(paymentId);
    }

    async updatePayment(paymentId, updatedData) {
        return await PaymentRepository.updatePayment(paymentId, updatedData);
    }

    async deletePayment(paymentId) {
        return await PaymentRepository.deletePayment(paymentId);
    }
}

module.exports = new PaymentService();
