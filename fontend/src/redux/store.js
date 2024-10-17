import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import userReducer from "./reducers/userSlice"
import roomReducer from "./reducers/roomSlice"

export default configureStore({
    reducer:{
        auth: authReducer,
        users: userReducer,
        rooms: roomReducer,
        
    },
});