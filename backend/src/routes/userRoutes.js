const middlewareController = require("../middlewares/middlewareController");
const userController = require("../controllers/userControllers");
const upload = require('../utils/supabase/uploadImage');

const router = require("express").Router();

// Lấy danh sách user
router.get("/", middlewareController.verifyTokenHR, userController.getAllUsers);

// Lấy user theo ID
router.get("/:id", middlewareController.verifyToken, userController.getUserById);

// Tạo mới user
router.post("/", middlewareController.verifyTokenHR, userController.createUser);

//Gửi email reset password
router.post("/reset_password/", userController.sendResetPassword);

//reset password
router.put("/update_password/", userController.updatePassword);

// Cập nhật thông tin user
router.put("/:id", middlewareController.verifyToken, userController.updateUser);

// Xóa user
router.delete("/:id", middlewareController.verifyTokenHR, userController.deleteUser);

router.put('/:id/avatar', upload.single('avatar'), userController.uploadAvatar)

module.exports = router;
