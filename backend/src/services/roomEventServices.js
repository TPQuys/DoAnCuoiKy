const roomEventRepository = require('../repositories/roomEventRepository');
const supabase = require('../utils/supabase/supabaseClient');

const roomEventService = {
    getAllRoomEvents: async () => {
        return await roomEventRepository.findAll();
    },

    getRoomEventsById: async (id) => {
        return await roomEventRepository.findById(id);
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
