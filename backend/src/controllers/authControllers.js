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
            const refreshToken = authService.generateRefreshToken(user);
            authService.addRefreshToken(refreshToken);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });

            const { password, ...other } = user;
            res.status(200).json({ user: other, accessToken });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    requestRefreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        try {
            const { newAccessToken, newRefreshToken } = await authService.requestRefreshToken(refreshToken);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });

            res.status(200).json({ accessToken: newAccessToken });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    },

    userLogout: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        try {
            const message = await authService.logoutUser(refreshToken);
            res.clearCookie("refreshToken");
            res.status(200).json(message);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = authController;
