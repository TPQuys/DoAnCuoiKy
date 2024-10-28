const User = require('../models/User'); // Import model User

class UserRepository {
    async createUser(userData) {
        try {
            const newUser = await User.create(userData);
            return newUser;
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Could not create user");
        }
    }

    async getAllUsers() {
        try {
            const users = await User.findAll();
            return users;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw new Error("Could not fetch users");
        }
    }

    async getUserById(userId) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        } catch (error) {
            console.error("Error fetching user:", error);
            throw new Error("Could not fetch user");
        }
    }

    async updateUser(userId, updatedData) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error("User not found");
            }
            await user.update(updatedData);
            return user;
        } catch (error) {
            console.error("Error updating user:", error);
            throw new Error("Could not update user");
        }
    }

    async deleteUser(userId) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error("User not found");
            }
            await user.destroy();
            return { message: "User deleted successfully" };
        } catch (error) {
            console.error("Error deleting user:", error);
            throw new Error("Could not delete user");
        }
    }
}

module.exports = new UserRepository();
