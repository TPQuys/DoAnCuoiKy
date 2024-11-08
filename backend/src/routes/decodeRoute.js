const express = require('express');
const router = express.Router();
const {
    addDecore,
    getAllDecores,
    getDecoreById,
    updateDecore,
    deleteDecore
} = require('../controllers/decoreController');

// Route thêm mới Decore
router.post('/', addDecore);

// Route lấy tất cả Decore
router.get('/', getAllDecores);

// Route lấy Decore theo ID
router.get('/:decoreId', getDecoreById);

// Route cập nhật Decore theo ID
router.put('/:decoreId', updateDecore);

// Route xóa Decore theo ID
router.delete('/:decoreId', deleteDecore);

module.exports = router;
