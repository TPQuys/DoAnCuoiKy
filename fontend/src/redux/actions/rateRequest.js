import { toast } from "react-toastify";
import { createAxios } from '../../utils/createInstance'; // Import hàm createAxios


export const addRate = async (dispatch, RateData) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    let axiosJWT = createAxios(user);
    try {
        const res = await axiosJWT.post("/v1/rate", RateData);
        toast.success("Thêm đánh giá thành công.");
        return res.data
    } catch (error) {
        console.error("Thêm đánh giá thất bại:", error.response.data.message);
        toast.error(error.response.data.message);
    }
};


export const getRate = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    let axiosJWT = createAxios(user);
    try {
        const res = await axiosJWT.get("/v1/rate/all");
        return res?.data
    } catch (error) {
        console.error("Lấy đánh giá thất bại:", error.response?.data?.message);
        toast.error(error.response?.data?.message);
    }
};

// Hàm updateRate
export const updateRate = async ( RateId, RateData) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    let axiosJWT = createAxios(user);
    try {
        const res = await axiosJWT.put(`/v1/rate/${RateId}`, RateData);
        toast.success("Cập nhật đánh giá thành công!");
    } catch (error) {
        console.error("Cập nhật đánh giá thất bại:", error);
        toast.error("Không thể cập nhật đánh giá!");
    }
};

// Hàm deleteRate
export const deleteRate = async ( RateId) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    let axiosJWT = createAxios(user);
    try {
        await axiosJWT.delete(`/v1/rate/${RateId}`);
        toast.success("Xóa đánh giá thành công!");
    } catch (error) {
        console.error("Xóa đánh giá thất bại:", error);
        toast.error("Không thể xóa đánh giá!");
    }
};
