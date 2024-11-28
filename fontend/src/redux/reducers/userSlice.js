import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "users",
    initialState: {
        users: [],
        isFetching: false,
        error: null, // Thay đổi error thành null để có thể lưu trữ thông tin lỗi
    },
    reducers: {
        getUsersStart: (state) => {
            state.isFetching = true;
            state.error = null; // Reset lỗi khi bắt đầu lấy dữ liệu
        },
        getUsersSuccess: (state, action) => {
            state.isFetching = false;
            state.users = action.payload;
        },
        getUsersFailed: (state, action) => {
            state.isFetching = false;
            state.error = action.payload; // Lưu trữ thông tin lỗi
        },
        createUserStart: (state) => {
            state.isCreating = true;
            state.error = null;
        },
        createUserSuccess: (state, action) => {
            state.isCreating = false;
            state.users.push(action.payload); // Thêm người dùng mới vào danh sách
        },
        createUserFailed: (state, action) => {
            state.isCreating = false;
            state.error = action.payload; // Lưu trữ thông tin lỗi
        },
        updateUserStart: (state) => {
            state.isUpdating = true;
            state.error = null;
        },
        updateUserSuccess: (state, action) => {
            state.isUpdating = false;
            state.users = action.payload;
            sessionStorage.setItem("user",JSON.stringify(action.payload))
        },
        updateUserFailed: (state, action) => {
            state.isUpdating = false;
            state.error = action.payload; // Lưu trữ thông tin lỗi
        },
        deleteUserStart: (state) => {
            state.isDeleting = true;
            state.error = null;
        },
        deleteUserSuccess: (state, action) => {
            state.isDeleting = false;
            state.users = state.users.filter(user => user.id !== action.payload); // Xóa người dùng khỏi danh sách
        },
        deleteUserFailed: (state, action) => {
            state.isDeleting = false;
            state.error = action.payload; // Lưu trữ thông tin lỗi
        },
    },
});

export const {
    getUsersStart,
    getUsersSuccess,
    getUsersFailed,
    createUserStart,
    createUserSuccess,
    createUserFailed,
    updateUserStart,
    updateUserSuccess,
    updateUserFailed,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailed,
} = userSlice.actions;

export default userSlice.reducer;
