const PaymentRepository = require('../repositories/paymentRepository');
const bookingRepository = require('../repositories/bookingRepository');
const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment'); // npm install moment
const ngrok = require('ngrok');

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
            const quantity = item?.[throughField]?.dataValues?.Quantity || 0; // Số lượng từ bảng through
            return total + (unitPrice * quantity);
        }, 0); // Bắt đầu từ 0
    }


    async createPayment(paymentData) {
        return await PaymentRepository.createPayment(paymentData);
    }

    async getAllPayments() {
        return await PaymentRepository.getAllPayments();
    }

    async postZaloApi(booking) {
        const findBooking = await bookingRepository.getBookingById(booking.BookingID)
        const eventData = findBooking?.Event || {};
        const roomEventData = eventData?.RoomEvent || {};
        const menuData = eventData?.Menu || {};
        const foodData = menuData?.Food || [];
        const drinkData = menuData?.Drinks || [];

        // Tính tổng giá của thức ăn và đồ uống
        const totalPriceFoods = this.calculateTotal(foodData, 'MenuFoods');
        const totalPriceDrinks = this.calculateTotal(drinkData, 'MenuDrinks');

        const totalTable = eventData?.TotalTable || 1; // Tổng số bàn, mặc định là 1 nếu không có
        const roomPrice = roomEventData?.Price || 0; // Giá phòng

        // Tính tổng tiền thanh toán
        const Amount = (totalPriceFoods + totalPriceDrinks) * totalTable + roomPrice;
        await ngrok.kill()
        const url = await ngrok.connect(8000)
        const BookingID = findBooking.BookingID
        const embed_data = {
            redirecturl: "http://localhost:3000/payment"
        };
        if (Amount && BookingID && url) {
            const items = [booking];
            const transID = Math.floor(Math.random() * 1000000);
            const order = {
                app_id: config.app_id,
                app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
                app_user: "user123",
                app_time: Date.now(), // miliseconds
                item: JSON.stringify(items),
                embed_data: JSON.stringify(embed_data),
                amount: Amount,
                description: `Lazada - Payment for the order #${transID}`,
                bank_code: "",
                //dùng ngrok để tạo url này
                callback_url: url + "/v1/payment/callback"
            };
            // appid|app_trans_id|appuser|amount|apptime|embeddata|item
            const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
            order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

            const result = await axios.post(config.endpoint, null, { params: order })
            return result.data
        }
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
                if(items[0]){
                    const payment = {
                        Amount:dataJson.amount,
                        PaymentDate:new Date(),
                        PaymentMethod:"BANKTRANSFER",
                        BookingID:booking.BookingID
                    }
                    const newPayment = await PaymentRepository.createPayment(payment)
                    console.log(newPayment)
                }

                result.return_code = 1;
                result.return_message = "success";
            }
        } catch (ex) {
            result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
            result.return_message = ex.message;
        }
        await ngrok.kill()
        return result
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
