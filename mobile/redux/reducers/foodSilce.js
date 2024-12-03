import { createSlice } from "@reduxjs/toolkit";

const foodSlice = createSlice({
    name: "foods",
    initialState: {
        foods: [], // Danh sách các món ăn
        isFetching: false,
        error: false,
    },
    reducers: {
        getFoodsStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        getFoodsSuccess: (state, action) => {
            state.isFetching = false;
            state.foods = action.payload; // Gán danh sách các món ăn
        },
        getFoodsFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        addFoodStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        addFoodSuccess: (state, action) => {
            state.isFetching = false;
            state.foods.push(action.payload); // Thêm món ăn mới vào danh sách
        },
        addFoodFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        updateFoodStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        updateFoodSuccess: (state, action) => {
            state.isFetching = false;
            const index = state.foods.findIndex(food => food.FoodID === action.payload.FoodID);
            if (index !== -1) {
                state.foods[index] = action.payload; // Cập nhật món ăn
            }
        },
        updateFoodFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        deleteFoodStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        deleteFoodSuccess: (state, action) => {
            state.isFetching = false;
            state.foods = state.foods.filter(food => food.FoodID !== action.payload); // Xóa món ăn
        },
        deleteFoodFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },
    },
});

// Export actions
export const { 
    getFoodsStart, getFoodsSuccess, getFoodsFailed, 
    addFoodStart, addFoodSuccess, addFoodFailed,
    updateFoodStart, updateFoodSuccess, updateFoodFailed,
    deleteFoodStart, deleteFoodSuccess, deleteFoodFailed 
} = foodSlice.actions;

// Export reducer
export default foodSlice.reducer;
