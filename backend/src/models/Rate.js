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
        type: DataTypes.ENUM('1','2', '3', '4', '5'),
        allowNull: false
    },

    Comment: {
        type: DataTypes.STRING,
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

Booking.hasOne(Rate, { foreignKey: 'BookingID' });
Rate.belongsTo(Booking, { foreignKey: 'BookingID' });


module.exports = Rate;
