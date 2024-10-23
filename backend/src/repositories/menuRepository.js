// menuRepository.js
const Menu = require("../models/Menu");
const Food = require("../models/Food");
const Drink = require("../models/Drink");

const menuRepository = {
    getAllMenus: async () => {
        return await Menu.findAll({
            include: [
                {
                    model: Food,
                    through: { attributes: ['Quantity'] }, 
                },
                {
                    model: Drink,
                    through: { attributes: ['Quantity'] }, 
                },
            ],
        });
    },
    getMenuById: async (menuId) => {
        return await Menu.findByPk(menuId);
    },
    createMenu: async (menuData) => {
        return await Menu.create(menuData);
    },
    updateMenu: async (menuId, menuData) => {
        const menu = await Menu.findByPk(menuId);
        if (menu) {
            return await menu.update(menuData);
        }
        throw new Error("Menu not found");
    },
    deleteMenu: async (menuId) => {
        const menu = await Menu.findByPk(menuId);
        if (menu) {
            await menu.destroy();
            return menuId;
        }
        throw new Error("Menu not found");
    }
};

module.exports = menuRepository;
