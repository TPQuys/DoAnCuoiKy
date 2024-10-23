import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import userReducer from "./reducers/userSlice"
import roomReducer from "./reducers/roomSlice"
import eventReducer from "./reducers/eventSlice"
import menuReducer from "./reducers/menuSlice"
import bookingReducer from "./reducers/bookingSlice"
import paymentReducer from "./reducers/paymentSlice"


export default configureStore({
    reducer:{
        auth: authReducer,
        users: userReducer,
        rooms: roomReducer,
        events: eventReducer,
        menus: menuReducer,
        booking: bookingReducer,
        payment: paymentReducer,
    },
});