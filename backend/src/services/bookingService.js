const Booking = require('../models/Booking');
const Event = require('../models/Event');
const Payment = require('../models/Payment');
const BookingRepository = require('../repositories/bookingRepository');
const cron = require('node-cron');
const { Op } = require('sequelize');

class BookingService {
    constructor() {
        // Đặt cron job chạy vào lúc nửa đêm hàng ngày
        cron.schedule('0 0 * * *', () => {
            this.deleteExpiredBookings();
        });

        cron.schedule('0 4 * * *', () => {
            this.deleteExpiredBookings();
        });
    }

    async createBooking(bookingData) {
        return await BookingRepository.createBooking(bookingData);
    }

    async getAllBookings() {
        return await BookingRepository.getAllBookings();
    }

    async getBookingById(bookingId) {
        return await BookingRepository.getBookingById(bookingId);
    }

    async getBookingByUser(UserID) {
        return await BookingRepository.getBookingsByUser(UserID);
    }

    async updateBooking(bookingId, updatedData) {
        return await BookingRepository.updateBooking(bookingId, updatedData);
    }

    async deleteBooking(bookingId) {
        const booking = await Booking.findByPk(bookingId, {
            include: [Event]  // Bao gồm thông tin event liên kết
        });

        if (!booking) {
            throw new Error("Booking không tồn tại");
        }

        const eventId = booking.EventID;

        await booking.destroy();  // Xóa booking trước

        if (eventId) {
            await Event.destroy({ where: { EventID: eventId } });  // Xóa event
        }

        return { message: "Booking và event liên kết đã được xóa thành công" };
    }

    async deleteBookingUser(bookingId) {
        const booking = await Booking.findByPk(bookingId, {
            include: [Event, Payment]  // Bao gồm thông tin event liên kết
        });

        if (!booking) {
            throw new Error("Booking không tồn tại");
        }

        if (booking.Payment) {
            throw new Error("Không thể xóa Booking đã thanh toán");
        }

        const eventId = booking.EventID;

        await booking.destroy();  // Xóa booking trước

        if (eventId) {
            await Event.destroy({ where: { EventID: eventId } });  // Xóa event
        }

        return { message: "Booking và event liên kết đã được xóa thành công" };
    }

    // Hàm xóa các booking quá hạn
    async deleteExpiredBookings() {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        try {
            // Tìm các booking chưa thanh toán quá 24 giờ và không có payment liên kết
            const expiredBookings = await Booking.findAll({
                where: {
                    PaymentStatus: 'PENDING',
                    BookingTime: {
                        [Op.lt]: oneDayAgo
                    }
                },
                include: [
                    {
                        model: Payment,
                        required: false, // Không yêu cầu phải có payment
                        where: {
                            PaymentID: null // Điều kiện kiểm tra không có payment
                        }
                    }
                ]
            });

            // Xóa các booking và sự kiện liên quan
            for (const booking of expiredBookings) {
                await Event.destroy({ where: { EventID: booking.EventID } }); // Xóa sự kiện liên quan
                await booking.destroy(); // Xóa booking
                console.log(`Booking ${booking.BookingID} đã bị xóa do không thanh toán sau 24 giờ.`);
            }
        } catch (error) {
            console.error('Lỗi khi xóa booking quá hạn:', error);
        }
    }
}

module.exports = new BookingService();
