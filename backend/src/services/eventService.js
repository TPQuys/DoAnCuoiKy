const eventRepository = require('../repositories/eventRository');

const eventService = {
    createEvent: async (eventData) => {
        return await eventRepository.create(eventData);
    },

    updateEvent: async (eventId, updatedData) => {
        return await eventRepository.update(eventId, updatedData);
    },

    deleteEvent: async (eventId) => {
        return await eventRepository.delete(eventId);
    },

    getAllEvents: async () => {
        return await eventRepository.findAll();
    },

    getEventById: async (eventId) => {
        return await eventRepository.findById(eventId);
    }
};

module.exports = eventService;
