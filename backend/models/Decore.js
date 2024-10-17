const { DataTypes } = require("sequelize");
const sequelize = require("../supabase/connection");

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

// Không cần sửa lại phần quan hệ ở đây vì đã được định nghĩa trong model `Event`.

module.exports = Decore;
