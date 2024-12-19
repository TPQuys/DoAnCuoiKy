const express = require('express');
const router = express.Router();
const middlewareController = require("../middlewares/middlewareController");
const {
    getAllMessage,
    getAllRooms,
    addMessage
} = require('../controllers/chatController');


router.get('/room',middlewareController.verifyTokenManager,getAllRooms);
// Route thêm mới Decore
router.get('/:id',middlewareController.verifyToken, getAllMessage);

router.post('/',middlewareController.verifyToken, addMessage);


module.exports = router;
