const { Op } = require('sequelize');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const Rate = require('../models/Rate');
const RoomEvent = require('../models/RoomEvent');

const rateController = {
    // Tạo đánh giá mới
    createRate: async (req, res) => {
        try {
            console.log(req.body);
            const newRate = await Rate.create(req.body);
            res.status(201).json(newRate);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    },

    getAllBookingRated: async (req, res) => {
        try {
            const rateBookings = await Booking.findAll({
                attributes: ["BookingID", "BookingTime"], // Chỉ lấy các trường từ Booking
                where: { 
                    '$Rate.ReviewID$': { [Op.ne]: null } // Kiểm tra Rate không phải null
                },
                include: [
                    {
                        model: Rate, // Bao gồm Rate
                        attributes: ["Rate", "Comment"], // Chỉ lấy các trường từ Rate
                    },
                    {
                        model: Event, // Bao gồm Event để lấy RoomEvent
                        attributes: ["EventID"],// Bỏ qua các trường của Event
                        include: [
                            {
                                model: RoomEvent, // Chỉ lấy thông tin RoomEvent
                                attributes: ["RoomName", "Capacity"], // Chỉ lấy các trường cần thiết từ RoomEvent
                            },
                        ],
                    },
                ],
            });
            res.status(200).json(rateBookings);
        } catch (error) {
            console.error("Error fetching rated bookings:", error);
            res.status(500).json({ message: "Could not fetch rated bookings." });
        }
    },
    
    // Cập nhật đánh giá
    updateRate: async (req, res) => {
        const { id } = req.params;
        try {
            const rate = await Rate.findByPk(id);
            if (!rate) {
                return res.status(404).json({ message: "Rate not found" });
            }

            await rate.update(req.body);
            res.status(200).json(rate);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    },

    // Xóa đánh giá
    deleteRate: async (req, res) => {
        const { id } = req.params;
        try {
            const rate = await Rate.findByPk(id);
            if (!rate) {
                return res.status(404).json({ message: "Rate not found" });
            }

            await rate.destroy();
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = rateController;
