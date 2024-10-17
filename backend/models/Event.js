const { DataTypes } = require("sequelize");
const sequelize = require("../supabase/connection");
const RoomEvent = require("./RoomEvent");
const Menu = require("./Menu");
const Decore = require("./Decore");

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

RoomEvent.hasMany(Event, { foreignKey: 'RoomEventID' });
Event.belongsTo(RoomEvent, { foreignKey: 'RoomEventID' });

Menu.hasMany(Event, { foreignKey: 'MenuID' });
Event.belongsTo(Menu, { foreignKey: 'MenuID' });

Decore.hasMany(Event, { foreignKey: 'DecoreID' });
Event.belongsTo(Decore, { foreignKey: 'DecoreID' });

module.exports = Event;
