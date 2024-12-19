const { DataTypes } = require("sequelize");
const sequelize = require("../utils/supabase/connection");
const User = require("./User"); // Import User model

const Chat = sequelize.define('Chat', {
    chatId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    room: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    }
}, {
    timestamps: false
});

// Thiết lập mối quan hệ
Chat.belongsTo(User, { as: 'Sender', foreignKey: 'fromId' }); // FromID liên kết với người gửi

module.exports = Chat;
