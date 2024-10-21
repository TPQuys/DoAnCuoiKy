const { DataTypes } = require("sequelize");
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
        allowNull: false
    },
    
    PaymentMethod: {
        type: DataTypes.STRING,
        allowNull: false
    }
});



module.exports = Payment;
