const middlewareController = require("../middlewares/middlewareController");
const userController = require("../controllers/userControllers");

const router = require("express").Router();

//Lấy danh sách user
router.get("/",middlewareController.verifyToken, userController.getAllUser);

//Xóa user
router.delete("/:id",middlewareController.verifyTokenAdmin, userController.deleteUser);


module.exports = router;