const { DataTypes } = require("sequelize");
const sequelize = require("../utils/supabase/connection");

const MenuDrinks = sequelize.define('MenuDrinks', {
    MenuID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Menus',
            key: 'MenuID'
        }
    },
    DrinkID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Drinks',
            key: 'DrinkID'
        }
    },
    Quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false, 
});

module.exports = { MenuDrinks };