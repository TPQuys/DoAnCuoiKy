const { DataTypes } = require("sequelize");
const sequelize = require("../supabase/connection");

const Menu = sequelize.define('Menu', {
    MenuID: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    Drinks: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Quan hệ giữa Event và Menu: Một Event có một Menu
Event.hasOne(Menu, { foreignKey: 'MenuID' });
Menu.belongsTo(Event, { foreignKey: 'MenuID' });

module.exports = User;