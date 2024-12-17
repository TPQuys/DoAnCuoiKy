require('dotenv').config();
const express = require("express");
const cors = require("cors");
const socketIo = require('socket.io');
const cookieParser = require("cookie-parser");
const sequelize = require("./utils/supabase/connection");
const authRoute = require("./routes/authRoutes");
const userRoute = require("./routes/userRoutes");
const roomRoute = require("./routes/roomRoutes");
const eventRoutes = require('./routes/eventRoutes');
const menuRoutes = require("./routes/menuRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const decodeRoute = require("./routes/decodeRoute");
const rateRoutes = require("./routes/rateRoutes");
const requireDayRoutes = require("./routes/requireDayRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// Kết nối cơ sở dữ liệu
async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log("Connected to PostgreSQL database");
    } catch (error) {
        console.error("Error connecting to database:", error);
    }
}

connectDB();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Các routes của ứng dụng
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);
app.use("/v1/room", roomRoute);
app.use('/v1/event', eventRoutes);
app.use('/v1/menu', menuRoutes);
app.use('/v1/booking', bookingRoutes);
app.use('/v1/payment', paymentRoutes);
app.use('/v1/decore', decodeRoute);
app.use('/v1/rate', rateRoutes);
app.use('/v1/require_day', requireDayRoutes);
app.use('/v1/chat', chatRoutes);

// Khởi tạo HTTP server và Socket.io
const server = app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${process.env.PORT || 8000}`);
});

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", // Cho phép client từ địa chỉ này kết nối
        methods: ["GET", "POST"],
    }
});

// Import và sử dụng module chatController.js
const { handleSocketConnection } = require('./controllers/chatController');

// Xử lý sự kiện khi một user kết nối
io.on('connection', (socket) => {
    handleSocketConnection(socket, io);  // Gọi function để xử lý các sự kiện socket
});
