const middlewareController = require("../middlewares/middlewareController");
const roomController = require("../controllers/roomEventController");

const router = require("express").Router();

// Lấy danh sách phòng
router.get("/", roomController.getRequireDay);
router.put("/", middlewareController.verifyTokenManager, roomController.updateRequireDay);

module.exports = router;
