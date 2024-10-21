const User = require("../models/User");
const Booking = require("../models/Booking")
const RoomEvent = require("../models/RoomEvent")
const Decore = require("../models/Decore")
const Event = require("../models/Event")
const Menu = require("../models/Menu")
const Payment = require("../models/Payment")
const MenuDrinks = require("../models/MenuDrinks")
const MenuFoods = require("../models/MenuFoods")

const userController = {
    // Lấy tất cả user
    getAllUser: async (req, res) => {
        try {
            const users = await User.findAll();  
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // Xóa user
    deleteUser: async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);

            if (!user) {
                return res.status(404).json("User not found");
            }
            await user.destroy(); 
            res.status(200).json("Xóa thành công");
        } catch (error) {
            res.status(500).json(error);
        }
    }
};

module.exports = userController;
