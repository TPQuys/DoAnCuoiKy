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
    }
};

module.exports = roomEventRepository;
