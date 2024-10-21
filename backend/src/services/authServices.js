// services/authService.js
const supabase = require('../utils/supabase/supabaseClient');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRepository = require('../repositories/authRepository');

let refreshTokens = [];

const authService = {
    registerUser: async (email, password) => {
        const existingUser = await authRepository.findUserByEmail(email);
        if (existingUser) {
            throw new Error("Email đã được đăng ký.");
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            throw new Error(error.message);
        }

        const newUser = await authRepository.createUser(email, hashed);

        return newUser;
    },

    loginUser: async (email, password) => {
        const userRecord = await authRepository.findUserByEmail(email);
        if (!userRecord) {
            throw new Error("Wrong username");
        }

        const validPassword = await bcrypt.compare(password, userRecord.password);
        if (!validPassword) {
            throw new Error("Wrong password");
        }

        let user = userRecord.dataValues;
        if (!user.isVerified) {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw new Error(error.message);
            } else {
                await authRepository.updateUser(email, { isVerified: true });
            }
        }

        return user;
    },

    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id,
            email: user.email,
        }, process.env.JWT_ACCESS_KEY, { expiresIn: "60s" });
    },

    generateRefreshToken: (user) => {
        return jwt.sign({
            id: user.id,
            email: user.email,
        }, process.env.JWT_REFRESH_KEY, { expiresIn: "9h" });
    },

    requestRefreshToken: (refreshToken) => {
        if (!refreshToken) throw new Error("You're not authenticated");
        if (!refreshTokens.includes(refreshToken)) {
            throw new Error("Refresh token is not valid");
        }

        return new Promise((resolve, reject) => {
            jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
                if (err) {
                    return reject("Refresh token is not valid");
                }

                refreshTokens = refreshTokens.filter(token => token !== refreshToken);
                const newAccessToken = authService.generateAccessToken(user);
                const newRefreshToken = authService.generateRefreshToken(user);
                refreshTokens.push(newRefreshToken);

                resolve({ newAccessToken, newRefreshToken });
            });
        });
    },

    logoutUser: async (refreshToken) => {
        if (!refreshToken) throw new Error("Bạn chưa đăng nhập.");
        
        refreshTokens = refreshTokens.filter(token => token !== refreshToken);
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw new Error(error.message);
        }

        return "Đăng xuất thành công.";
    },

    addRefreshToken: (token) => {
        refreshTokens.push(token);
    },

    removeRefreshToken: (token) => {
        refreshTokens = refreshTokens.filter(t => t !== token);
    }
};

module.exports = authService;
