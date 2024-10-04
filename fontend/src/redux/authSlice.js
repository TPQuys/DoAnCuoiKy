import { createSlice } from "@reduxjs/toolkit";

// Lấy dữ liệu người dùng từ sessionStorage nếu có
const storedUser = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;

const authSlice = createSlice({
    name: "auth",
    initialState: {
        login: {
            currentUser: storedUser, // Khôi phục thông tin từ sessionStorage
            isFetching: false,
            error: false,
        },
        register: {
            isFetching: false,
            error: false,
            success: false,
        },
    },
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
            // Lưu thông tin người dùng vào sessionStorage
            sessionStorage.setItem('user', JSON.stringify(action.payload));
        },
        loginFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        registerStart: (state) => {
            state.register.isFetching = true;
        },
        registerSuccess: (state) => {
            state.register.isFetching = false;
            state.register.success = true;
            state.register.error = false;
        },
        registerFailed: (state) => {
            state.register.isFetching = false;
            state.register.error = true;
            state.register.success = false;
        },
        logOutStart: (state) => {
            state.login.isFetching = true;
        },
        logOutSuccess: (state) => {
            state.login.isFetching = false;
            state.login.currentUser = null;
            state.login.error = false;
            // Xóa thông tin người dùng khỏi sessionStorage
            sessionStorage.removeItem('user');
        },
        logOutFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
    },
});

export const {
    loginStart,
    loginFailed,
    loginSuccess,
    registerStart,
    registerFailed,
    registerSuccess,
    logOutStart,
    logOutFailed,
    logOutSuccess,
} = authSlice.actions;

export default authSlice.reducer;
