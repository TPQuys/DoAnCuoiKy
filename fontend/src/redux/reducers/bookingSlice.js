import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
    name: "bookings",
    initialState: {
        bookings: [],
        loading: false,
        error: false,
    },
    reducers: {
        getBookingsStart: (state) => {
            state.loading = true;
            state.error = false;
        },
        getBookingsSuccess: (state, action) => {
            state.loading = false;
            state.bookings = action.payload;
        },
        getBookingsFailed: (state) => {
            state.loading = false;
            state.error = true;
        },
        addBookingStart: (state) => {
            state.loading = true;
            state.error = false;
        },
        addBookingSuccess: (state, action) => {
            state.loading = false;
            state.bookings.push(action.payload);
        },
        addBookingFailed: (state) => {
            state.loading = false;
            state.error = true;
        },
        updateBookingStart: (state) => {
            state.loading = true;
            state.error = false;
        },
        updateBookingSuccess: (state, action) => {
            state.loading = false;
            const index = state.bookings.findIndex(booking => booking.BookingID === action.payload.BookingID);
            if (index !== -1) {
                state.bookings[index] = action.payload;
            }
        },
        updateBookingFailed: (state) => {
            state.loading = false;
            state.error = true;
        },
        deleteBookingStart: (state) => {
            state.loading = true;
            state.error = false;
        },
        deleteBookingSuccess: (state, action) => {
            state.loading = false;
            state.bookings = state.bookings.filter(booking => booking.BookingID !== action.payload);
        },
        deleteBookingFailed: (state) => {
            state.loading = false;
            state.error = true;
        },
    },
});

export const {
    getBookingsStart, getBookingsSuccess, getBookingsFailed,
    addBookingStart, addBookingSuccess, addBookingFailed,
    updateBookingStart, updateBookingSuccess, updateBookingFailed,
    deleteBookingStart, deleteBookingSuccess, deleteBookingFailed
} = bookingSlice.actions;

export default bookingSlice.reducer;
