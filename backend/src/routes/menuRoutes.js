// menuRoutes.js
const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");

// Route cho menu
router.get("/", menuController.getAllMenus);
router.get("/foods", menuController.getAllFood);
router.get("/drinks", menuController.getAllDrink);
router.get("/:id", menuController.getMenuById);
router.post("/", menuController.createMenu);
router.put("/:id", menuController.updateMenu);
router.delete("/:id", menuController.deleteMenu);

module.exports = router;
