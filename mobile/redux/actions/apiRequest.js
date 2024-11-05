import axios from "@/utils/axiosConfig";
import { loginFailed, loginStart, loginSuccess, logOutStart, logOutSuccess, registerFailed, registerStart, registerSuccess } from "../reducers/authSlice";
// import { getAllBooking, getBookingByUser } from "./bookingRequest";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginUser = async (user, dispatch, router) => {
    dispatch(loginStart());
    const from = sessionStorage.getItem("previousPath") || "/";
    try {
        const res = await axios.post("/v1/auth/login", user);
        await AsyncStorage.setItem('user', JSON.stringify(res.data));
        // if(res.data.user.admin){
        //     getAllBooking(dispatch)
        // }
        // else{
        //     getBookingByUser(dispatch)
        // }
        // navigate(from);
        dispatch(loginSuccess(res.data));
        router.push("/room")
        console.log(res.data)
        return true
    } catch (error) {
        console.error("Login failed:", error.response.data);
        dispatch(loginFailed());
    }
};


export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        await axios.post("/v1/auth/register", user);
        dispatch(registerSuccess());
        navigate("/login");
    } catch (error) {
        console.error("Register failed:", error);
        dispatch(registerFailed());
    }
};

export const logOut = async (dispatch, id, navigate, accessToken, axiosJWT) => {
    dispatch(logOutStart());
    try {
        await axiosJWT.post("/v1/auth/logout", id, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(logOutSuccess());
        navigate("/login");
    } catch (error) {
        console.error("Logout failed:", error);
        dispatch(logOutSuccess());

    }
};