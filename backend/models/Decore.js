const { DataTypes } = require("sequelize");
const sequelize = require("../supabase/connection");
const Event = require("./Event"); 

const Decore = sequelize.define('Decore', {
    DecoreID: {
        type: DataTypes.STRING,
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
});

// Quan hệ giữa Event và Decore: Một Event có một Decore
Event.hasOne(Decore, { foreignKey: 'DecoreID' });
Decore.belongsTo(Event, { foreignKey: 'DecoreID' });

module.exports = Decore;
