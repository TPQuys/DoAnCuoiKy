const Decore = require('../models/Decore');
const { Op } = require('sequelize');
const DecorePrice = require('../models/DecorePrice');

// Hàm thêm mới Decore
const addDecore = async (req, res) => {
    try {
        const { LobbyDecore, StageDecore, TableDecore, DecorePriceID } = req.body;

        const newDecore = await Decore.create({
            LobbyDecore,
            StageDecore,
            TableDecore,
            DecorePriceID
        });

        res.status(201).json(newDecore);
    } catch (error) {
        console.error("Error adding decore:", error);
        res.status(500).json({ message: "Error adding decore" });
    }
};

// Hàm lấy tất cả các Decore
const getAllDecores = async (req, res) => {
    try {
        const decors = await Decore.findAll();
        res.status(200).json(decors);
    } catch (error) {
        console.error("Error fetching decors:", error);
        res.status(500).json({ message: "Error fetching decors" });
    }
};

// Hàm lấy Decore theo ID
const getDecoreById = async (req, res) => {
    const { decoreId } = req.params;

    try {
        const decore = await Decore.findByPk(decoreId);
        if (!decore) {
            return res.status(404).json({ message: "Decore not found" });
        }
        res.status(200).json(decore);
    } catch (error) {
        console.error("Error fetching decore:", error);
        res.status(500).json({ message: "Error fetching decore" });
    }
};

const getDecorePrice = async (req, res) => {
    try {
        const decore = await DecorePrice.findAll();
        if (!decore) {
            return res.status(404).json({ message: "Decore price not found" });
        }
        console.log(decore)
        res.status(200).json(decore);
    } catch (error) {
        console.error("Error fetching decore:", error);
        res.status(500).json({ message: "Error fetching decore" });
    }
};

// Hàm cập nhật Decore
const updateDecore = async (req, res) => {
    const { decoreId } = req.params;
    const { LobbyDecore, StageDecore, TableDecore } = req.body;

    try {
        const decore = await Decore.findByPk(decoreId);
        if (!decore) {
            return res.status(404).json({ message: "Decore not found" });
        }

        await decore.update({
            LobbyDecore,
            StageDecore,
            TableDecore,
        });

        res.status(200).json(decore);
    } catch (error) {
        console.error("Error updating decore:", error);
        res.status(500).json({ message: "Error updating decore" });
    }
};

// Hàm xóa Decore
const deleteDecore = async (req, res) => {
    const { decoreId } = req.params;

    try {
        const decore = await Decore.findByPk(decoreId);
        if (!decore) {
            return res.status(404).json({ message: "Decore not found" });
        }

        await decore.destroy();
        res.status(200).json({ message: "Decore deleted successfully" });
    } catch (error) {
        console.error("Error deleting decore:", error);
        res.status(500).json({ message: "Error deleting decore" });
    }
};

module.exports = {
    addDecore,
    getAllDecores,
    getDecoreById,
    updateDecore,
    deleteDecore,
    getDecorePrice
};
