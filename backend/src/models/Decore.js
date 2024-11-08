const { DataTypes } = require("sequelize");
const sequelize = require("../utils/supabase/connection");
const DecorePrice = require("./DecorePrice");

const Decore = sequelize.define('Decore', {
    DecoreID: {
        type: DataTypes.UUID, // Sử dụng kiểu UUID
        defaultValue: DataTypes.UUIDV4, // Tạo UUID tự động
        primaryKey: true
    },
    LobbyDecore: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    StageDecore: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    TableDecore: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
},{
    timestamps: false 
});

module.exports = Decore;
