const PaymentRepository = require('../repositories/paymentRepository'); // Import PaymentRepository

class PaymentService {
    async createPayment(event) {
        const roomPrice = event.room.price
        const menuPrice =  event.menu.price
        // const decoreLobbyPrice = event.decore
         
        return await PaymentRepository.createPayment(paymentData);
    }

    async getAllPayments() {
        return await PaymentRepository.getAllPayments();
    }

    async getPaymentById(paymentId) {
        return await PaymentRepository.getPaymentById(paymentId);
    }

    async updatePayment(paymentId, updatedData) {
        return await PaymentRepository.updatePayment(paymentId, updatedData);
    }

    async deletePayment(paymentId) {
        return await PaymentRepository.deletePayment(paymentId);
    }
}

module.exports = new PaymentService();
