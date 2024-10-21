const User = require('../models/User');

const authRepository = {
    findUserByEmail: async (email) => {
        return await User.findOne({ where: { email } });
    },

    createUser: async (email, hashedPassword) => {
        return await User.create({
            email,
            password: hashedPassword,
            isVerified: false,
        });
    },

    updateUser: async (email, updates) => {
        return await User.update(updates, { where: { email } });
    },
};

module.exports = authRepository;
