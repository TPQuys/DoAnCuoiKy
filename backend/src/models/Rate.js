const { DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/supabase/connection");
const Booking = require("./Booking"); 

const Rate = sequelize.define('Rate', {
    ReviewID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
        
    Rate: {
        type: DataTypes.ENUM('VERYBAD','BAD', 'OK', 'GOOD', 'VERYGOOD'),
        allowNull: false
    },

    Comment: {
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
    
});

module.exports = Rate;
