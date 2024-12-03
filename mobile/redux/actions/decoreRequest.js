import { createAxios } from "@/utils/createInstance";
import { getRoomPricesFailed, getRoomPricesStart, getRoomPricesSuccess } from "../reducers/decorePriceSlice";
import axios from "axios";
// Thêm mới Decore
export const addDecore = async (dispatch, decoreData,user) => {
    let axiosJWT = createAxios(user);
    try {
        const res = await axiosJWT.post("/v1/decore", decoreData);
        return res.data
    } catch (error) {
    }
};
export const getDecorePrice = async (dispatch) => {
    dispatch(getRoomPricesStart());
    try {
        const res = await axios.get("/v1/decore/decore_price");
        dispatch(getRoomPricesSuccess(res.data));
    } catch (error) {
        console.error("Lấy danh sách giá trang trí thất bại!");
        console.error(error);
        dispatch(getRoomPricesFailed());
    }
};
