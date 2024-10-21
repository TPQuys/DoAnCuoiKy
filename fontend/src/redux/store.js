import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import userReducer from "./reducers/userSlice"
import roomReducer from "./reducers/roomSlice"
import eventReducer from "./reducers/eventSlice"
export default configureStore({
    reducer:{
        auth: authReducer,
        users: userReducer,
        rooms: roomReducer,
        events: eventReducer,
    },
});