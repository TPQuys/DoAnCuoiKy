const express = require('express');
const router = express.Router();
const {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking,
    getBookingByUser
} = require('../controllers/bookingController'); // Import các hàm từ bookingController

// Route thêm mới booking
router.post('/', createBooking);

// Route lấy toàn bộ booking
router.get('/', getAllBookings);

// Route lấy một booking theo ID
router.get('/:id', getBookingById);

router.get('/user/:UserID', getBookingByUser);

// Route cập nhật booking
router.put('/:id', updateBooking);

// Route xóa booking
router.delete('/:id', deleteBooking);

module.exports = router;
