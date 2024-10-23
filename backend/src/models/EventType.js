const { DataTypes } = require("sequelize");
const sequelize = require("../utils/supabase/connection");

const EventType = sequelize.define('EventType', {
    EventTypeID: {
        type: DataTypes.UUID, // Sử dụng kiểu UUID
        defaultValue: DataTypes.UUIDV4, // Tạo UUID tự động
        primaryKey: true
    },
    TypeEvent: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Price: {
        type: DataTypes.DOUBLE,
        allowNull: null
    }
    
},{
    timestamps: false 
});


module.exports = EventType;


