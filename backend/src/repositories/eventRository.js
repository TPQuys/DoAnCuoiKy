const { Op, Sequelize } = require('sequelize');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

const eventRepository = {
    findAll: async () => {
        return await Event.findAll();
    },

    findById: async (eventId) => {
        return await Event.findByPk(eventId);
    },

    findByRoomAndTime: async (RoomEventID, EventDate, Time) => {
        return await Event.findOne({
            include: [
                {
                    model: Booking,
                    attributes: ["BookingTime"],
                    include: [
                        {
                            model: Payment,
                            attributes: ["PaymentID"]
                        }
                    ]
                }
            ],
            where: {
                RoomEventID,
                [Op.and]: [
                    Sequelize.where(
                        Sequelize.fn('DATE', Sequelize.col('EventDate')),
                        '=',
                        Sequelize.fn('DATE', EventDate)
                    ),
                    {
                        [Op.or]: [
                            { Time: 'ALLDAY' },
                            {
                                Time: Time === 'ALLDAY'
                                    ? { [Op.in]: ['MORNING', 'AFTERNOON'] }
                                    : Time
                            }
                        ]
                    },
                    {
                        [Op.or]: [
                            // Kiểm tra nếu thời gian hiện tại đã vượt qua BookingTime + 15 phút
                            Sequelize.where(
                                Sequelize.literal(`"Booking"."BookingTime" + INTERVAL '15 minutes'`),
                                '>',
                                Sequelize.literal('NOW()')
                            ),
                            // Kiểm tra nếu Payment đã được thanh toán (PaymentID không null)
                            { '$Booking.Payment.PaymentID$': { [Op.ne]: null } }
                        ]
                    }
                ]
            }
        });
    },

    create: async (eventData) => {
        return await Event.create(eventData);
    },

    update: async (eventId, updatedData) => {
        const event = await eventRepository.findById(eventId);
        if (!event) throw new Error("Sự kiện không tồn tại.");
        return await event.update(updatedData);
    },

    delete: async (eventId) => {
        const event = await eventRepository.findById(eventId);
        if (!event) throw new Error("Sự kiện không tồn tại.");
        await event.destroy();
        return "Sự kiện đã được xóa thành công.";
    }
};

module.exports = eventRepository;
