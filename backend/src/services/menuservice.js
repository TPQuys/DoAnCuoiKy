// menuService.js
const menuRepository = require("../repositories/menuRepository");

const menuService = {
    getAllMenus: async () => {
        return await menuRepository.getAllMenus();
    },
    getMenuById: async (menuId) => {
        return await menuRepository.getMenuById(menuId);
    },
    createMenu: async (menuData) => {
        return await menuRepository.createMenu(menuData);
    },
    updateMenu: async (menuId, menuData) => {
        return await menuRepository.updateMenu(menuId, menuData);
    },
    deleteMenu: async (menuId) => {
        return await menuRepository.deleteMenu(menuId);
    }
};

module.exports = menuService;
