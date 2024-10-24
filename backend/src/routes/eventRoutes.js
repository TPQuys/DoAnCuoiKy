const express = require('express');
const eventController = require('../controllers/eventController');
const middlewareController = require("../middlewares/middlewareController");
const router = express.Router();

// Route để tạo sự kiện mới
router.post('/', eventController.createEvent);

// Route để cập nhật sự kiện
router.put('/:id', middlewareController.verifyToken, eventController.updateEvent);

// Route để xóa sự kiện
router.delete('/:id', middlewareController.verifyToken, eventController.deleteEvent);

module.exports = router;
