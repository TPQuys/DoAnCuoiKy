// controllers/roomEventController.js
const roomEventService = require('../services/roomEventServices');

const roomEventController = {
    // Lấy tất cả RoomEvent
    getAllRoomEvents: async (req, res) => {
        try {
            const roomEvents = await roomEventService.getAllRoomEvents();  
            res.status(200).json(roomEvents);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // Tạo RoomEvent mới
    createRoomEvent: async (req, res) => {
        const { RoomEventID, HeightRoom, WidthRoom, Capacity, MaxTable, NumberRoom } = req.body;

        try {
            const newRoomEvent = await roomEventService.createRoomEvent({
                RoomEventID,
                HeightRoom,
                WidthRoom,
                Capacity,
                MaxTable,
                NumberRoom
            });
            res.status(201).json(newRoomEvent);  // Trả về RoomEvent mới được tạo
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // Cập nhật RoomEvent
    updateRoomEvent: async (req, res) => {
        const { HeightRoom, WidthRoom, Capacity, MaxTable, NumberRoom } = req.body;

        try {
            await roomEventService.updateRoomEvent(req.params.id, {
                HeightRoom,
                WidthRoom,
                Capacity,
                MaxTable,
                NumberRoom
            });
            res.status(200).json("Cập nhật thành công");
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // Xóa RoomEvent
    deleteRoomEvent: async (req, res) => {
        try {
            await roomEventService.deleteRoomEvent(req.params.id);
            res.status(200).json("Xóa thành công");
        } catch (error) {
            res.status(500).json(error);
        }
    }
};

module.exports = roomEventController;
