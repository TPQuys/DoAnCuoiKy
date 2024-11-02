const User = require('../models/User');
const UserRepository = require('../repositories/userRepository');
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const supabase = require('../utils/supabase/supabaseClient');
const { Op } = require('sequelize');
require('dotenv').config();

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
        const { password, email, admin, tokenExpiry, resetToken, ...allowedUpdates } = updatedData;

        // Gọi UserRepository với chỉ các trường được phép cập nhật
        const updatedUser = await UserRepository.updateUser(userId, allowedUpdates);

        // Loại bỏ trường `password` khỏi dữ liệu trả về
        const { password: _, tokenExpiry: __, resetToken:___,...otherData } = updatedUser.dataValues;

        return otherData;
    }

    async sendResetPassword(email) {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error("Email không tồn tại.");
        }

        // Tạo mã token reset
        const token = crypto.randomBytes(32).toString('hex');
        user.resetToken = token;
        user.tokenExpiry = Date.now() + 3600000; // Hết hạn sau 1 giờ
        await user.save();

        // Cấu hình transporter email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Nội dung email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            html: `<p>Bấm vào đường link sau để reset mật khẩu của bạn:</p>
                   <a href="${process.env.FRONTEND_URL}/reset_password?token=${token}">Reset Password</a>`
        };

        // Gửi email
        await transporter.sendMail(mailOptions);

        return "Email reset mật khẩu đã được gửi."
    };


    async updatePassword(token, newPassword) {
        const user = await User.findOne({
            where: {
                resetToken: token,
                tokenExpiry: { [Op.gt]: Date.now() }  // kiểm tra token chưa hết hạn
            }
        });

        if (!user) {
            return "Token không hợp lệ hoặc đã hết hạn."
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(newPassword, salt);

        user.password = hashed;
        user.resetToken = null;
        user.tokenExpiry = null;
        await user.save();
        return "Cài lại mật khẩu thành công"

    }

    async updateAvatar(userId, avatarFile) {
        // Tải ảnh lên Supabase
        const { data, error } = await supabase.storage
            .from('Event') // Tên bucket
            .upload(`public/${userId}/avatar.png`, avatarFile.buffer, {
                cacheControl: '3600',
                contentType: avatarFile.mimetype, // Đặt contentType từ file
                upsert: true // Nếu đã tồn tại thì ghi đè
            });

        if (error) {
            throw new Error("Không thể tải ảnh lên: " + error.message);
        }

        if (data) {
            // Lấy URL của ảnh vừa tải lên
            const avatarUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/Event/public/${userId}/avatar.png`;

            // Cập nhật avatar URL vào cơ sở dữ liệu
            const user = await UserRepository.updateUser(userId, { avatar: avatarUrl });
            console.log(user)
            return avatarUrl; // Trả về URL của avatar
        }
    }

    async deleteUser(userId) {
        return await UserRepository.deleteUser(userId);
    }
}

module.exports = new UserService();
