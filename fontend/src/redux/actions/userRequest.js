// import axios from "axios";
import { getUsersStart, getUsersSuccess, getUsersFailed } from "../reducers/userSlice";
import { toast } from "react-toastify";
import { updateUserStart,updateUserSuccess,updateUserFailed } from "../reducers/userSlice";
import { createAxios } from "../../createInstance";

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
        console.log(res.data)
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
        console.log(res.data)
        const editedUser = {...user,user:res.data}
        dispatch(updateUserSuccess(editedUser))
        
        return res.data
    } catch (error) {
        console.error("Thêm booking thất bại:", error);
        toast.error("Không đặt phòng!");
        dispatch(updateUserFailed());
    }
};
