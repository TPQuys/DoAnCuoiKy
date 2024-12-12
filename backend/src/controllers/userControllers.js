const UserService = require('../services/userService');
const User = require("../models/User");
const Booking = require("../models/Booking")
const RoomEvent = require("../models/RoomEvent")
const Decore = require("../models/Decore")
const Event = require("../models/Event")
const Menu = require("../models/Menu")
const Payment = require("../models/Payment")
const MenuDrinks = require("../models/MenuDrinks")
const MenuFoods = require("../models/MenuFoods")
const Rate = require("../models/Rate")

// Thêm mới user
const createUser = async (req, res) => {
    try {
        const user = await UserService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy toàn bộ user
const getAllUsers = async (req, res) => {
    try {
        const users = await UserService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy một user theo ID
const getUserById = async (req, res) => {
    try {
        const user = await UserService.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Cập nhật user
const updateUser = async (req, res) => {
    try {
        const updatedUser = await UserService.updateUser(req.params.id, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const sendResetPassword = async (req, res) => {
    try {
        console.log(req.body.email)
        const result = await UserService.sendResetPassword(req.body.email);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const updatePassword = async (req, res) => {
    try {
        const result = await UserService.updatePassword(req.body.token,req.body.newPassword);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const uploadAvatar  = async (req, res) => {
    const userId = req.params.id;

    if (!req.file) {
        return res.status(400).json({ error: "Không có tệp nào được tải lên." });
    }

    try {
        const avatarUrl = await UserService.updateAvatar(userId, req.file); // Gọi hàm updateAvatar
        res.status(200).json({ message: "Avatar đã được cập nhật!", avatarUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Xóa user
const deleteUser = async (req, res) => {
    try {
        const result = await UserService.deleteUser(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    sendResetPassword,
    updatePassword,
    uploadAvatar
};
