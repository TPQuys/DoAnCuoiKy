const PaymentRepository = require('../repositories/paymentRepository');
const bookingRepository = require('../repositories/bookingRepository');

class PaymentService {
    // Hàm để tính tổng giá dựa trên dữ liệu và liên kết (foods hoặc drinks)
    calculateTotal(items, throughField) {
        return items.reduce((total, item) => {
            const unitPrice = item?.dataValues?.UnitPrice || 0; // Giá của từng món
            const quantity = item?.[throughField]?.dataValues?.Quantity || 0; // Số lượng từ bảng through
            return total + (unitPrice * quantity);
        }, 0); // Bắt đầu từ 0
    }

    async createPayment(paymentData) {
        const booking = await bookingRepository.getBookingById(paymentData.BookingID);

        const eventData = booking?.Event || {};
        const roomEventData = eventData?.RoomEvent || {};
        const menuData = eventData?.Menu || {};
        const foodData = menuData?.Food || [];
        const drinkData = menuData?.Drinks || [];
        
        // Tính tổng giá của thức ăn và đồ uống
        const totalPriceFoods = this.calculateTotal(foodData, 'MenuFoods');
        const totalPriceDrinks = this.calculateTotal(drinkData, 'MenuDrinks');
        
        const totalTable = eventData?.TotalTable || 1; // Tổng số bàn, mặc định là 1 nếu không có
        const roomPrice = roomEventData?.Price || 0; // Giá phòng

        // Tính tổng tiền thanh toán
        paymentData.Amount = (totalPriceFoods + totalPriceDrinks) * totalTable + roomPrice;
        
        console.log("Total Payment Amount:", paymentData.Amount);
        
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
