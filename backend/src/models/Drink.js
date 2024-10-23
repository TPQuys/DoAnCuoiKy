const { DataTypes } = require("sequelize");
const sequelize = require("../utils/supabase/connection");

const Drink = sequelize.define('Drink', {
    DrinkID: {
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
    Unit: { // Thêm trường đơn vị đo lường
        type: DataTypes.ENUM("BOTTLE","CARTON"),
        allowNull: false
    }
},{
    timestamps: false 
});


module.exports = Drink;
