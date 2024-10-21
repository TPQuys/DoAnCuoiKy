const { DataTypes } = require("sequelize");
const sequelize = require("../utils/supabase/connection");
const Booking = require("./Booking"); 

const RoomEvent = sequelize.define('RoomEvent', {
    RoomEventID: {
        type: DataTypes.UUID, // Sử dụng kiểu UUID
        defaultValue: DataTypes.UUIDV4, // Tạo UUID tự động
        primaryKey: true
    },
    HeightRoom: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    WidthRoom: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    Capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    MaxTable: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    RoomName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    Description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
},{
    timestamps: false 
});


module.exports = RoomEvent;
