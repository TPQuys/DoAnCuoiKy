import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "users",
    initialState: {
        users: [],
        isFetching: false,
        error: false,
    },
    reducers: {
        getUsersStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        getUsersSuccess: (state, action) => {
            state.isFetching = false;
            state.users = action.payload;
        },
        getUsersFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },
    },
});

export const { getUsersStart, getUsersSuccess, getUsersFailed } = userSlice.actions;
export default userSlice.reducer;
