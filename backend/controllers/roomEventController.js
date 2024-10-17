const RoomEvent = require("../models/RoomEvent");

const roomEventController = {
    // Lấy tất cả RoomEvent
    getAllRoomEvents: async (req, res) => {
        try {
            const roomEvents = await RoomEvent.findAll();  
            res.status(200).json(roomEvents);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // Tạo RoomEvent mới
    createRoomEvent: async (req, res) => {
        const { RoomEventID, HeightRoom, WidthRoom, Capacity, MaxTable, NumberRoom } = req.body;

        try {
            const newRoomEvent = await RoomEvent.create({
                RoomEventID,
                HeightRoom,
                WidthRoom,
                Capacity,
                MaxTable,
                NumberRoom,
                createdAt: new Date(),  // Thêm timestamp nếu cần
                updatedAt: new Date()   // Thêm timestamp nếu cần
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
            // Tìm RoomEvent theo id (primary key)
            const roomEvent = await RoomEvent.findByPk(req.params.id);

            if (!roomEvent) {
                return res.status(404).json("RoomEvent not found");
            }

            // Cập nhật RoomEvent
            await roomEvent.update({
                HeightRoom,
                WidthRoom,
                Capacity,
                MaxTable,
                NumberRoom,
                updatedAt: new Date()  // Cập nhật timestamp
            });
            res.status(200).json("Cập nhật thành công");
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // Xóa RoomEvent
    deleteRoomEvent: async (req, res) => {
        try {
            // Tìm RoomEvent theo id (primary key)
            const roomEvent = await RoomEvent.findByPk(req.params.id);

            if (!roomEvent) {
                return res.status(404).json("RoomEvent not found");
            }

            // Xóa RoomEvent
            await roomEvent.destroy();  // Sử dụng destroy() để xóa RoomEvent
            res.status(200).json("Xóa thành công");
        } catch (error) {
            res.status(500).json(error);
        }
    }
};

module.exports = roomEventController;
