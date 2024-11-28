// menuController.js
const Drink = require("../models/Drink");
const FoodModel = require("../models/Food");
const Menu = require("../models/Menu");
const menuService = require("../services/menuService");

const menuController = {
    getAllMenus: async (req, res) => {
        try {
            const menus = await menuService.getAllMenus();
            return res.status(200).json(menus);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    getAllFood: async (req, res) => {
        try {
            const foods = await menuService.getAllFood();
            return res.status(200).json(foods);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    getAllDrink: async (req, res) => {
        try {
            const drinks = await menuService.getAllDrink();
            return res.status(200).json(drinks);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    getMenuById: async (req, res) => {
        const { id } = req.params;
        try {
            const menu = await menuService.getMenuById(id);
            if (menu) {
                return res.status(200).json(menu);
            }
            return res.status(404).json({ message: "Menu not found" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    createMenu: async (req, res) => {
        const { Food, Drinks } = req.body;
    
        try {
            const menu = await Menu.create(req.body);
    
            // Thiết lập liên kết nhiều-nhiều
            if (Food && Food.length > 0) {
                await menu.setFood(Food); // setFood là phương thức tự động tạo bởi Sequelize
            }
    
            if (Drinks && Drinks.length > 0) {
                await menu.setDrinks(Drinks);
            }
    
            // Lấy lại menu kèm dữ liệu liên kết
            const fullMenu = await Menu.findByPk(menu.MenuID, {
                include: [
                    { model: FoodModel }, // Thay thế bằng model `Food` của bạn
                    { model: Drink } // Thay thế bằng model `Drinks` của bạn
                ]
            });
    
            return res.status(201).json(fullMenu);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    
    updateMenu: async (req, res) => {
        const { id } = req.params;
        try {
            const menu = await menuService.updateMenu(id, req.body);
            return res.status(200).json(menu);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    deleteMenu: async (req, res) => {
        const { id } = req.params;
        try {
            await menuService.deleteMenu(id);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

module.exports = menuController;
