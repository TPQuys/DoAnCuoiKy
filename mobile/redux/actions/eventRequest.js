import {
    addEventStart, addEventSuccess, addEventFailed,
    deleteEventSuccess, updateEventSuccess,
    updateEventStart, deleteEventStart,
    updateEventFailed, deleteEventFailed
} from "../reducers/eventSlice";
import { createAxios } from '../../utils/createInstance'; // Import hàm createAxios
import { ToastAndroid } from 'react-native';


export const addEvent = async (dispatch, eventData, user) => {
    dispatch(addEventStart());
    let axiosJWT = createAxios(user);
    try {
        const res = await axiosJWT.post("/v1/event", { ...eventData, userId: user.user.id });
        dispatch(addEventSuccess(res.data));
        return res.data
    } catch (error) {
        console.error("error")
        ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
        dispatch(addEventFailed());
    }
};

export const getRoomBooked = async (RoomEventID, EventDate, user) => {
    let axiosJWT = createAxios(user);
    try {
        const res = await axiosJWT.post("/v1/event/room_booked", { RoomEventID, EventDate });
        return res.data
    } catch (error) {
        console.error("lấy phòng đã đặt trước thất bại thất bại:", error.response.data.message);
    }
};
// // Hàm updateEvent
// export const updateEvent = async (dispatch, eventId, eventData) => {
//     const user = JSON.parse(sessionStorage.getItem("user"));

//     dispatch(updateEventStart());
//     let axiosJWT = createAxios(user);
//     try {
//         const res = await axiosJWT.put(`/v1/event/${eventId}`, eventData);
//         dispatch(updateEventSuccess(res.data));
//     } catch (error) {
//         console.error("Cập nhật sự kiện thất bại:", error);
//         dispatch(updateEventFailed());
//     }
// };

// // Hàm deleteEvent
// export const deleteEvent = async (dispatch, eventId) => {
//     const user = JSON.parse(sessionStorage.getItem("user"));
//     dispatch(deleteEventStart());
//     let axiosJWT = createAxios(user);

//     try {
//         await axiosJWT.delete(`/v1/event/${eventId}`);
//         dispatch(deleteEventSuccess(eventId));
//     } catch (error) {
//         console.error("Xóa sự kiện thất bại:", error);
//         dispatch(deleteEventFailed());
//     }
// };
