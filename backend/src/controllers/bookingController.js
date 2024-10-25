const BookingService = require('../services/bookingService'); // Import BookingService

// Thêm mới booking
const createBooking = async (req, res) => {
    try {
        const booking = await BookingService.createBooking(req.body);
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy toàn bộ booking
const getAllBookings = async (req, res) => {
    try {
        const bookings = await BookingService.getAllBookings();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy một booking theo ID
const getBookingById = async (req, res) => {
    try {
        const booking = await BookingService.getBookingById(req.params.id);
        res.status(200).json(booking);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const getBookingByUser = async (req, res) => {
    try {
        const booking = await BookingService.getBookingByUser(req.params.UserID);
        res.status(200).json(booking);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Cập nhật booking
const updateBooking = async (req, res) => {
    try {
        const updatedBooking = await BookingService.updateBooking(req.params.id, req.body);
        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Xóa booking
const deleteBooking = async (req, res) => {
    try {
        const result = await BookingService.deleteBooking(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking,
    getBookingByUser
};
