import { createSlice } from "@reduxjs/toolkit";

const menuSlice = createSlice({
    name: "menus",
    initialState: {
        menus: [], // Danh sách menu
        isFetching: false,
        error: false,
    },
    reducers: {
        getMenusStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        getMenusSuccess: (state, action) => {
            state.isFetching = false;
            state.menus = action.payload; // Gán danh sách menu
        },
        getMenusFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        addMenuStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        addMenuSuccess: (state, action) => {
            state.isFetching = false;
            state.menus.push(action.payload); // Thêm menu mới vào danh sách
        },
        addMenuFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        updateMenuStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        updateMenuSuccess: (state, action) => {
            state.isFetching = false;
            const index = state.menus.findIndex(menu => menu.MenuID === action.payload.MenuID);
            if (index !== -1) {
                state.menus[index] = action.payload; // Cập nhật menu
            }
        },
        updateMenuFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        deleteMenuStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        deleteMenuSuccess: (state, action) => {
            state.isFetching = false;
            state.menus = state.menus.filter(menu => menu.MenuID !== action.payload); // Xóa menu
        },
        deleteMenuFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },
    },
});

// Export actions
export const { 
    getMenusStart, getMenusSuccess, getMenusFailed, 
    addMenuStart, addMenuSuccess, addMenuFailed,
    updateMenuStart, updateMenuSuccess, updateMenuFailed,
    deleteMenuStart, deleteMenuSuccess, deleteMenuFailed 
} = menuSlice.actions;

// Export reducer
export default menuSlice.reducer;
