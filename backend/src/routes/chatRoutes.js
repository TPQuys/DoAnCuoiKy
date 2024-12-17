const express = require('express');
const router = express.Router();
const middlewareController = require("../middlewares/middlewareController");
const {
    getAllMessage,
    getAllRooms
} = require('../controllers/chatController');


router.get('/room',middlewareController.verifyTokenAdmin,getAllRooms);
// Route thêm mới Decore
router.get('/:id', getAllMessage);

module.exports = router;
