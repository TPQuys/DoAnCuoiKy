const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid'); // Import hàm tạo UUID
const sequelize = require("../utils/supabase/connection");
const RoomEvent = require("./RoomEvent");
const Menu = require("./Menu");
const Decore = require("./Decore");
// const EventType = require("./EventType");

const Event = sequelize.define('Event', {
    EventID: {
        type: DataTypes.UUID, // Sử dụng kiểu UUID
        defaultValue: DataTypes.UUIDV4, // Tạo UUID tự động
        primaryKey: true
    },
    TotalTable: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    EventDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    EventType: {
        type: DataTypes.ENUM('WEDDING','CONFERENCE','BIRTHDAY',"ORTHER"),
        allowNull: false
    },
    Time:{
        type: DataTypes.ENUM('MORNING','AFTERNOON','ALLDAY','CUSTOM'),
        allowNull: false
    },
    From:{
        type: DataTypes.DATE,
        allowNull: true
    },
    To:{
        type: DataTypes.DATE,
        allowNull: true
    },
    Note: {
        type: DataTypes.TEXT,
        allowNull: true
    },

}, {
    timestamps: false
});

RoomEvent.hasMany(Event, { foreignKey: 'RoomEventID' });
Event.belongsTo(RoomEvent, { foreignKey: 'RoomEventID' });

Menu.hasOne(Event, { foreignKey: 'MenuID' });
Event.belongsTo(Menu, { foreignKey: 'MenuID' });

Decore.hasOne(Event, { foreignKey: 'DecoreID' });
Event.belongsTo(Decore, { foreignKey: 'DecoreID' });

module.exports = Event;


