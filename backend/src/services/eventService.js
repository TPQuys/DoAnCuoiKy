const eventRepository = require('../repositories/eventRository');

const eventService = {
    // createEvent: async (eventData) => {
    //     return await eventRepository.create(eventData);
    // },

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
    },
    getRoomSlots: async (eventData) => {
        const { RoomEventID, EventDate, Time, From = null, To = null } = eventData;

        // Generate default slots
        const defaultSlots = generateSlots(8, 18); // From 8:00 to 18:00
    
        // Get events that might conflict with the given room and time
        const events = await findByRoomAndTime(RoomEventID, EventDate, Time, From, To);
    
        if (!events) {
            return defaultSlots;
        }
    
        // Mark slots as "booked" if they overlap with existing events
        const bookedSlots = events.Booking.map((booking) => ({
            start: booking.From,
            end: booking.To,
        }));
    
        const updatedSlots = defaultSlots.map((slot) => {
            const isOverlapping = bookedSlots.some(
                (booked) =>
                    (slot.start >= booked.start && slot.start < booked.end) || // Start is within a booked slot
                    (slot.end > booked.start && slot.end <= booked.end) || // End is within a booked slot
                    (slot.start <= booked.start && slot.end >= booked.end) // Slot fully overlaps booked slot
            );
    
            return {
                ...slot,
                status: isOverlapping ? 'booked' : 'available',
            };
        });
    
        return updatedSlots;
    }
    
};

module.exports = eventService;
