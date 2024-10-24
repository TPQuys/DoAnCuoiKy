const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utils/supabase/connection");

class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
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
        },
    },
    {
        sequelize,
        modelName: "User",
    }
);

module.exports = User;
