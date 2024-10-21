const Event = require('../models/Event');

const eventRepository = {
    findAll: async () => {
        return await Event.findAll();
    },

    findById: async (eventId) => {
        return await Event.findByPk(eventId);
    },

    create: async (eventData) => {
        return await Event.create(eventData);
    },

    update: async (eventId, updatedData) => {
        const event = await eventRepository.findById(eventId);
        if (!event) throw new Error("Sự kiện không tồn tại.");
        return await event.update(updatedData);
    },

    delete: async (eventId) => {
        const event = await eventRepository.findById(eventId);
        if (!event) throw new Error("Sự kiện không tồn tại.");
        await event.destroy();
        return "Sự kiện đã được xóa thành công.";
    }
};

module.exports = eventRepository;
