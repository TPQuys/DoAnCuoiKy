const { Op, Sequelize } = require('sequelize');
const RoomEvent = require('../models/RoomEvent');
const Event = require('../models/Event');

const roomEventRepository = {
    findAll: async () => {
        return await RoomEvent.findAll();
    },

    findById: async (id) => {
        return await RoomEvent.findByPk(id);
    },

    create: async (data) => {
        return await RoomEvent.create(data);
    },

    update: async (roomEvent, data) => {
        return await roomEvent.update(data);
    },

    destroy: async (roomEvent) => {
        return await roomEvent.destroy();
    },

    close: async (id) => {
        const [updatedCount] = await RoomEvent.update({ Status: "CLOSE" }, {
            where: { RoomEventID: id } // Đảm bảo bạn cung cấp điều kiện where
        });
        if (updatedCount === 0) {
        throw new Error("RoomEvent not found or already closed");
    }
    
    return updatedCount; // Trả về số bản ghi đã được cập nhật
    },
    findAvailableRoomsByTime: async (EventDate, Time, From, To) => {
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
    
        return await RoomEvent.findAll({
            where: {
                Status: 'OPEN', // Kiểm tra các phòng có trạng thái là "OPEN"
            },
            include: [
                {
                    model: Event,
                    where: {
                        [Op.and]: [
                            Sequelize.where(
                                Sequelize.fn('DATE', Sequelize.col('EventDate')),
                                '=',
                                Sequelize.fn('DATE', EventDate)
                            ),
                            timeCondition
                        ]
                    },
                }
            ]
        });
    }
};

module.exports = roomEventRepository;
