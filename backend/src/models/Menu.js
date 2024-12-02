// Menu.js
const { DataTypes } = require("sequelize");
const sequelize = require("../utils/supabase/connection");
const Food = require("./Food");
const Drink = require("./Drink");

const Menu = sequelize.define('Menu', {
    MenuID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Image: {
        type: DataTypes.STRING,
        defaultValue:'https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/public/Event/home_menu.jpeg',
        allowNull: true
    }
}, {
    timestamps: false, // Xóa các trường createdAt và updatedAt
});

// Quan hệ nhiều-nhiều giữa Menu và Food
Menu.belongsToMany(Food, { through: 'MenuFoods', foreignKey: 'MenuID' });
Food.belongsToMany(Menu, { through: 'MenuFoods', foreignKey: 'FoodID' });

// Quan hệ nhiều-nhiều giữa Menu và Drink
Menu.belongsToMany(Drink, { through: 'MenuDrinks', foreignKey: 'MenuID' });
Drink.belongsToMany(Menu, { through: 'MenuDrinks', foreignKey: 'DrinkID' });

module.exports = Menu;
