const express = require('express');
const router = express.Router();
const {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking
} = require('../controllers/bookingController'); // Import các hàm từ bookingController

// Route thêm mới booking
router.post('/bookings', createBooking);

// Route lấy toàn bộ booking
router.get('/bookings', getAllBookings);

// Route lấy một booking theo ID
router.get('/bookings/:id', getBookingById);

// Route cập nhật booking
router.put('/bookings/:id', updateBooking);

// Route xóa booking
router.delete('/bookings/:id', deleteBooking);

module.exports = router;
