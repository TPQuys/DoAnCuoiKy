const authController = require("../controllers/authControllers");
const middlewareController = require("../controllers/middlewareController");

const router = require("express").Router();

// Register
router.post("/register", authController.registerUser);

// Login
router.post("/login", authController.loginUser);

// Refresh
router.post("/refresh", authController.requestRefreshToken);

// Logout
router.post("/logout", middlewareController.verifyToken, authController.userLogout);


module.exports = router;
