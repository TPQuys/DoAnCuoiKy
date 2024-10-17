// import axios from "axios";
import { getUsersStart, getUsersSuccess, getUsersFailed } from "../reducers/userSlice";
import { toast } from "react-toastify";

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
        const res = await axiosJWT.get("/v1/user", {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getUsersSuccess(res.data)); 
        console.log(res.data)
        toast.success("Lấy danh sách người dùng thành công!");
    } catch (error) {
        console.error("Get users failed:", error);
        toast.error("Không thể lấy danh sách người dùng!");
        dispatch(getUsersFailed()); 
    }
};
