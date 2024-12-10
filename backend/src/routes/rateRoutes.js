const express = require('express');
const rateController = require('../controllers/RateController');
const middlewareController = require("../middlewares/middlewareController");
const router = express.Router();


router.get('/all', middlewareController.verifyTokenAccountant, rateController.getAllBookingRated);

// Route để tạo sự kiện mới
router.post('/', middlewareController.verifyToken, rateController.createRate);

// Route để cập nhật sự kiện
router.put('/:id', middlewareController.verifyToken, rateController.updateRate);

// Route để xóa sự kiện
router.delete('/:id', middlewareController.verifyToken, rateController.deleteRate);

module.exports = router;
