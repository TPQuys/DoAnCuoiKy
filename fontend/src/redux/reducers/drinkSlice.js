import { createSlice } from "@reduxjs/toolkit";

const drinkSlice = createSlice({
    name: "drinks",
    initialState: {
        drinks: [], // Danh sách đồ uống
        isFetching: false,
        error: false,
    },
    reducers: {
        getDrinksStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        getDrinksSuccess: (state, action) => {
            state.isFetching = false;
            state.drinks = action.payload; // Gán danh sách đồ uống
        },
        getDrinksFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        addDrinkStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        addDrinkSuccess: (state, action) => {
            state.isFetching = false;
            state.drinks.push(action.payload); // Thêm đồ uống mới vào danh sách
        },
        addDrinkFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        updateDrinkStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        updateDrinkSuccess: (state, action) => {
            state.isFetching = false;
            const index = state.drinks.findIndex(drink => drink.DrinkID === action.payload.DrinkID);
            if (index !== -1) {
                state.drinks[index] = action.payload; // Cập nhật đồ uống
            }
        },
        updateDrinkFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        deleteDrinkStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        deleteDrinkSuccess: (state, action) => {
            state.isFetching = false;
            state.drinks = state.drinks.filter(drink => drink.DrinkID !== action.payload); // Xóa đồ uống
        },
        deleteDrinkFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },
    },
});

// Export actions
export const { 
    getDrinksStart, getDrinksSuccess, getDrinksFailed, 
    addDrinkStart, addDrinkSuccess, addDrinkFailed,
    updateDrinkStart, updateDrinkSuccess, updateDrinkFailed,
    deleteDrinkStart, deleteDrinkSuccess, deleteDrinkFailed 
} = drinkSlice.actions;

// Export reducer
export default drinkSlice.reducer;
