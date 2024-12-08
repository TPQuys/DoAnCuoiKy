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


    findByRoomAndTime: async (RoomEventID, EventDate, Time, From, To) => {
        const timeCondition = {
            [Op.or]: [
                { Time: 'ALLDAY' },
                {
                    Time: Time === 'ALLDAY'
                        ? { [Op.in]: ['MORNING', 'AFTERNOON', 'CUSTOM'] }
                        : Time
                },
                {
                    Time: 'CUSTOM',
                    [Op.and]: [
                        From ? { From: { [Op.lt]: To } } : {},
                        To ? { To: { [Op.gt]: From } } : {}
                    ]
                }
            ]
        };

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
                    timeCondition,
                    {
                        [Op.or]: [
                            Sequelize.where(
                                Sequelize.literal(`"Booking"."BookingTime" + INTERVAL '15 minutes'`),
                                '>',
                                Sequelize.literal('NOW()')
                            ),
                            { '$Booking.Payment.PaymentID$': { [Op.ne]: null } }
                        ]
                    }
                ]
            }
        });
    },

    findByRoom: async (RoomEventID, EventDate) => {

        return await Event.findAll({
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
            attributes:['Time',"From","To","EventDate"],
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
                            Sequelize.where(
                                Sequelize.literal(`"Booking"."BookingTime" + INTERVAL '15 minutes'`),
                                '>',
                                Sequelize.literal('NOW()')
                            ),
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
