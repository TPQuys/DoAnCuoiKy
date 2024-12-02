const { DataTypes } = require("sequelize");
const sequelize = require("../utils/supabase/connection");
const User = require("./User");
const Event = require("./Event");  
const Booking = sequelize.define('Booking', {
    BookingID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    PaymentStatus: {
        type: DataTypes.ENUM('PENDING', 'PAID', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'PENDING' 
    },
    BookingTime: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        allowNull: false
    },
    PaymentLink: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    LinkExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
    }
});

User.hasMany(Booking, { foreignKey: 'UserID' });
Booking.belongsTo(User, { foreignKey: 'UserID' });

Event.hasOne(Booking, { foreignKey: 'EventID' });
Booking.belongsTo(Event, { foreignKey: 'EventID' });

module.exports = Booking;
