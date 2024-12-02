const { DataTypes } = require("sequelize");
const sequelize = require("../utils/supabase/connection");
const Decore = require("./Decore");

const DecorePrice = sequelize.define('DecorePrice', {
    DecorePriceID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    LobbyDecorePrice: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    StageDecorePrice: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    TableDecorePrice: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    Type: {
        type: DataTypes.ENUM("BASIC", "ADVANCED", "PREMIUM"),
        allowNull: true
    },
}, {
    timestamps: false 
});

// Quan hệ giữa DecorePrice và Decore (0,1)
DecorePrice.hasMany(Decore, { foreignKey: 'DecorePriceID', allowNull: true }); // DecorePrice có thể có một Decore
Decore.belongsTo(DecorePrice, { foreignKey: 'DecorePriceID', allowNull: true }); // Decore thuộc về DecorePrice, nhưng không bắt buộc

module.exports = DecorePrice;
