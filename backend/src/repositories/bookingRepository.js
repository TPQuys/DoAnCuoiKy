const Booking = require('../models/Booking'); // Import model Booking

class BookingRepository {
    // Tạo một booking mới
    async createBooking(bookingData) {
        try {
            const newBooking = await Booking.create(bookingData);
            return newBooking;
        } catch (error) {
            console.error("Error creating booking:", error);
            throw new Error("Could not create booking");
        }
    }

    // Lấy toàn bộ booking
    async getAllBookings() {
        try {
            const bookings = await Booking.findAll({
                include: ['User', 'Event'] // Bao gồm liên kết với User và Event nếu cần
            });
            return bookings;
        } catch (error) {
            console.error("Error fetching bookings:", error);
            throw new Error("Could not fetch bookings");
        }
    }

    // Lấy booking theo ID
    async getBookingById(bookingId) {
        try {
            const booking = await Booking.findByPk(bookingId, {
                include: ['User', 'Event'] // Bao gồm liên kết với User và Event nếu cần
            });
            if (!booking) {
                throw new Error("Booking not found");
            }
            return booking;
        } catch (error) {
            console.error("Error fetching booking:", error);
            throw new Error("Could not fetch booking");
        }
    }

    // Cập nhật booking theo ID
    async updateBooking(bookingId, updatedData) {
        try {
            const booking = await Booking.findByPk(bookingId);
            if (!booking) {
                throw new Error("Booking not found");
            }
            await booking.update(updatedData);
            return booking;
        } catch (error) {
            console.error("Error updating booking:", error);
            throw new Error("Could not update booking");
        }
    }

    // Xóa booking theo ID
    async deleteBooking(bookingId) {
        try {
            const booking = await Booking.findByPk(bookingId);
            if (!booking) {
                throw new Error("Booking not found");
            }
            await booking.destroy();
            return { message: "Booking deleted successfully" };
        } catch (error) {
            console.error("Error deleting booking:", error);
            throw new Error("Could not delete booking");
        }
    }
}

module.exports = new BookingRepository();
