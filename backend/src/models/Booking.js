const { DataTypes } = require("sequelize");
const sequelize = require("../utils/supabase/connection");
const User = require("./User");
const Event = require("./Event");  
const Payment = require("./Payment")
const Booking = sequelize.define('Booking', {
    BookingID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    PaymentStatus: {
        type: DataTypes.ENUM,
        values: ['Pending', 'Paid', 'Cancelled'], 
        allowNull: false,
        defaultValue: 'Pending' 
    },
    BookingTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    PaymentID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Payment, 
            key: 'PaymentID'
        }
    },
});

User.hasMany(Booking, { foreignKey: 'UserID' });
Booking.belongsTo(User, { foreignKey: 'UserID' });

Event.hasMany(Booking, { foreignKey: 'EventID' });
Booking.belongsTo(Event, { foreignKey: 'EventID' });

Payment.hasOne(Booking, { foreignKey: 'PaymentID' });
Booking.belongsTo(Payment, { foreignKey: 'PaymentID' });


module.exports = Booking;
