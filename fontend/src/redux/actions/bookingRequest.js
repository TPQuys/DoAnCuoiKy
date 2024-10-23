import axios from "axios";
import {
    addBookingStart, addBookingSuccess, addBookingFailed,
    updateBookingStart, updateBookingSuccess, updateBookingFailed,
    deleteBookingStart, deleteBookingSuccess, deleteBookingFailed
} from "../reducers/bookingSlice";
import { toast } from "react-toastify";
import { createAxios } from '../../createInstance'; // Import hàm createAxios

// Hàm thêm booking
export const addBooking = async (dispatch, bookingData) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    dispatch(addBookingStart());
    let axiosJWT = createAxios(user, dispatch, addBookingSuccess);
    try {
        // const res = await axiosJWT.post("/v1/booking", bookingData);
        const res = await axios.post("/v1/booking", bookingData);
        
        dispatch(addBookingSuccess(res.data));
        toast.success("Thêm booking thành công!");
        return res.data
    } catch (error) {
        console.error("Thêm booking thất bại:", error);
        toast.error("Không thể thêm booking!");
        dispatch(addBookingFailed());
    }
};

// Hàm cập nhật booking
export const updateBooking = async (dispatch, bookingId, bookingData) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    dispatch(updateBookingStart());
    let axiosJWT = createAxios(user, dispatch, updateBookingSuccess);
    try {
        const res = await axiosJWT.put(`/v1/booking/${bookingId}`, bookingData);
        dispatch(updateBookingSuccess(res.data));
        toast.success("Cập nhật booking thành công!");
    } catch (error) {
        console.error("Cập nhật booking thất bại:", error);
        toast.error("Không thể cập nhật booking!");
        dispatch(updateBookingFailed());
    }
};

// Hàm xóa booking
export const deleteBooking = async (dispatch, bookingId) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    dispatch(deleteBookingStart());
    let axiosJWT = createAxios(user, dispatch, deleteBookingSuccess);
    try {
        await axiosJWT.delete(`/v1/booking/${bookingId}`);
        dispatch(deleteBookingSuccess(bookingId));
        toast.success("Xóa booking thành công!");
    } catch (error) {
        console.error("Xóa booking thất bại:", error);
        toast.error("Không thể xóa booking!");
        dispatch(deleteBookingFailed());
    }
};
