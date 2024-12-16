const RequireDay = require('../models/RequireDay');
const eventRepository = require('../repositories/eventRository');
const roomEventRepository = require('../repositories/roomEventRepository');
const supabase = require('../utils/supabase/supabaseClient');

const roomEventService = {
    getAllRoomEvents: async () => {
        return await roomEventRepository.findAll();
    },

    getRoomEventsById: async (id) => {
        return await roomEventRepository.findById(id);
    },

    findAvailableRooms: async (EventDate, Time, From, To, TotalTable) => {
        // console.log(EventDate, Time, From, To)
        const roomBooked = await eventRepository.findByRoom(EventDate);
        const allRoom = await roomEventRepository.findAll();


        // Lọc các phòng chưa được đặt (không có sự kiện trong ngày EventDate)
        const filteredRooms = allRoom.filter((room) => {
            // Kiểm tra nếu phòng này không có sự kiện nào trùng với EventDate
            return !roomBooked.find((event) => {
                if (room.RoomEventID === event.RoomEvent.RoomEventID) {
                    if (event.Time === "CUSTOM") {
                        const fromTime = new Date(From)
                        const toTime = new Date(To)
                        if (
                            (new Date(event.From) < toTime && new Date(event.To) > fromTime) ||
                            (new Date(event.From) >= fromTime && new Date(event.To) <= toTime)
                          )  {
                            return event
                        }
                    }
                    else {
                        if (event.Time === Time) {
                            return event
                        } if (Time === "ALLDAY") {
                            return event
                        } if (event.Time === "ALLDAY") {
                            return event
                        }
                    }
                }
            });
        });
        const filteredTableRoom = filteredRooms.filter((room) => {
            if(TotalTable<=6 && room.MaxTable <=6){
                return room
            }
            if(room.MaxTable*1.1 >= TotalTable && room.MaxTable*0.7 <= TotalTable){
                return room
            }

        })
        const fillterRequỉeDay = filteredTableRoom.filter((room)=>{
            console.log(new Date().getTime() + (room.RequireDay * 86400000))
            console.log(new Date(EventDate).getTime())
            if (new Date().getTime() + (room.RequireDay * 86400000) < new Date(EventDate).getTime()) {
                console.log(true)
                return room;
            }
        })
        // console.log(filteredTableRoom);
        return fillterRequỉeDay
    },

    createRoomEvent: async (data) => {
        const newRoomEvent = await roomEventRepository.create(data);
        return newRoomEvent;
    },

    updateRoomEvent: async (id, data) => {
        const roomEvent = await roomEventRepository.findById(id);
        if (!roomEvent) {
            throw new Error("RoomEvent not found");
        }
        return await roomEventRepository.update(roomEvent, data);
    },

    deleteRoomEvent: async (id) => {
        const roomEvent = await roomEventRepository.findById(id);
        if (!roomEvent) {
            throw new Error("RoomEvent not found");
        }

        // Kiểm tra xem RoomEvent có bất kỳ Event nào liên kết hay không
        const events = await roomEvent.getEvents();
        if (events.length > 0) {
            throw new Error("Cannot delete RoomEvent because it has associated events");
        }

        await roomEventRepository.destroy(roomEvent);
    },

    uploadRoomImage: async (roomId, imageFile) => {
        // Tải ảnh lên Supabase
        const { data, error } = await supabase.storage
            .from('Event') // Tên bucket
            .upload(`roomImage/${roomId}.png`, imageFile.buffer, {
                cacheControl: '3600',
                contentType: imageFile.mimetype, // Đặt contentType từ file
                upsert: true // Nếu đã tồn tại thì ghi đè
            });

        if (error) {
            throw new Error("Không thể tải ảnh lên: " + error.message);
        }

        if (data) {
            // Lấy URL của ảnh vừa tải lên
            const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/Event/roomImage/${roomId}.png`;
            return imageUrl; // Trả về URL của avatar
        }
    }
};

module.exports = roomEventService;
