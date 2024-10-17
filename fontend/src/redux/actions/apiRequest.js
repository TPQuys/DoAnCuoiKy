import axios from "axios";
import { loginFailed, loginStart, loginSuccess, logOutFailed, logOutStart, logOutSuccess, registerFailed, registerStart, registerSuccess } from "../reducers/authSlice";
import { toast } from 'react-toastify';

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("/v1/auth/login", user);
        dispatch(loginSuccess(res.data));
        toast.success("Đăng nhập thành công!"); // Thông báo thành công

        sessionStorage.setItem('user', JSON.stringify(res.data));

        navigate("/");
    } catch (error) {
        console.error("Login failed:", error.response.data);
        toast.error(error.response.data);
        dispatch(loginFailed());
    }
};


export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        await axios.post("/v1/auth/register", user);
        dispatch(registerSuccess());
        toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác thực."); // Thông báo thành công
        navigate("/login");
    } catch (error) {
        console.error("Register failed:", error);
        toast.error("Đăng ký thất bại!"); // Thông báo lỗi
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
        toast.success("Đăng xuất thành công!"); 

        sessionStorage.removeItem('user');

        navigate("/login");
    } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Đăng xuất thất bại!"); 
        dispatch(logOutFailed());
    }
};