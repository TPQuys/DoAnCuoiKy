const { DataTypes } = require("sequelize");
const sequelize = require("../supabase/connection");
const Booking = require("./Booking"); 

const Payment = sequelize.define('Payment', {
    PaymentID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
        BookingID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Booking, 
            key: 'BookingID'
        }
    },
    Amount: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    PaymentDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    PaymentMethod: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Quan hệ giữa Booking và Payment: Một Booking có một Payment
Booking.hasOne(Payment, { foreignKey: 'BookingID' });
Payment.belongsTo(Booking, { foreignKey: 'BookingID' });

module.exports = Payment;
