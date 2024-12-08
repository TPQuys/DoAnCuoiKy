import axios from "@/utils/axiosConfig";
import { loginFailed, loginStart, loginSuccess, logOutStart, logOutSuccess, registerFailed, registerStart, registerSuccess } from "../reducers/authSlice";
import { createAxios } from "@/utils/createInstance";

import { ToastAndroid } from 'react-native';
export const loginUser = async (user, dispatch, router) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("/v1/auth/login", user);
        console.log(res)
        const avatarUrl = `${res.data.user.avatar}?t=${new Date().getTime()}`;
        const newUser = { ...res.data.user, avatar: avatarUrl }
        dispatch(loginSuccess({ ...res.data, user: newUser }));
        ToastAndroid.show("Đăng nhập thành công", ToastAndroid.SHORT)
        router.push("/(tabs)/home")
        return true
    } catch (error) {
        console.log(error.response.data?.message)
        
        if (error.response.data?.message === "Email not confirmed") {
            ToastAndroid.show("Email chưa được xác thực", ToastAndroid.SHORT)
        }
        else if (error.response.data?.message === "Wrong username") {
            ToastAndroid.show("Tài khoản không tồn tại", ToastAndroid.SHORT)
        }
        else if (error.response.data?.message === "Wrong password") {
            ToastAndroid.show("Mật khẩu không chính xác", ToastAndroid.SHORT)
        }
        else{
            ToastAndroid.show("Email chưa được xác thực", ToastAndroid.SHORT)
        }
        dispatch(loginFailed());
        throw new Error(error.response.data?.message)
    }
};


export const registerUser = async (user, dispatch, router) => {
    dispatch(registerStart());
    try {
        await axios.post("/v1/auth/register", user);
        dispatch(registerSuccess());
        ToastAndroid.show("Đăng kí thành công, vui lòng kiểm tra email để xác thực.", ToastAndroid.SHORT)
        router.push("/")
        return true

    } catch (error) {
        ToastAndroid.show("Đăng kí thất bại, email đã được sử dụng trước", ToastAndroid.SHORT)
        // console.error("Register failed:", );
        dispatch(registerFailed());
    }
};

export const logOut = async (dispatch, user,router) => {
    dispatch(logOutStart());
    const axiosJWT = createAxios(user)
    try {
        await axiosJWT.post("/v1/auth/logout", { id: user?.user?.id }, {
            headers: { token: `Bearer ${user?.accessToken}` },
        });
        dispatch(logOutSuccess());
        ToastAndroid.show("Đăng xuất thành công", ToastAndroid.SHORT)
        router.push("/")
    } catch (error) {
        console.error("Logout failed:", error);
        dispatch(logOutSuccess());

    }
};