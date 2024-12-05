const supabase = require('../utils/supabase/supabaseClient');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRepository = require('../repositories/authRepository');

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
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };
    
        const options = {
            expiresIn: "1h", 
        };
    
        return jwt.sign(payload, process.env.JWT_ACCESS_KEY, options);
    },
    
    logoutUser: async () => {
        return "Đăng xuất thành công.";
    },
};

module.exports = authService;
