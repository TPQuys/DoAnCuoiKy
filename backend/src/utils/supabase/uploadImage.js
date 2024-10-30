const multer = require('multer');

// Khởi tạo multer với bộ nhớ tạm
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Xuất upload
module.exports = upload;
