const { DataTypes } = require("sequelize");
const sequelize = require("../utils/supabase/connection");

const RequireDay = sequelize.define('RequireDay', {
    RequireDayID: {
        type: DataTypes.UUID, // Sử dụng kiểu UUID
        defaultValue: DataTypes.UUIDV4, // Tạo UUID tự động
        primaryKey: true
    },
    NumberDay: {
        type: DataTypes.INTEGER, // Sử dụng kiểu UUID
        defaultValue: 1, // Tạo UUID tự động
        allowNull:false
    },
},{
    timestamps: false 
});

module.exports = RequireDay;
