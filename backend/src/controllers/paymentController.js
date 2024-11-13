const PaymentService = require('../services/paymentService'); // Import PaymentService

// Thêm mới payment
const createPayment = async (req, res) => {
    try {
        const payment = await PaymentService.createPayment(req.body);
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy toàn bộ payment
const getAllPayments = async (req, res) => {
    try {
        const payments = await PaymentService.getAllPayments();
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy một payment theo ID
const getPaymentById = async (req, res) => {
    try {
        const payment = await PaymentService.getPaymentById(req.params.id);
        res.status(200).json(payment);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Cập nhật payment
const updatePayment = async (req, res) => {
    try {
        const updatedPayment = await PaymentService.updatePayment(req.params.id, req.body);
        res.status(200).json(updatedPayment);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Xóa payment
const deletePayment = async (req, res) => {
    try {
        const result = await PaymentService.deletePayment(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const postZaloApi = async (req, res) => {
    try {
        const fullUrl = "https" + '://' + req.get('host') ;
        const booking = req.body
        // const referer = req.headers.referer;
        // const url = new URL(referer);
        // console.log(url)
        const result = await PaymentService.postZaloApi(booking,fullUrl);
        // console.log(result)
        res.status(200).json(result);
    } catch (error) {
        console.log(error)
        res.status(403).json({ message: error.message });
    }
};

const postZaloApiMobile = async (req, res) => {
    try {
        const booking = req.body
        const result = await PaymentService.postZaloApi(booking);
        console.log(result)
        res.status(200).json(result);
    } catch (error) {
        console.log(error)
        res.status(403).json({ message: error.message });
    }
};

const callback = async (req, res) => {
    try {
        const result = await PaymentService.callback(req);
        console.log(result)
        res.status(200).json(result);
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
};


module.exports = {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
    postZaloApi,
    callback
};
