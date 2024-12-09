const Rate = require('../models/Rate');

const rateController = {
    // Tạo đánh giá mới
    createRate: async (req, res) => {
        try {
            console.log(req.body);
            const newRate = await Rate.create(req.body);
            res.status(201).json(newRate);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    },

    // Cập nhật đánh giá
    updateRate: async (req, res) => {
        const { id } = req.params;
        try {
            const rate = await Rate.findByPk(id);
            if (!rate) {
                return res.status(404).json({ message: "Rate not found" });
            }

            await rate.update(req.body);
            res.status(200).json(rate);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    },

    // Xóa đánh giá
    deleteRate: async (req, res) => {
        const { id } = req.params;
        try {
            const rate = await Rate.findByPk(id);
            if (!rate) {
                return res.status(404).json({ message: "Rate not found" });
            }

            await rate.destroy();
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = rateController;
