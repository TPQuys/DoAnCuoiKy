const Payment = require('../models/Payment'); // Import model Payment

class PaymentRepository {
    // Tạo một payment mới
    async createPayment(paymentData) {
        try {
            const newPayment = await Payment.create(paymentData);
            return newPayment;
        } catch (error) {
            console.error("Error creating payment:", error);
            throw new Error("Could not create payment");
        }
    }

    // Lấy toàn bộ payment
    async getAllPayments() {
        try {
            const payments = await Payment.findAll({
                include: ['Booking'] // Bao gồm liên kết với Booking nếu cần
            });
            return payments;
        } catch (error) {
            console.error("Error fetching payments:", error);
            throw new Error("Could not fetch payments");
        }
    }

    // Lấy payment theo ID
    async getPaymentById(paymentId) {
        try {
            const payment = await Payment.findByPk(paymentId, {
                include: ['Booking'] // Bao gồm liên kết với Booking nếu cần
            });
            if (!payment) {
                throw new Error("Payment not found");
            }
            return payment;
        } catch (error) {
            console.error("Error fetching payment:", error);
            throw new Error("Could not fetch payment");
        }
    }

    // Cập nhật payment theo ID
    async updatePayment(paymentId, updatedData) {
        try {
            const payment = await Payment.findByPk(paymentId);
            if (!payment) {
                throw new Error("Payment not found");
            }
            await payment.update(updatedData);
            return payment;
        } catch (error) {
            console.error("Error updating payment:", error);
            throw new Error("Could not update payment");
        }
    }

    // Xóa payment theo ID
    async deletePayment(paymentId) {
        try {
            const payment = await Payment.findByPk(paymentId);
            if (!payment) {
                throw new Error("Payment not found");
            }
            await payment.destroy();
            return { message: "Payment deleted successfully" };
        } catch (error) {
            console.error("Error deleting payment:", error);
            throw new Error("Could not delete payment");
        }
    }
}

module.exports = new PaymentRepository();
