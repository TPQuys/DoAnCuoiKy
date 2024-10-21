const roomEventRepository = require('../repositories/roomEventRepository');

const roomEventService = {
    getAllRoomEvents: async () => {
        return await roomEventRepository.findAll();
    },

    createRoomEvent: async (data) => {
        const newRoomEvent = await roomEventRepository.create({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return newRoomEvent;
    },

    updateRoomEvent: async (id, data) => {
        const roomEvent = await roomEventRepository.findById(id);
        if (!roomEvent) {
            throw new Error("RoomEvent not found");
        }

        return await roomEventRepository.update(roomEvent, {
            ...data,
            updatedAt: new Date()
        });
    },

    deleteRoomEvent: async (id) => {
        const roomEvent = await roomEventRepository.findById(id);
        if (!roomEvent) {
            throw new Error("RoomEvent not found");
        }

        await roomEventRepository.destroy(roomEvent);
    }
};

module.exports = roomEventService;
