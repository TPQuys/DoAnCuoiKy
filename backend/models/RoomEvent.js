const { DataTypes } = require("sequelize");
const sequelize = require("../supabase/connection");
const Booking = require("./Booking"); 

const RoomEvent = sequelize.define('RoomEvent', {
    RoomEventID: {
        type: DataTypes.STRING,
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
    NumberRoom: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});


module.exports = RoomEvent;
