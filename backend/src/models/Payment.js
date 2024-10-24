const { DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/supabase/connection");
const Booking = require("./Booking"); 

const Payment = sequelize.define('Payment', {
    PaymentID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
        
    Amount: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },

    PaymentDate: {
        type: DataTypes.DATE,
        allowNull: true
    },

   BookingID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Booking, 
            key: 'BookingID'
        }
    },
    
    PaymentMethod: {
        type: DataTypes.ENUM('CREDITCARD', 'DEBITCARD', 'PAYPAL', 'BANKTRANSFER'),
        allowNull: false
    }
});

Booking.hasOne(Payment, { foreignKey: 'BookingID' });
Payment.belongsTo(Booking, { foreignKey: 'BookingID' });


module.exports = Payment;
