const middlewareController = require("../middlewares/middlewareController");
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
router.post('/', middlewareController.verifyToken, createBooking);

// Route lấy toàn bộ booking
router.get('/', middlewareController.verifyTokenAccountant, getAllBookings);

// Route lấy một booking theo ID
router.get('/:id', middlewareController.verifyToken, getBookingById);

router.get('/user/:UserID', middlewareController.verifyToken, getBookingByUser);

// Route cập nhật booking
router.put('/:id', middlewareController.verifyToken, updateBooking);

// Route xóa booking
router.delete('/:id', middlewareController.verifyTokenAccountant, deleteBooking);

router.delete('/:id/user', middlewareController.verifyToken, deleteBooking);

module.exports = router;
