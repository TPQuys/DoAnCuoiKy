const { DataTypes } = require("sequelize");
const sequelize = require("../supabase/connection");

const Menu = sequelize.define('Menu', {
    MenuID: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    Foods: {
        type: DataTypes.ARRAY(DataTypes.STRING), 
        allowNull: true
    },
    Drinks: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
    }
});

// Không cần sửa lại phần quan hệ ở đây vì đã được định nghĩa trong model `Event`.

module.exports = Menu;
