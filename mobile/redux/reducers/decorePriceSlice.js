import { createSlice } from "@reduxjs/toolkit";

const roomPriceSlice = createSlice({
    name: "roomPrices",
    initialState: {
        roomPrices: [],
        loading: false,
        error: false,
    },
    reducers: {
        getRoomPricesStart: (state) => {
            state.loading = true;
            state.error = false;
        },
        getRoomPricesSuccess: (state, action) => {
            state.loading = false;
            state.roomPrices = action.payload;
        },
        getRoomPricesFailed: (state) => {
            state.loading = false;
            state.error = true;
            state.roomPrices = [];
        },
        updateRoomPriceStart: (state) => {
            state.loading = true;
            state.error = false;
        },
        updateRoomPriceSuccess: (state, action) => {
            state.loading = false;
            const index = state.roomPrices.findIndex(room => room.RoomID === action.payload.RoomID);
            if (index !== -1) {
                state.roomPrices[index] = action.payload;
            }
        },
        updateRoomPriceFailed: (state) => {
            state.loading = false;
            state.error = true;
        },
    },
});

export const {
    getRoomPricesStart, getRoomPricesSuccess, getRoomPricesFailed,
    updateRoomPriceStart, updateRoomPriceSuccess, updateRoomPriceFailed
} = roomPriceSlice.actions;

export default roomPriceSlice.reducer;
