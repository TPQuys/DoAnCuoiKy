const User = require("../models/User");
const Booking = require("../models/Booking")
const RoomEvent = require("../models/RoomEvent")
const Decore = require("../models/Decore")
const Event = require("../models/Event")
const Menu = require("../models/Menu")
const Payment = require("../models/Payment")


const userController = {
    // Lấy tất cả user
    getAllUser: async (req, res) => {
        try {
            // Sử dụng Sequelize để lấy tất cả user
            const users = await User.findAll();  // Sequelize sử dụng findAll thay vì find
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // Xóa user
    deleteUser: async (req, res) => {
        try {
            // Tìm user theo id (primary key)
            const user = await User.findByPk(req.params.id);

            if (!user) {
                return res.status(404).json("User not found");
            }

            // Xóa user
            await user.destroy();  // Sử dụng destroy() để xóa user
            res.status(200).json("Xóa thành công");
        } catch (error) {
            res.status(500).json(error);
        }
    }
};

module.exports = userController;
