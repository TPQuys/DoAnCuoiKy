import axios from "axios";
import {
    addEventStart, addEventSuccess, addEventFailed,
    deleteEventSuccess, updateEventSuccess,
    updateEventStart, deleteEventStart,
    updateEventFailed, deleteEventFailed
} from "../reducers/eventSlice";
import { toast } from "react-toastify";
import { createAxios } from '../../createInstance'; // Import hàm createAxios


export const addEvent = async (dispatch, eventData) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    console.log(user)
    dispatch(addEventStart());
    let axiosJWT = createAxios(user, dispatch, addEventSuccess);
    try {
        const res = await axios.post("/v1/event", eventData);
        dispatch(addEventSuccess(res.data));
        console.log("Thêm sự kiện thành công" + JSON.stringify(res.data))
        toast.success("Thêm sự kiện thành công!");
        return res.data
    } catch (error) {
        console.error("Thêm sự kiện thất bại:", error);
        toast.error("Không thể thêm sự kiện!");
        dispatch(addEventFailed());
    }
};

// Hàm updateEvent
export const updateEvent = async (dispatch, eventId, eventData) => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    dispatch(updateEventStart());
    let axiosJWT = createAxios(user, dispatch, updateEventSuccess);
    try {
        const res = await axiosJWT.put(`/v1/event/${eventId}`, eventData);
        dispatch(updateEventSuccess(res.data));
        toast.success("Cập nhật sự kiện thành công!");
    } catch (error) {
        console.error("Cập nhật sự kiện thất bại:", error);
        toast.error("Không thể cập nhật sự kiện!");
        dispatch(updateEventFailed());
    }
};

// Hàm deleteEvent
export const deleteEvent = async (dispatch, eventId) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    dispatch(deleteEventStart());
    let axiosJWT = createAxios(user, dispatch, deleteEventSuccess);

    try {
        await axiosJWT.delete(`/v1/event/${eventId}`);
        dispatch(deleteEventSuccess(eventId));
        toast.success("Xóa sự kiện thành công!");
    } catch (error) {
        console.error("Xóa sự kiện thất bại:", error);
        toast.error("Không thể xóa sự kiện!");
        dispatch(deleteEventFailed());
    }
};
