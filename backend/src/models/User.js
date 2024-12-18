const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utils/supabase/connection");

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'emailAddress'
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('ADMIN', 'MANAGER', 'HR', 'ACCOUNTANT', 'USER'),
        allowNull: false,
        defaultValue: 'USER',
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dayofbirth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        field: 'phoneNumber'
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        allowNull: true
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        allowNull: true
    },
},
);

module.exports = User;
