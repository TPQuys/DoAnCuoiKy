const Booking = require('../models/Booking'); // Import model Booking
const Event = require('../models/Event'); // Đường dẫn tới model Event
const Menu = require('../models/Menu'); // Đường dẫn tới model Menu
const Food = require('../models/Food'); // Đường dẫn tới model Food
const Drink = require('../models/Drink'); // Đường dẫn tới model Drink
const RoomEvent = require('../models/RoomEvent');
const Payment = require('../models/Payment');
const User = require('../models/User');
class BookingRepository {
    // Tạo một booking mới
    async createBooking(bookingData) {
        try {
            const newBooking = await Booking.create(bookingData);
            return newBooking;
        } catch (error) {
            console.error("Error creating booking:", error);
            throw new Error("Could not create booking");
        }
    }

    // Lấy toàn bộ booking
    async getAllBookings() {
        try {
            const bookings = await Booking.findAll({
                include: ['User', 'Event'] // Bao gồm liên kết với User và Event nếu cần
            });
            return bookings;
        } catch (error) {
            console.error("Error fetching bookings:", error);
            throw new Error("Could not fetch bookings");
        }
    }

    // Lấy booking theo ID
    async getBookingById(bookingId) {
        try {
            const booking = await Booking.findByPk(bookingId, {
                attributes:["BookingID"],
                include: [
                    {
                        model:Event,
                        include: [
                            {
                                model: Menu,
                                include: [
                                    {
                                        model: Food,
                                        through: { attributes: ["Quantity"] }, 
                                    },
                                    {
                                        model: Drink,
                                        through: { attributes: ["Quantity"] }, 
                                    }
                                ]
                            },
                            {
                                model:RoomEvent,
                            }
                        ]
                    },
                    {
                        model:Payment,
                    },
                    {
                        model:User,
                        attributes : ["email"]
                    }
                ]
            });
            if (!booking) {
                throw new Error("Booking not found");
            }
            return booking;
        } catch (error) {
            console.error("Error fetching booking:", error);
            throw new Error("Could not fetch booking");
        }
    }

    async getBookingsByUser(UserID) {
        try {
            const bookings = await Booking.findAll({
                attributes: ["BookingID"],
                where: { UserID }, // Tìm tất cả booking của user
                include: [
                    {
                        model: Event,
                        include: [
                            {
                                model: Menu,
                                include: [
                                    {
                                        model: Food,
                                        through: { attributes: ["Quantity"] }, // Lấy số lượng từ bảng trung gian
                                    },
                                    {
                                        model: Drink,
                                        through: { attributes: ["Quantity"] }, // Lấy số lượng từ bảng trung gian
                                    }
                                ]
                            },
                            {
                                model: RoomEvent, // Bao gồm thông tin phòng sự kiện
                            }
                        ]
                    },
                    {
                        model: Payment, // Bao gồm thông tin thanh toán
                    }
                ]
            });
    
            // Nếu không tìm thấy bất kỳ booking nào, ném lỗi
            if (bookings.length === 0) {
                throw new Error("No bookings found for this user");
            }
    
            return bookings; // Trả về danh sách các bookings
        } catch (error) {
            console.error("Error fetching bookings:", error);
            throw new Error("Could not fetch bookings");
        }
    }
    
    // Cập nhật booking theo ID
    async updateBooking(bookingId, updatedData) {
        try {
            const booking = await Booking.findByPk(bookingId);
            if (!booking) {
                throw new Error("Booking not found");
            }
            await booking.update(updatedData);
            return booking;
        } catch (error) {
            console.error("Error updating booking:", error);
            throw new Error("Could not update booking");
        }
    }

    // Xóa booking theo ID
    async deleteBooking(bookingId) {
        try {
            const booking = await Booking.findByPk(bookingId);
            if (!booking) {
                throw new Error("Booking not found");
            }
            await booking.destroy();
            return { message: "Booking deleted successfully" };
        } catch (error) {
            console.error("Error deleting booking:", error);
            throw new Error("Could not delete booking");
        }
    }
}

module.exports = new BookingRepository();