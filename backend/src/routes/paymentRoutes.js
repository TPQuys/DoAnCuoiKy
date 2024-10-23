const express = require('express');
const router = express.Router();
const {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment
} = require('../controllers/paymentController'); // Import các hàm từ paymentController

// Route thêm mới payment
router.post('/', createPayment);

// Route lấy toàn bộ payment
router.get('/', getAllPayments);

// Route lấy một payment theo ID
router.get('/:id', getPaymentById);

// Route cập nhật payment
router.put('/:id', updatePayment);

// Route xóa payment
router.delete('/:id', deletePayment);

module.exports = router;
