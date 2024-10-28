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
};
