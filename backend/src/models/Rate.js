const { DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/supabase/connection");
const Booking = require("./Booking");
const RoomEvent = require("./RoomEvent");

const Rate = sequelize.define('Rate', {
    ReviewID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },

    Email:{
        type: DataTypes.STRING,
        allowNull: false,
    },

    Rate: {
        type: DataTypes.ENUM('1', '2', '3', '4', '5'),
        allowNull: false
    },

    RateService: {
        type: DataTypes.ENUM('1', '2', '3', '4', '5'),
        allowNull: false
    },

    Comment: {
        type: DataTypes.STRING,
        allowNull: true
    },

    RoomEventID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: RoomEvent,
            key: 'RoomEventID'
        }
    },
    BookingID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Booking, 
            key: 'BookingID'
        }
    },
});

RoomEvent.hasMany(Rate, { foreignKey: 'RoomEventID' });
Rate.belongsTo(RoomEvent, { foreignKey: 'RoomEventID' });

Booking.hasOne(Rate, { foreignKey: 'BookingID' });
Rate.belongsTo(Booking, { foreignKey: 'BookingID' });


module.exports = Rate;
