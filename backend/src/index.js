require('dotenv').config(); 
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sequelize = require("./utils/supabase/connection")
const authRoute = require("./routes/authRoutes")
const userRoute = require("./routes/userRoutes");
const roomRoute = require("./routes/roomRoutes")
const eventRoutes = require('./routes/eventRoutes');
const menuRoutes = require("./routes/menuRoutes");
const bookingRoutes = require("./routes/bookingRoutes")
const paymentRoutes = require("./routes/paymentRoutes")
const app = express();


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

app.use("/v1/auth", authRoute); 
app.use("/v1/user" ,userRoute);
app.use("/v1/room" ,roomRoute);
app.use('/v1/event', eventRoutes);
app.use('/v1/menu', menuRoutes);
app.use('/v1/booking', bookingRoutes);
app.use('/v1/payment', paymentRoutes);

// Khởi động server
const PORT = process.env.PORT || 8000;  // Sử dụng PORT từ môi trường nếu có
app.listen(PORT, () => {     // Lắng nghe trên 0.0.0.0 để Fly.io có thể truy cập
    console.log(`Server is running on port ${PORT}`);
});

