import {
    addBookingStart, addBookingFailed,
    updateBookingStart, updateBookingSuccess, updateBookingFailed,
    deleteBookingStart, deleteBookingSuccess, deleteBookingFailed,
    getBookingsSuccess,
    getBookingsStart,
    getBookingsFailed
} from "../reducers/bookingSlice";
import { ToastAndroid } from 'react-native';
import { createAxios } from "../../utils/createInstance";


// Hàm lấy booking theo id
export const getBookingById = async (dispatch, bookingId,user) => {
    let axiosJWT = createAxios(user);
    try {
        const res = await axiosJWT.get(`/v1/booking/${bookingId}`);
        if (res) {
            return res
        }
    } catch (error) {
        console.log("lấy booking thất bại:", error);
    }
};

// Hàm lấy booking theo user
export const getBookingByUser = async (dispatch,user) => {
    dispatch(getBookingsStart());
    if (user) {
        let axiosJWT = createAxios(user);
        try {
            const res = await axiosJWT.get(`/v1/booking/user/${user.user.id}`);
            dispatch(getBookingsSuccess(res.data));
            return res.data
        } catch (error) {
            console.log("lấy booking thất bại:", error);
            dispatch(getBookingsFailed());
        }
    }
};

// Hàm lấy booking theo user
export const getAllBooking = async (dispatch,user) => {
    dispatch(getBookingsStart(user));
    if (user) {
        let axiosJWT = createAxios();
        try {
            const res = await axiosJWT.get(`/v1/booking`);
            console.log(res.data);
            dispatch(getBookingsSuccess(res.data));
        } catch (error) {
            console.error("lấy booking thất bại:", error);
            dispatch(getBookingsFailed());
        }
    }
};


// Hàm thêm booking
export const addBooking = async (dispatch, bookingData,user) => {
    dispatch(addBookingStart());
    let axiosJWT = createAxios(user);
    try {
        const res = await axiosJWT.post("/v1/booking", bookingData);
        getBookingByUser(dispatch)
        ToastAndroid.show("Đặt sự kiện thành công", ToastAndroid.SHORT)
        return res.data
    } catch (error) {
        console.error("Thêm booking thất bại:", error);
        dispatch(addBookingFailed());
    }
};

// Hàm cập nhật booking
export const updateBooking = async (dispatch, bookingId, bookingData) => {
    dispatch(updateBookingStart());
    let axiosJWT = createAxios();
    try {
        const res = await axiosJWT.put(`/v1/booking/${bookingId}`, bookingData);
        dispatch(updateBookingSuccess(res.data));
    } catch (error) {
        console.error("Cập nhật booking thất bại:", error);
        dispatch(updateBookingFailed());
    }
};

// Hàm xóa booking
export const deleteBooking = async (dispatch, bookingId) => {
    dispatch(deleteBookingStart());
    let axiosJWT = createAxios();
    try {
        await axiosJWT.delete(`/v1/booking/${bookingId}`);
        dispatch(deleteBookingSuccess(bookingId));
    } catch (error) {
        console.error("Xóa booking thất bại:", error);
        dispatch(deleteBookingFailed());
    }
};

// Hàm xóa booking
export const deleteBookingUser = async (dispatch, bookingId, user) => {
    dispatch(deleteBookingStart());
    let axiosJWT = createAxios(user);
    try {
        await axiosJWT.delete(`/v1/booking/${bookingId}/user`);
        dispatch(deleteBookingSuccess(bookingId));
        ToastAndroid.show("Xoá thành công", ToastAndroid.SHORT)
    } catch (error) {
        // console.error("Xóa booking thất bại:", JSON.stringify(error));
        dispatch(deleteBookingFailed());
    }
};
