const { DataTypes } = require("sequelize");
const sequelize = require("../utils/supabase/connection");

// Định nghĩa bảng trung gian MenuFoods
const MenuFoods = sequelize.define('MenuFoods', {
    MenuID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Menus',
            key: 'MenuID'
        }
    },
    FoodID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Food',
            key: 'FoodID'
        }
    },
    Quantity: {
        type: DataTypes.INTEGER,
        defaultValue:1,
        allowNull: false
    }
}, {
    timestamps: false, // Xóa các trường createdAt và updatedAt
});

module.exports = { MenuFoods };