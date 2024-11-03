const RoomEvent = require('../models/RoomEvent');

const roomEventRepository = {
    findAll: async () => {
        return await RoomEvent.findAll();
    },

    findById: async (id) => {
        return await RoomEvent.findByPk(id);
    },

    create: async (data) => {
        return await RoomEvent.create(data);
    },

    update: async (roomEvent, data) => {
        return await roomEvent.update(data);
    },

    destroy: async (roomEvent) => {
        return await roomEvent.destroy();
    },

    close: async (id) => {
        const [updatedCount] = await RoomEvent.update({ Status: "CLOSE" }, {
            where: { RoomEventID: id } // Đảm bảo bạn cung cấp điều kiện where
        });
        if (updatedCount === 0) {
        throw new Error("RoomEvent not found or already closed");
    }
    
    return updatedCount; // Trả về số bản ghi đã được cập nhật
    }
};

module.exports = roomEventRepository;
