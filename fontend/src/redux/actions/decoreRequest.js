import { toast } from "react-toastify";
import { createAxios } from "../../utils/createInstance";
// import { addDecoreStart, addDecoreSuccess, addDecoreFailed, 
//          getDecoresStart, getDecoresSuccess, getDecoresFailed,
//          updateDecoreStart, updateDecoreSuccess, updateDecoreFailed,
//          deleteDecoreStart, deleteDecoreSuccess, deleteDecoreFailed } from "../reducers/decoreSlice";

// Thêm mới Decore
import {
    getRoomPricesStart, getRoomPricesFailed, getRoomPricesSuccess,
    updateRoomPriceFailed, updateRoomPriceStart, updateRoomPriceSuccess

} from '../reducers/decorePriceSlice'
export const addDecore = async (dispatch, decoreData) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    let axiosJWT = createAxios(user);

    try {
        const res = await axiosJWT.post("/v1/decore", decoreData);
        return res.data
    } catch (error) {
    }
};

// // Lấy tất cả Decore price
export const getDecorePrice = async (dispatch) => {
    dispatch(getRoomPricesStart());
    const user = JSON.parse(sessionStorage.getItem("user"));
    let axiosJWT = createAxios(user);

    try {
        const res = await axiosJWT.get("/v1/decore/decore_price");
        dispatch(getRoomPricesSuccess(res.data));
    } catch (error) {
        toast.error("Lấy danh sách giá trang trí thất bại!");
        dispatch(getRoomPricesFailed());
    }
};

// // Cập nhật Decore
// export const updateDecore = async (dispatch, decoreId, decoreData) => {
//     const user = JSON.parse(sessionStorage.getItem("user"));
//     dispatch(updateDecoreStart());
//     let axiosJWT = createAxios(user);

//     try {
//         const res = await axiosJWT.put(`/api/decores/${decoreId}`, decoreData);
//         dispatch(updateDecoreSuccess(res.data));
//         toast.success("Cập nhật trang trí thành công!");
//     } catch (error) {
//         console.error("Cập nhật trang trí thất bại:", error);
//         toast.error("Cập nhật trang trí thất bại!");
//         dispatch(updateDecoreFailed());
//     }
// };

// // Xóa Decore
// export const deleteDecore = async (dispatch, decoreId) => {
//     const user = JSON.parse(sessionStorage.getItem("user"));
//     dispatch(deleteDecoreStart());
//     let axiosJWT = createAxios(user);

//     try {
//         await axiosJWT.delete(`/api/decores/${decoreId}`);
//         dispatch(deleteDecoreSuccess(decoreId));
//         toast.success("Xóa trang trí thành công!");
//     } catch (error) {
//         console.error("Xóa trang trí thất bại:", error);
//         toast.error("Xóa trang trí thất bại!");
//         dispatch(deleteDecoreFailed());
//     }
// };
