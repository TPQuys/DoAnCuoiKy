const Booking = require('../models/Booking');
const Event = require('../models/Event');
const Payment = require('../models/Payment');
const BookingRepository = require('../repositories/bookingRepository'); 

class BookingService {
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
    
        if (booking.Payment){
            throw new Error("Không thể xóa Booking đã thanh toán")
        }
        const eventId = booking.EventID;
    
        await booking.destroy();  // Xóa booking trước
    
        if (eventId) {
            await Event.destroy({ where: { EventID: eventId } });  // Xóa event
        }
    
        return { message: "Booking và event liên kết đã được xóa thành công" };
    }
    
}

module.exports = new BookingService();
