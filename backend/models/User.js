const { Model, DataTypes } = require("sequelize");
const sequelize = require("../supabase/connection");

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
