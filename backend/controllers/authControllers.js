const supabase = require('../supabase/supabaseClient');
const jwt = require("jsonwebtoken");
const User = require('../models/User'); // Import model User
const bcrypt = require("bcrypt");

let refreshTokens = [];

const authController = {
    // Register

    registerUser: async (req, res) => {
        try {
            const existingUser = await User.findOne({ where: { email: req.body.email } });
            console.log(existingUser)
            if (existingUser) {
                return res.status(400).json({ message: "Email đã được đăng ký." });
            }
    
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
    
            const { user, error } = await supabase.auth.signUp({
                email: req.body.email,
                password: req.body.password,
            });
    
            if (error) {
                return res.status(400).json({ message: error.message });
            }
    
            const newUser = await User.create({
                email: req.body.email,
                password: hashed,
                isVerified: false // Mặc định người dùng chưa xác thực
            });

            console.log(newUser)

            res.status(200).json({
                message: 'Người dùng đã được đăng ký! Vui lòng kiểm tra email để xác thực.',
                user: newUser.dataValues
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    // Login
    loginUser: async (req, res) => {
        try {
            const response = await User.findOne({ where: { email: req.body.email } }); // Cần sử dụng `where` để tìm kiếm
            const user = response.dataValues
            if (!user) {
                return res.status(404).json("Wrong username");
            }
    
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(404).json("Wrong password");
            }
    
            if (!user.isVerified) {
                // Nếu người dùng chưa được xác thực, thực hiện xác thực với Supabase
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: req.body.email,
                    password: req.body.password,
                });
    
                if (error) {
                    console.log('Supabase Error:', error);
                    return res.status(400).json(error.message);
                } else {
                    // Cập nhật trường isVerified thành true
                    await User.update({ isVerified: true }, { where: { email: req.body.email } });
                }
            }
    
            // Tạo token sau khi xác thực thành công
            const accessToken = authController.generateAccessToken(user);
            const refreshToken = authController.generateRefreshToken(user);
            refreshTokens.push(refreshToken);
            
            // Cấu hình cookie cho refresh token
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            console.log(user)
            const { password, ...other } = user;
            res.status(200).json({ user: other, accessToken });
        } catch (error) {
            console.error('Login Error:', error);
            res.status(500).json("Internal Server Error");
        }
    },
    


    // Generate access token
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id,
            email: user.email,
        }, process.env.JWT_ACCESS_KEY, { expiresIn: "60s" });
    },

    // Generate refresh token
    generateRefreshToken: (user) => {
        return jwt.sign({
            id: user.id,
            email: user.email,
        }, process.env.JWT_REFRESH_KEY, { expiresIn: "9h" });
    },

    // Refresh Token
    requestRefreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json("You're not authenticated");
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json("Refresh token is not valid");
        }

        // Xác thực refresh token
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                return res.status(403).json("Refresh token is not valid");
            }
            // Xóa refresh token cũ và tạo token mới
            refreshTokens = refreshTokens.filter(token => token !== refreshToken);
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);

            // Đặt lại cookie với refreshToken mới
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });

            res.status(200).json({ accessToken: newAccessToken });
        });
    },

    // Logout
    userLogout: async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) return res.status(401).json("Bạn chưa đăng nhập.");
    
            refreshTokens = refreshTokens.filter(token => token !== refreshToken); // Xóa token khỏi danh sách
            res.clearCookie("refreshToken"); // Xóa cookie refresh token
    
            const { error } = await supabase.auth.signOut();
            if (error) return res.status(400).json(error.message);
    
            res.status(200).json("Đăng xuất thành công.");
        } catch (error) {
            console.error('Logout Error:', error);
            res.status(500).json("Lỗi hệ thống.");
        }
    },
    

};

module.exports = authController;
