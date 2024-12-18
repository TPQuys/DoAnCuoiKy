const { Op, Sequelize } = require('sequelize');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const RoomEvent = require('../models/RoomEvent');
const User = require('../models/User');

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
                                Sequelize.literal(`"Booking"."BookingTime" + INTERVAL '1 day'`),
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

    findByTime: async ( EventDate, Time, From, To) => {
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
                },
                {
                    model: RoomEvent,
                    attributes: ["RoomEventID"],
                }
            ],
            attributes: ['Time', "From", "To", "EventDate"],
            where: {
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
                                Sequelize.literal(`"Booking"."BookingTime" + INTERVAL '1 day'`),
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

    findByRoom: async (EventDate) => {
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
                    ],

                }, {
                    model: RoomEvent,
                    attributes: ["RoomEventID"],
                }
            ],
            attributes: ['Time', "From", "To", "EventDate"],
            where: {
                [Op.and]: [
                    Sequelize.where(
                        Sequelize.fn('DATE', Sequelize.col('EventDate')),
                        '=',
                        Sequelize.fn('DATE', EventDate)
                    ),
                    {
                        [Op.or]: [
                            Sequelize.where(
                                Sequelize.literal(`"Booking"."BookingTime" + INTERVAL '1 day'`),
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

    findByRoomAndDate: async (RoomEventID, EventDate) => {
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
            attributes: ['Time', "From", "To", "EventDate"],
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
                                Sequelize.literal(`"Booking"."BookingTime" + INTERVAL '1 day'`),
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

    checkPendingBookings: async (userId) => {
        return await Booking.findAll({
            include: [
                {
                    model: Payment,
                    attributes: ["PaymentID"]
                },
                {
                    model: User,
                    attributes: ["id"],
                    where: { id: userId } // Điều kiện kiểm tra user.id = userId
                },
            ],
            where: {
                [Op.and]: [
                    Sequelize.where(
                        Sequelize.literal(`"Booking"."BookingTime" + INTERVAL '1 day'`),
                        '>',
                        Sequelize.literal('NOW()')
                    ),
                    { '$Payment.PaymentID$': { [Op.is]: null } } // Kiểm tra thanh toán chưa thực hiện
                ]
            }
        });
    },
    

    create: async (eventData) => {
        return await Event.create(eventData);
    },

    update: async (eventId, updatedData) => {
        const event = await eventRepository.findById(eventId);
        console.log(updatedData)
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
