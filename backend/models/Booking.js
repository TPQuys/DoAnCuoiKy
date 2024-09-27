const { DataTypes } = require("sequelize");
const sequelize = require("../supabase/connection");

const Booking = sequelize.define('Booking', {
    BookingID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    PaymentStatus: {
        type: DataTypes.ENUM,
        values: ['Pending', 'Paid', 'Cancelled'], 
        allowNull: false
    },
    BookingTime: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

User.hasMany(Booking, { foreignKey: 'UserID' });
Booking.belongsTo(User, { foreignKey: 'UserID' });


module.exports = Booking;
