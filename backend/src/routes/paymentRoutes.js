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
router.post('/payments', createPayment);

// Route lấy toàn bộ payment
router.get('/payments', getAllPayments);

// Route lấy một payment theo ID
router.get('/payments/:id', getPaymentById);

// Route cập nhật payment
router.put('/payments/:id', updatePayment);

// Route xóa payment
router.delete('/payments/:id', deletePayment);

module.exports = router;
