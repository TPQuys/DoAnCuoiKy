import { createSlice } from "@reduxjs/toolkit";

const eventSlice = createSlice({
    name: "events",
    initialState: {
        events: [],
        loading: false,
        error: false,
    },
    reducers: {
        getEventsStart: (state) => {
            state.loading = true;
            state.error = false;
        },
        getEventsSuccess: (state, action) => {
            state.loading = false;
            state.events = action.payload;
        },
        getEventsFailed: (state) => {
            state.loading = false;
            state.error = true;
        },
        addEventStart: (state) => {
            state.loading = true;
            state.error = false;
        },
        addEventSuccess: (state, action) => {
            state.loading = false;
            state.events.push(action.payload); 
        },
        addEventFailed: (state) => {
            state.loading = false;
            state.error = true;
        },
        updateEventStart: (state) => {
            state.loading = true;
            state.error = false;
        },
        updateEventSuccess: (state, action) => {
            state.loading = false;
            const index = state.events.findIndex(event => event.EventID === action.payload.EventID);
            if (index !== -1) {
                state.events[index] = action.payload; 
            }
        },
        updateEventFailed: (state) => {
            state.loading = false;
            state.error = true;
        },
        deleteEventStart: (state) => {
            state.loading = true;
            state.error = false;
        },
        deleteEventSuccess: (state, action) => {
            state.loading = false;
            state.events = state.events.filter(event => event.EventID !== action.payload); // Xóa sự kiện khỏi danh sách
        },
        deleteEventFailed: (state) => {
            state.loading = false;
            state.error = true;
        },
    },
});

export const { 
    getEventsStart, getEventsSuccess, getEventsFailed, 
    addEventStart, addEventSuccess, addEventFailed, 
    updateEventStart, updateEventSuccess, updateEventFailed, 
    deleteEventStart, deleteEventSuccess, deleteEventFailed 
} = eventSlice.actions;

export default eventSlice.reducer;
