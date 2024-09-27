const { DataTypes } = require("sequelize");
const sequelize = require("../supabase/connection");


const Event = sequelize.define('Event', {
    EventID: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    EventType: {
        type: DataTypes.ENUM('Wedding', 'Conference', 'Other'),
        allowNull: false
    },
    TotalTable: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    StartEventTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    EndEventTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    EventOrder: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Quan hệ giữa Event và RoomEvent: Một RoomEvent có nhiều Event
RoomEvent.hasMany(Event, { foreignKey: 'RoomEventID' });
Event.belongsTo(RoomEvent, { foreignKey: 'RoomEventID' });

module.exports = Event;