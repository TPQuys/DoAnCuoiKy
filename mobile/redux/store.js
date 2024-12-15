import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import userReducer from "./reducers/userSlice"
import roomReducer from "./reducers/roomSlice"
import foodReducer from "./reducers/foodSilce"
import drinkReducer from "./reducers/drinkSlice"
import eventReducer from "./reducers/eventSlice"
import menuReducer from "./reducers/menuSlice"
import bookingReducer from "./reducers/bookingSlice"
import paymentReducer from "./reducers/paymentSlice"
import decorePriceReducer from "./reducers/decorePriceSlice"
import requireDayReducer from "./reducers/requireDay"


export default configureStore({
    reducer: {
        auth: authReducer,
        users: userReducer,
        rooms: roomReducer,
        events: eventReducer,
        menus: menuReducer,
        bookings: bookingReducer,
        payment: paymentReducer,
        foods: foodReducer,
        drinks: drinkReducer,
        roomPrices: decorePriceReducer,
        requireDay: requireDayReducer
    },
});