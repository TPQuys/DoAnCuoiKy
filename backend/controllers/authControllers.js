const supabase = require('../supabase/supabaseClient');
const jwt = require("jsonwebtoken");
const User = require('../models/User'); // Import model User

let refreshTokens = [];

const authController = {
    // Register

    registerUser: async (req, res) => {
        try {
            const { user, error } = await supabase.auth.signUp({
                email: req.body.email,
                password: req.body.password,
            });
    
            if (error) {
                return res.status(400).json({ message: error.message });
            }
    
            const newUser = await User.create({
                email: req.body.email,
            });
    
            res.status(200).json({ 
                message: 'Người dùng đã được đăng ký! Vui lòng kiểm tra email để xác thực.',
                user: newUser 
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    // Login
    loginUser: async (req, res) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: req.body.email,
                password: req.body.password,
            });
    
            if (error) {
                console.log('Supabase Error:', error);
                return res.status(400).json(error.message);
            }
            
            const user = data.user;
            console.log(user);
    
            if (user) {
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);
    
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });
    
                res.status(200).json({ user, accessToken });
            } else {
                return res.status(404).json("User not found");
            }
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
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
        const { error } = await supabase.auth.signOut();
        if (error) return res.status(400).json(error.message);

        res.status(200).json("Logout Successful");
    },

};

module.exports = authController;
