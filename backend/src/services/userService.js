const UserRepository = require('../repositories/userRepository');

class UserService {
    async createUser(userData) {
        return await UserRepository.createUser(userData);
    }

    async getAllUsers() {
        return await UserRepository.getAllUsers();
    }

    async getUserById(userId) {
        return await UserRepository.getUserById(userId);
    }

    async updateUser(userId, updatedData) {
        const { password, email, admin, ...allowedUpdates } = updatedData;

        // Gọi UserRepository với chỉ các trường được phép cập nhật
        const updatedUser = await UserRepository.updateUser(userId, allowedUpdates);

        // Loại bỏ trường `password` khỏi dữ liệu trả về
        const { password: _, ...otherData } = updatedUser.dataValues;

        return otherData;
    }

    async deleteUser(userId) {
        return await UserRepository.deleteUser(userId);
    }
}

module.exports = new UserService();
