// controllers/roomEventController.js
const roomEventService = require('../services/roomEventServices');
const { v4: uuidv4 } = require('uuid');
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
        try {
            console.log(req.body)
            const { RoomEventID, ...orther } = req.body
            const newRoomEvent = await roomEventService.createRoomEvent(orther);
            res.status(201).json(newRoomEvent);  // Trả về RoomEvent mới được tạo
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // Cập nhật RoomEvent
    updateRoomEvent: async (req, res) => {
        try {
            const RoomEvent = await roomEventService.updateRoomEvent(req.params.id, req.body);
            res.status(200).json(RoomEvent);
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
            console.log(error)
        }
    },

    getRoomEventById: async (req, res) => {
        try {
            const room = await roomEventService.getRoomEventsById(req.params.id);
            res.status(200).json(room);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    uploadRoom: async (req, res) => {
        const roomId = req.params.id;
        const roomData = req.body;

        try {

            if (!req.file) {
                const room = await roomEventService.updateRoomEvent(roomId, roomData)
                res.status(200).json( room );
            }

            const imageUrl = await roomEventService.uploadRoomImage(roomId, req.file);

            if (imageUrl) {
                const room = await roomEventService.updateRoomEvent(roomId, { ...roomData, RoomImage: imageUrl })
                res.status(200).json( room );
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    addRoom: async (req, res) => {
        const roomId = uuidv4();
        const roomData = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "Không có tệp nào được tải lên." });
        }

        try {
            const imageUrl = await roomEventService.uploadRoomImage(roomId, req.file);

            if (imageUrl) {
                const room = await roomEventService.createRoomEvent({ ...roomData, RoomImage: imageUrl, RoomEventID: roomId })
                res.status(200).json(room);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
module.exports = roomEventController;
