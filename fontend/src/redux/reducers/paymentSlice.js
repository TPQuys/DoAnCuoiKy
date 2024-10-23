import { createSlice } from "@reduxjs/toolkit";

const paymentSlice = createSlice({
    name: "payments",
    initialState: {
        payments: [],
        loading: false,
        error: false,
    },
    reducers: {
        getPaymentsStart: (state) => {
            state.loading = true;
            state.error = false;
        },
        getPaymentsSuccess: (state, action) => {
            state.loading = false;
            state.payments = action.payload;
        },
        getPaymentsFailed: (state) => {
            state.loading = false;
            state.error = true;
        },
        addPaymentStart: (state) => {
            state.loading = true;
            state.error = false;
        },
        addPaymentSuccess: (state, action) => {
            state.loading = false;
            state.payments.push(action.payload);
        },
        addPaymentFailed: (state) => {
            state.loading = false;
            state.error = true;
        },
        updatePaymentStart: (state) => {
            state.loading = true;
            state.error = false;
        },
        updatePaymentSuccess: (state, action) => {
            state.loading = false;
            const index = state.payments.findIndex(payment => payment.PaymentID === action.payload.PaymentID);
            if (index !== -1) {
                state.payments[index] = action.payload;
            }
        },
        updatePaymentFailed: (state) => {
            state.loading = false;
            state.error = true;
        },
        deletePaymentStart: (state) => {
            state.loading = true;
            state.error = false;
        },
        deletePaymentSuccess: (state, action) => {
            state.loading = false;
            state.payments = state.payments.filter(payment => payment.PaymentID !== action.payload);
        },
        deletePaymentFailed: (state) => {
            state.loading = false;
            state.error = true;
        },
    },
});

export const {
    getPaymentsStart, getPaymentsSuccess, getPaymentsFailed,
    addPaymentStart, addPaymentSuccess, addPaymentFailed,
    updatePaymentStart, updatePaymentSuccess, updatePaymentFailed,
    deletePaymentStart, deletePaymentSuccess, deletePaymentFailed
} = paymentSlice.actions;

export default paymentSlice.reducer;
