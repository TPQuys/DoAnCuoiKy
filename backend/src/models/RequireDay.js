const { DataTypes } = require("sequelize");
const sequelize = require("../utils/supabase/connection");

const RequireDay = sequelize.define('RequireDay', {
    RequireDayID: {
        type: DataTypes.UUID, // Sử dụng kiểu UUID
        defaultValue: DataTypes.UUIDV4, // Tạo UUID tự động
        primaryKey: true
    },
    NumberDay: {
        type: DataTypes.INTEGER, 
        defaultValue: 1,
        allowNull:false
    },
    Caution: {
        type: DataTypes.TEXT, 
        defaultValue: '', 
        allowNull:false
    },
    AlldayRate: {
        type: DataTypes.INTEGER, 
        defaultValue: 2,
        allowNull:false
    }
},{
    timestamps: false 
});

module.exports = RequireDay;
