const { DataTypes } = require("sequelize");
const sequelize = require("../utils/supabase/connection");

const Food = sequelize.define('Food', {
    FoodID: {
        type: DataTypes.UUID, // Sử dụng kiểu UUID
        defaultValue: DataTypes.UUIDV4, // Tạo UUID tự động
        primaryKey: true
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    UnitPrice: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
}, {
    timestamps: false 
});


module.exports = Food;
