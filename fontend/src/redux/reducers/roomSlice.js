import { createSlice } from "@reduxjs/toolkit";

const roomSlice = createSlice({
    name: "rooms",
    initialState: {
        rooms: [],
        isFetching: false,
        error: false,
    },
    reducers: {
        getRoomsStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        getRoomsSuccess: (state, action) => {
            state.isFetching = false;
            state.rooms = action.payload;
        },
        getRoomsFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        addRoomStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        addRoomSuccess: (state, action) => {
            state.isFetching = false;
            state.rooms.push(action.payload); // Thêm phòng mới vào danh sách
        },
        addRoomFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        updateRoomStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        updateRoomSuccess: (state, action) => {
            state.isFetching = false;
            const index = state.rooms.findIndex(room => room.id === action.payload.id);
            if (index !== -1) {
                state.rooms[index] = action.payload; 
            }
        },
        updateRoomFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        deleteRoomStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        deleteRoomSuccess: (state, action) => {
            state.isFetching = false;
            state.rooms = state.rooms.filter(room => room.id !== action.payload); 
        },
        deleteRoomFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },
    },
});

export const { 
    getRoomsStart, getRoomsSuccess, getRoomsFailed, 
    addRoomStart, addRoomSuccess, addRoomFailed,
    updateRoomStart, updateRoomSuccess, updateRoomFailed,
    deleteRoomStart, deleteRoomSuccess, deleteRoomFailed 
} = roomSlice.actions;

export default roomSlice.reducer;
