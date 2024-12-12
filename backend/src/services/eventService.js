const eventRepository = require('../repositories/eventRository');

const eventService = {
    // createEvent: async (eventData) => {
    //     return await eventRepository.create(eventData);
    // },

    createEvent: async (eventData) => {
        const { RoomEventID, EventDate, Time, From, To } = eventData;
        if(Time==="CUSTOM"){
            if(From===null){
                throw new Error("Hãy chọn giờ tổ chức")
            }
        }
        const BookingPending = await eventRepository.checkPendingBookings()
        if(BookingPending.length>0){
            throw new Error("Bạn có đơn đặt chưa thanh toán, hãy thanh toán hoặc hủy bỏ trước khi đặt đơn mới!")
        }
        // Tìm sự kiện trùng RoomEventID, EventDate và Time
        const existingEvent = await eventRepository.findByRoomAndTime(RoomEventID, EventDate, Time, From, To);

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

    getRoomBooked: async (RoomEventID, EventDate) => {
        try {
            const res = await eventRepository.findByRoom(RoomEventID, EventDate);
            console.log(res)
            return res

        } catch (e) {
            console.log(e)
        }
    }

};

module.exports = eventService;
