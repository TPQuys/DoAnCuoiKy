import { getUsersStart, getUsersSuccess, getUsersFailed } from "../reducers/userSlice";
import { updateUserStart,updateUserSuccess,updateUserFailed } from "../reducers/userSlice";
import { createAxios } from '@/utils/createInstance';
import axios from "@/utils/axiosConfig";

export const getAllUsers = async (dispatch, axiosJWT,user) => {
    dispatch(getUsersStart());

    const accessToken = user ? JSON.parse(user).accessToken : null;

    if (!accessToken) {
        dispatch(getUsersFailed());
        return;
    }

    try {
        const res = await axiosJWT.get("/v1/user")
        dispatch(getUsersSuccess(res.data)); 
    } catch (error) {
        console.error("Get users failed:", error);
        dispatch(getUsersFailed()); 
    }
};

// Hàm thêm booking
export const updateUser = async (dispatch, userData,user,curentUser) => {
    dispatch(updateUserStart());
    let axiosJWT = createAxios(curentUser);
    try {
        const res = await axiosJWT.put(`/v1/user/${curentUser.user.id}`, userData);
        const editedUser = {...curentUser,user:res.data}
        dispatch(updateUserSuccess(editedUser))
        return editedUser
    } catch (error) {
        console.error("Update user failed:", error);
        dispatch(updateUserFailed());
    }
};

// Hàm gửi email reset password
export const sendResetPassword = async (userData,setIsdisable) => {
    try {
        setIsdisable(true)
        await axios.post(`/v1/user/reset_password`, userData);
    } catch (error) {
        setIsdisable(false)
        console.error("Failed:", error);
    }
};

// Hàm gửi update password
export const updatePassword = async (token,newPassword,navigate) => {
    try {
        await axios.put(`/v1/user/update_password`, {token,newPassword});
        navigate("/")
    } catch (error) {
        console.error("Update user failed:", error);
    }
};

// Hàm tải ảnh
export const uploadAvatar = async (dispatch, file, user) => {
    const curentUser = {...user}
    try {
        const formData = new FormData();
        formData.append('avatar', file); // Thêm file vào FormData
        dispatch(getUsersStart())
        // Gửi yêu cầu PUT với FormData
        const res = await axios.put(`/v1/user/${user.id}/avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Đảm bảo Content-Type được thiết lập đúng
            },
        });
        const avatarUrl = `${res.data.avatarUrl}?t=${new Date().getTime()}`;
        const newUser = {...user,avatar:avatarUrl}
        dispatch(getUsersSuccess(newUser))
        return newUser
    } catch (error) {
        console.error("Cập nhật ảnh đại diện thất bại:", error);
        dispatch(getUsersFailed()); 
    }
};