const { DataTypes } = require("sequelize");
const sequelize = require("../utils/supabase/connection");

const DecorePrice = sequelize.define('DecorePrice', {
    DecorePriceID: {
        type: DataTypes.UUID, // Sử dụng kiểu UUID
        defaultValue: DataTypes.UUIDV4, // Tạo UUID tự động
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
    }
},{
    timestamps: false 
});

// Không cần sửa lại phần quan hệ ở đây vì đã được định nghĩa trong model `Event`.

module.exports = DecorePrice;
