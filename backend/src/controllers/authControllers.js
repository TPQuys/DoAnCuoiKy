const authService = require('../services/authServices');

const authController = {
    registerUser: async (req, res) => {
        try {
            const newUser = await authService.registerUser(req.body.email, req.body.password);
            res.status(200).json({
                message: 'Người dùng đã được đăng ký! Vui lòng kiểm tra email để xác thực.',
                user: newUser.dataValues
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    loginUser: async (req, res) => {
        try {
            const user = await authService.loginUser(req.body.email, req.body.password);
            const accessToken = authService.generateAccessToken(user);
            const { password, ...other } = user;
            res.status(200).json({ user: other, accessToken });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    userLogout: async (req, res) => {
        try {
            res.status(200).json({ message: "Đăng xuất thành công." });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = authController;
