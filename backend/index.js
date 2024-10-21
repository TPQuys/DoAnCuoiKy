require('dotenv').config(); 
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sequelize = require("./src/utils/supabase/connection");

const authRoute = require("./src/routes/authRoutes")
const userRoute = require("./src/routes/userRoutes");
const roomRoute = require("./src/routes/roomRoutes")
const eventRoutes = require('./src/routes/eventRoutes');
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
// Khởi động server
app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
