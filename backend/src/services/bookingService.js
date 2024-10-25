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
        return await BookingRepository.deleteBooking(bookingId);
    }
}

module.exports = new BookingService();
