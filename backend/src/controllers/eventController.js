// controllers/eventController.js
const eventService = require('../services/eventService');

const eventController = {
    // Tạo sự kiện mới
    createEvent: async (req, res) => {
        try {
            const newEvent = await eventService.createEvent(req.body);
            res.status(201).json(newEvent);
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message });
        }
    },

    // Cập nhật sự kiện
    updateEvent: async (req, res) => {
        const { id } = req.params;
        try {
            const updatedEvent = await eventService.updateEvent(id, req.body);
            res.status(200).json(updatedEvent);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Xóa sự kiện
    deleteEvent: async (req, res) => {
        const { id } = req.params;
        try {
            const message = await eventService.deleteEvent(id);
            res.status(200).json({ message });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    // Xóa sự kiện
    getRoomBooked: async (req, res) => {
        try {
            const {EventDate} = req.body
            console.log(req.body)
            const response = await eventService.getRoomBooked(EventDate);
            console.log(response)
            res.status(200).json(response);
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message });
        }
    },

};

module.exports = eventController;
