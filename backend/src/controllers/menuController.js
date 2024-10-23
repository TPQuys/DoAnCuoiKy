// menuController.js
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
        try {
            const menu = await menuService.createMenu(req.body);
            return res.status(201).json(menu);
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
