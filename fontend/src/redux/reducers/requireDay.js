import { createSlice } from "@reduxjs/toolkit";

const requireDaySlice = createSlice({
    name: "requireDay",
    initialState: {
        numberDay: null, // Lưu giá trị ngày yêu cầu
        isFetching: false,
        error: false,
    },
    reducers: {
        // Hàm bắt đầu lấy dữ liệu
        getRequireDayStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        // Hàm thành công khi lấy dữ liệu
        getRequireDaySuccess: (state, action) => {
            state.isFetching = false;
            state.numberDay = action.payload; // Cập nhật số ngày yêu cầu
        },
        // Hàm thất bại khi lấy dữ liệu
        getRequireDayFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },

        // Hàm bắt đầu cập nhật dữ liệu
        updateRequireDayStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        // Hàm thành công khi cập nhật dữ liệu
        updateRequireDaySuccess: (state, action) => {
            state.isFetching = false;
            state.numberDay = action.payload;
        },
        // Hàm thất bại khi cập nhật dữ liệu
        updateRequireDayFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },
    },
});

export const { 
    getRequireDayStart, 
    getRequireDaySuccess, 
    getRequireDayFailed, 
    updateRequireDayStart, 
    updateRequireDaySuccess, 
    updateRequireDayFailed 
} = requireDaySlice.actions;

export default requireDaySlice.reducer;
