import { getUsersStart, getUsersSuccess, getUsersFailed } from "../reducers/userSlice";
import { toast } from "react-toastify";
import { updateUserStart,updateUserSuccess,updateUserFailed } from "../reducers/userSlice";
import { createAxios } from "../../createInstance";
import axios from "axios";

export const getAllUsers = async (dispatch, axiosJWT) => {
    dispatch(getUsersStart());

    const storedUser = sessionStorage.getItem('user');
    const accessToken = storedUser ? JSON.parse(storedUser).accessToken : null;

    if (!accessToken) {
        toast.error("Token không tồn tại, vui lòng đăng nhập lại!");
        dispatch(getUsersFailed());
        return;
    }

    try {
        const res = await axiosJWT.get("/v1/user")
        dispatch(getUsersSuccess(res.data)); 
        toast.success("Lấy danh sách người dùng thành công!");
    } catch (error) {
        console.error("Get users failed:", error);
        toast.error("Không thể lấy danh sách người dùng!");
        dispatch(getUsersFailed()); 
    }
};

// Hàm thêm booking
export const updateUser = async (dispatch, userData) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    dispatch(updateUserStart);
    let axiosJWT = createAxios(user);
    try {
        const res = await axiosJWT.put(`/v1/user/${user.user.id}`, userData);
        const editedUser = {...user,user:res.data}
        dispatch(updateUserSuccess(editedUser))
        toast.success("Cập nhật thông tin người dùng thành công!");
        return editedUser
    } catch (error) {
        console.error("Update user failed:", error);
        toast.error("Cập nhật thất bại!");
        dispatch(updateUserFailed());
    }
};

// Hàm gửi email reset password
export const sendResetPassword = async (userData,setIsdisable) => {
    try {
        setIsdisable(true)
        await axios.post(`/v1/user/reset_password`, userData);
        toast.success("Đã gửi mail xác nhận đến gmail của bạn!");
    } catch (error) {
        setIsdisable(false)
        console.error("Failed:", error);
        toast.error("Gửi email thất bại!");
    }
};

// Hàm gửi update password
export const updatePassword = async (token,newPassword,navigate) => {
    try {
        await axios.put(`/v1/user/update_password`, {token,newPassword});
        toast.success("Cập nhật mật khẩu thành công!");
        navigate("/")
    } catch (error) {
        console.error("Update user failed:", error);
        toast.error("Cập nhật thất bại!");
    }
};

// Hàm tải ảnh
export const uploadAvatar = async (dispatch, file, user) => {
    const curentUser = JSON.parse(sessionStorage.getItem("user"));
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
        sessionStorage.setItem("user",JSON.stringify({...curentUser,user:newUser}))
        toast.success("Cập nhật ảnh đại diện thành công!"); // Thông báo thành công
        return newUser
    } catch (error) {
        console.error("Cập nhật ảnh đại diện thất bại:", error);
        toast.error("Cập nhật thất bại!"); // Thông báo thất bại
        dispatch(getUsersFailed()); 
    }
};