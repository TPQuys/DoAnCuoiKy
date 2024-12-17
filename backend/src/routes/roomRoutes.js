const middlewareController = require("../middlewares/middlewareController");
const roomController = require("../controllers/roomEventController");
const upload = require('../utils/supabase/uploadImage');

const router = require("express").Router();

// Lấy danh sách phòng
router.get("/", roomController.getAllRoomEvents);

// Lấy theo id
router.get("/id/:id", roomController.getRoomEventById);

// Cập nhật phòng theo ID khi không có hình ảnh
router.put("/:id", middlewareController.verifyTokenManager, roomController.updateRoomEvent);

// Xóa phòng theo ID
router.delete("/:id", middlewareController.verifyTokenAdmin, roomController.deleteRoomEvent);

// Cập nhật phòng theo ID có hình ảnh
router.put('/:id/image', upload.single('imageRoom'),middlewareController.verifyTokenManager, roomController.uploadRoom)

router.post("/available" ,roomController.findAvailableRooms);

//thêm room
router.post('/', upload.single('imageRoom'),middlewareController.verifyTokenManager, roomController.addRoom)


module.exports = router;
