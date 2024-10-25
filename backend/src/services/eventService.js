const eventRepository = require('../repositories/eventRository');

const eventService = {
    createEvent: async (eventData) => {
        return await eventRepository.create(eventData);
    },

    createEvent: async (eventData) => {
        const { RoomEventID, EventDate, Time } = eventData;
    
        // Tìm sự kiện trùng RoomEventID, EventDate và Time
        const existingEvent = await eventRepository.findByRoomAndTime(RoomEventID, EventDate, Time);
    
        // Nếu có sự kiện trùng, báo lỗi với thông báo cụ thể
        if (existingEvent) {
            if (existingEvent.Time === 'MORNING') {
                throw new Error("Phòng này đã được đặt vào buổi sáng.");
            } else if (existingEvent.Time === 'AFTERNOON') {
                throw new Error("Phòng này đã được đặt vào buổi chiều.");
            } else if (existingEvent.Time === 'ALLDAY') {
                throw new Error("Phòng này đã được đặt cả ngày.");
            }
        }
    
        // Nếu không có sự kiện trùng, tiếp tục tạo mới sự kiện
        const newEvent = await eventRepository.create(eventData);
        return newEvent;
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
