import axios from "axios";
import {
    addPaymentStart, addPaymentSuccess, addPaymentFailed,
    updatePaymentStart, updatePaymentSuccess, updatePaymentFailed,
    deletePaymentStart, deletePaymentSuccess, deletePaymentFailed,
    getPaymentsStart,
    getPaymentsSuccess,
    getPaymentsFailed
} from "../reducers/paymentSlice";
import { toast } from "react-toastify";
import { createAxios } from '../../createInstance'; // Import hàm createAxios

// Hàm thêm payment
export const addPayment = async (dispatch, paymentData) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    dispatch(addPaymentStart());
    let axiosJWT = createAxios(user, dispatch, addPaymentSuccess);
    try {
        // const res = await axiosJWT.post("/v1/payment", paymentData);
        const res = await axios.post("/v1/payment", paymentData);
        console.log(res.data)
        dispatch(addPaymentSuccess(res.data));
        return res.data
    } catch (error) {
        console.error("Thêm thanh toán thất bại:", error);
        toast.error("Không thể đặt phòng!");
        dispatch(addPaymentFailed());
    }
};

// Hàm cập nhật payment
export const updatePayment = async (dispatch, paymentId, paymentData) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    dispatch(updatePaymentStart());
    let axiosJWT = createAxios(user, dispatch, updatePaymentSuccess);
    try {
        const res = await axiosJWT.put(`/v1/payment/${paymentId}`, paymentData);
        dispatch(updatePaymentSuccess(res.data));
        toast.success("Cập nhật thanh toán thành công!");
    } catch (error) {
        console.error("Cập nhật thanh toán thất bại:", error);
        toast.error("Không thể cập nhật thanh toán!");
        dispatch(updatePaymentFailed());
    }
};

// Hàm xóa payment
export const deletePayment = async (dispatch, paymentId) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    dispatch(deletePaymentStart());
    let axiosJWT = createAxios(user, dispatch, deletePaymentSuccess);
    try {
        await axiosJWT.delete(`/v1/payment/${paymentId}`);
        dispatch(deletePaymentSuccess(paymentId));
        toast.success("Xóa thanh toán thành công!");
    } catch (error) {
        console.error("Xóa thanh toán thất bại:", error);
        toast.error("Không thể xóa thanh toán!");
        dispatch(deletePaymentFailed());
    }
};

// Hàm xóa payment
export const PostZaloApi = async (dispatch, booking) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    dispatch(addPaymentStart());
    let axiosJWT = createAxios(user, dispatch, addPaymentSuccess);
    try {
        // await axiosJWT.delete(`/v1/payment/${paymentId}`);
        const res = await axios.post("/v1/payment/zalopay",booking)
        dispatch(addPaymentSuccess());
        return res;
    } catch (error) {
        console.error("Xóa thanh toán thất bại:", error);
        toast.error("Không thể xóa thanh toán!");
        dispatch(addPaymentFailed());
    }
};
