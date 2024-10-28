const middlewareController = require("../middlewares/middlewareController");
const userController = require("../controllers/userControllers");

const router = require("express").Router();

// Lấy danh sách user
router.get("/", middlewareController.verifyToken, userController.getAllUsers);

// Lấy user theo ID
router.get("/:id", middlewareController.verifyToken, userController.getUserById);

// Tạo mới user
router.post("/", middlewareController.verifyTokenAdmin, userController.createUser);

// Cập nhật thông tin user
router.put("/:id", middlewareController.verifyToken, userController.updateUser);

// Xóa user
router.delete("/:id", middlewareController.verifyTokenAdmin, userController.deleteUser);

module.exports = router;
