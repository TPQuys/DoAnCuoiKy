import axios from "../../utils/axiosConfig";
import { createAxios } from "../../utils/createInstance";
import { getRequireDayFailed, getRequireDayStart, getRequireDaySuccess, updateRequireDayFailed, updateRequireDayStart, updateRequireDaySuccess } from "../reducers/requireDay";
import {
    getRoomsStart, getRoomsSuccess, getRoomsFailed,
    addRoomStart, addRoomSuccess, addRoomFailed,
    updateRoomStart, updateRoomSuccess, updateRoomFailed,
    deleteRoomStart, deleteRoomSuccess, deleteRoomFailed
} from "../reducers/roomSlice";
import { toast } from "react-toastify";

// Lấy tất cả phòng
export const getAllRooms = async (dispatch) => {
    dispatch(getRoomsStart());
    try {
        const res = await axios.get("/v1/room");
        dispatch(getRoomsSuccess(res.data));
        console.log(res.data)
    } catch (error) {
        console.error("Get rooms failed:", error);
        toast.error("Không thể lấy danh sách phòng!");
        dispatch(getRoomsFailed());
    }
};

// Lấy tất cả phòng
export const getAvailableRooms = async (values) => {
    let axiosJWT = createAxios();
    try {
        const res = await axiosJWT.post("/v1/room/available",{values});
        return res.data
    } catch (error) {
        console.error("Get rooms failed:", error);
        toast.error("Không thể lấy danh sách phòng!");
    }
};

// Thêm phòng
export const addRoom = async (dispatch, roomData, file) => {
    let axiosJWT = createAxios();
    try {
        const formData = new FormData();
        Object.keys(roomData).forEach(key => {
            formData.append(key, roomData[key]);
        });
        formData.append('imageRoom', file); // Thêm file vào FormData
        const res = await axiosJWT.post("/v1/room", formData, {
            headers: {
                'Content-Type': 'multipart/form-data' // Đảm bảo header cho FormData
            }
        });
        dispatch(addRoomSuccess(res.data));
        toast.success("Thêm phòng thành công!");
    } catch (error) {
        console.error("Add room failed:", error);
        toast.error("Không thể thêm phòng!");
        dispatch(addRoomFailed());
    }
};

// Cập nhật phòng
export const updateRoomHaveImage = async (dispatch, roomData, file) => {
    let axiosJWT = createAxios();
    try {
        const formData = new FormData();
        Object.keys(roomData).forEach(key => {
            formData.append(key, roomData[key]);
        });
        formData.append('imageRoom', file); // Thêm file vào FormData
        const res = await axiosJWT.put(`/v1/room/${roomData.RoomEventID}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data' // Đảm bảo header cho FormData
            }
        });
        const room = {...res.data,RoomImage:`${res.data.RoomImage}?t=${new Date().getTime()}`}
        dispatch(updateRoomSuccess(room));
        console.log(res.data)
        toast.success("Cập nhật phòng thành công!");
    } catch (error) {
        console.error("Update room failed:", error);
        toast.error("Không thể cập nhật phòng!");
    }
};

// Cập nhật phòng
export const updateRoomNoImage = async (dispatch, roomData) => {
    let axiosJWT = createAxios();
    try {
        const res = await axiosJWT.put(`/v1/room/${roomData.RoomEventID}`, roomData );
        dispatch(updateRoomSuccess(res.data));
        console.log(res.data)
        toast.success("Cập nhật phòng thành công!");
    } catch (error) {
        console.error("Update room failed:", error);
        toast.error("Không thể cập nhật phòng!");
    }
};

// Xóa phòng
export const deleteRoom = async (dispatch, roomId) => {
    const user = JSON.parse(sessionStorage.getItem("user"))?.user;
    dispatch(deleteRoomStart);
    let axiosJWT = createAxios(user);
    try {
        await axiosJWT.delete(`/v1/room/${roomId}`);
        dispatch(deleteRoomSuccess(roomId));
        toast.success("Xóa phòng thành công!");
    } catch (error) {
        console.error("Delete room failed:", error);
        toast.error("Không thể xóa phòng đã được đặt!");
        dispatch(deleteRoomFailed());
    }
};

export const getRequireDay = async (dispatch) => {
    const user = JSON.parse(sessionStorage.getItem("user"))?.user;
    dispatch(getRequireDayStart());
    let axiosJWT = createAxios(user);
    try {
        const res = await axiosJWT.get(`/v1/require_day`);
        dispatch(getRequireDaySuccess(res.data));
    } catch (error) {
        console.error("Get require day failed:", error);
        dispatch(getRequireDayFailed());
    }
};


// Xóa phòng
export const updateRequireDay = async (dispatch,numberDay,caution,alldayRate) => {
    const user = JSON.parse(sessionStorage.getItem("user"))?.user;
    console.log({numberDay})
    dispatch(updateRequireDayStart());
    let axiosJWT = createAxios(user);
    try {
        const res = await axiosJWT.put(`/v1/require_day`,{numberDay,caution,alldayRate});
        toast.success("Cập nhập thành công")
        dispatch(updateRequireDaySuccess(res.data));
    } catch (error) {
        console.error("Update require day failed:", error);
        dispatch(updateRequireDayFailed());
    }
};