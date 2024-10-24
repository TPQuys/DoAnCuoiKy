import axios from "axios";
import {
    addBookingStart, addBookingSuccess, addBookingFailed,
    updateBookingStart, updateBookingSuccess, updateBookingFailed,
    deleteBookingStart, deleteBookingSuccess, deleteBookingFailed,
    getBookingsSuccess,
    getBookingsStart,
    getBookingsFailed
} from "../reducers/bookingSlice";
import { toast } from "react-toastify";
import { createAxios } from '../../createInstance'; // Import hàm createAxios


// Hàm lấy booking theo id
export const getBookingById = async (dispatch, bookingId) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    dispatch(getBookingsStart());
    let axiosJWT = createAxios(user, dispatch, getBookingsSuccess);
    try {
        const res = await axios.get(`/v1/booking/${bookingId}`);
        // const res = await axiosJWT.get(`/v1/booking/${bookingId}`);
        if (res) {
            dispatch(getBookingsSuccess(bookingId));
            return res
        }
    } catch (error) {
        console.error("Xóa booking thất bại:", error);
        toast.error("Không thể xóa booking!");
        dispatch(getBookingsFailed());
    }
};


// Hàm thêm booking
export const addBooking = async (dispatch, bookingData) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    let axiosJWT = createAxios(user, dispatch, addBookingSuccess);
    try {
        const res = await axios.post("/v1/booking", bookingData);
        return res.data
    } catch (error) {
        console.error("Thêm booking thất bại:", error);
        toast.error("Không đặt phòng!");
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
