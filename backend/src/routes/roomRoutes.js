const middlewareController = require("../middlewares/middlewareController");
const roomController = require("../controllers/roomEventController");

const router = require("express").Router();

// Lấy danh sách phòng
router.get("/", roomController.getAllRoomEvents);

// Lấy theo id
router.get("/id/:id", roomController.getAllRoomEvents);

// Thêm phòng mới
router.post("/", middlewareController.verifyTokenAdmin, roomController.createRoomEvent);

// Cập nhật phòng theo ID
router.put("/:id", middlewareController.verifyTokenAdmin, roomController.updateRoomEvent);

// Xóa phòng theo ID
router.delete("/:id", middlewareController.verifyTokenAdmin, roomController.deleteRoomEvent);

module.exports = router;
