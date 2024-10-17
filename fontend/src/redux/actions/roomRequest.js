import axios from "axios";
import { getRoomsStart, getRoomsSuccess, getRoomsFailed } from "../reducers/roomSlice";
import { toast } from "react-toastify";

export const getAllRooms = async (dispatch) => {
    dispatch(getRoomsStart());
    try {
        const res = await axios.get("/v1/room");
        dispatch(getRoomsSuccess(res.data)); 
        console.log(res.data);
    } catch (error) {
        console.error("Get rooms failed:", error);
        toast.error("Không thể lấy danh sách phòng!");
        dispatch(getRoomsFailed()); 
    }
};
