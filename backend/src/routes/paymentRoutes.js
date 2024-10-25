const middlewareController = require("../middlewares/middlewareController");
const express = require('express');
const router = express.Router();
const {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
    postZaloApi,
} = require('../controllers/paymentController'); // Import các hàm từ paymentController
const { callback } = require('../services/paymentService');
const paymentService = require('../services/paymentService');

// Route thêm mới payment
router.post('/', createPayment);

router.post('/zalopay', middlewareController.verifyToken, postZaloApi);

router.post('/callback', callback.bind(paymentService));

// Route lấy toàn bộ payment
router.get('/', getAllPayments);

// Route lấy một payment theo ID
router.get('/:id', getPaymentById);

// Route cập nhật payment
router.put('/:id', updatePayment);

// Route xóa payment
router.delete('/:id', deletePayment);

module.exports = router;
