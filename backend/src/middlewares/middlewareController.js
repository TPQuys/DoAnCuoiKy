const jwt = require("jsonwebtoken");

const middlewareController = {
    // Kiểm tra token
    verifyToken: (req, res, next) => {
        const token = req.headers.authorization; // Sử dụng Authorization header
        if (token) {
            const accessToken = token.split(" ")[1]; // Tách lấy access token
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn." }); 
                }
                req.user = user; 
                next(); 
            });
        } else {
            return res.status(401).json({ message: "Bạn chưa đăng nhập." }); // Gửi phản hồi nếu không có token
        }
    },

    // Kiểm tra quyền Admin
    verifyTokenAdmin: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.id === req.params.id || req.user.admin) {
                next();
            } else {
                res.status(403).json({ message: "Bạn không có quyền truy cập." });
            }
        });
    }
};

module.exports = middlewareController;
