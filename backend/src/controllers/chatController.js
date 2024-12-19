// controllers/chatController.js

const Chat = require("../models/Chat");

let adminSocket = null;  // Lưu trữ kết nối của Admin
let userSockets = {};    // Lưu trữ socket của các user theo email
let rooms = [];

const addMessage = async (req, res) => {
    try {
        const newChat = await Chat.create(req.body);
        res.status(200).json(newChat);
    } catch (e) {
        console.error(e)
        res.status(500).json({ message: e.message });
    }
}

const getAllRooms = async (req, res) => {
    try {
        // Truy vấn danh sách các room với thời gian tạo mới nhất
        const rooms = await Chat.findAll({
            attributes: [
                'room',
                [Chat.sequelize.fn('MAX', Chat.sequelize.col('createAt')), 'latestCreateAt']
            ],
            group: ['room'],
            order: [[Chat.sequelize.fn('MAX', Chat.sequelize.col('createAt')), 'DESC']],
            raw: true
        });

        // Format lại kết quả trả về thành mảng các giá trị room
        const roomList = rooms.map(item => item.room);

        // Gửi kết quả về client
        res.status(200).json({ rooms: roomList });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ message: error.message });
    }
};



const getAllMessage = async (req, res) => {
    try {
        // Tìm 20 tin nhắn cuối cùng trong Room, sắp xếp theo thời gian giảm dần
        const chats = await Chat.findAll({
            where: { room: req.params.id },
            order: [['createAt', 'DESC']],  // Sắp xếp theo thời gian tin nhắn
            limit: 20, // Giới hạn số lượng tin nhắn trả về
        });

        // Đảo ngược lại để hiển thị tin nhắn từ cũ đến mới
        res.status(200).json(chats.reverse());
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


const handleSocketConnection = (socket, io) => {
    console.log('A user connected: ' + socket.id);

    // Xác định user có phải là admin hay không
    socket.on('setRole', (role) => {
        if (role === 'ADMIN'||"MANAGER") {
            adminSocket = socket;  // Gán kết nối socket của admin
            console.log('Admin connected: ' + socket.id);
        }
    });

    // Đăng ký người dùng và lưu socket theo email
    socket.on('registerUser', (email) => {
        userSockets[email] = socket;  // Lưu socket của user theo email
        socket.join(email);  // Gán user vào một room riêng biệt theo email
        if (!rooms.includes(email)) {
            rooms.push(email);  // Thêm phòng mới nếu chưa có
        }
        console.log(`User with email ${email} connected and joined the room.`);
        io.emit('roomList', rooms);  // Gửi danh sách phòng cho Admin
    });

    // Gửi tin nhắn từ user lên phòng và thông báo Admin
    socket.on('sendMessageFromUser', (data) => {
        const { room, message, fromId } = data;
        console.log(message)
        // Lưu tin nhắn vào database
        addMessage({ ...message, room, fromId });

        // Gửi tin nhắn đến phòng của user
        io.to(room).emit('receiveMessage', message);

        // Gửi tin nhắn tới Admin nếu Admin đang kết nối
        if (adminSocket) {
            adminSocket.emit('receiveMessage', message);
        }

        console.log(`Message sent by user ${message.email} to room ${room}: ${message.message}`);
    });

    // Gửi tin nhắn tới tất cả người dùng trong phòng (Admin gửi tin)
    socket.on('sendMessageToRoom', (data) => {
        const { room, message } = data;

        // Gửi tin nhắn đến phòng của user
        io.to(room).emit('receiveMessage', message);

        // Gửi tin nhắn tới Admin nếu Admin đang kết nối
        if (adminSocket) {
            adminSocket.emit('receiveMessage', message);
        }

        console.log(`Message sent by user ${message.email} to room ${room}: ${message.message}`);
    });


    // Lắng nghe sự kiện 'disconnect' khi client ngắt kết nối
    socket.on('disconnect', () => {
        console.log('User disconnected');
        // Xóa user khỏi danh sách socket khi họ ngắt kết nối
        for (let email in userSockets) {
            if (userSockets[email] === socket) {
                delete userSockets[email];
                rooms = rooms.filter(room => room !== email);  // Xóa phòng nếu user ngắt kết nối
                console.log(`User with email ${email} disconnected.`);
                break;
            }
        }
        // Cập nhật danh sách phòng cho Admin
        io.emit('roomList', rooms);
    });
};

// Export function để sử dụng trong server
module.exports = {
    handleSocketConnection,
    getAllMessage,
    getAllRooms,
    addMessage
};
