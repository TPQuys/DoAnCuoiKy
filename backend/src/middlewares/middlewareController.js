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
            if ( req.user.role==='ADMIN') {
                next();
            } else {
                res.status(403).json({ message: "Bạn không có quyền truy cập." });
            }
        });
    },

    verifyTokenHR: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if ( req.user.role==='ADMIN'||req.user.role==='HR') {
                next();
            } else {
                res.status(403).json({ message: "Bạn không có quyền truy cập." });
            }
        });
    },
    verifyTokenManager: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if ( req.user.role==='ADMIN'||req.user.role==='MANAGER') {
                next();
            } else {
                res.status(403).json({ message: "Bạn không có quyền truy cập." });
            }
        });
    },
    verifyTokenAccountant: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if ( req.user.role==='ADMIN'||req.user.role==='ACCOUNTANT') {
                next();
            } else {
                res.status(403).json({ message: "Bạn không có quyền truy cập." });
            }
        });
    }
};

module.exports = middlewareController;
