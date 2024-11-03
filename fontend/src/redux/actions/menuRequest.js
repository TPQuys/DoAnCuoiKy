import axios from "../../utils/axiosConfig";
import { 
    getMenusStart, 
    getMenusSuccess, 
    getMenusFailed,
    addMenuStart,
    addMenuSuccess,
    addMenuFailed,
    updateMenuStart,
    updateMenuSuccess,
    updateMenuFailed,
    deleteMenuStart,
    deleteMenuSuccess,
    deleteMenuFailed
} from "../reducers/menuSlice";
import { toast } from "react-toastify";

// Lấy tất cả menu
export const getAllMenus = async (dispatch) => {
    dispatch(getMenusStart());
    try {
        const res = await axios.get("/v1/menu");
        dispatch(getMenusSuccess(res.data)); 
        console.log(res.data);
    } catch (error) {
        console.error("Get menus failed:", error);
        toast.error("Không thể lấy danh sách menu!");
        dispatch(getMenusFailed()); 
    }
};

// Thêm menu
export const addMenu = async (dispatch, menu) => {
    dispatch(addMenuStart());
    try {
        const res = await axios.post("/v1/menu", menu);
        dispatch(addMenuSuccess(res.data)); 
        toast.success("Thêm menu thành công!");
    } catch (error) {
        console.error("Add menu failed:", error);
        toast.error("Không thể thêm menu!");
        dispatch(addMenuFailed()); 
    }
};

// Cập nhật menu
export const updateMenu = async (dispatch, menu) => {
    dispatch(updateMenuStart());
    try {
        const res = await axios.put(`/v1/menu/${menu.MenuID}`, menu);
        dispatch(updateMenuSuccess(res.data)); 
        toast.success("Cập nhật menu thành công!");
    } catch (error) {
        console.error("Update menu failed:", error);
        toast.error("Không thể cập nhật menu!");
        dispatch(updateMenuFailed()); 
    }
};

// Xóa menu
export const deleteMenu = async (dispatch, menuId) => {
    dispatch(deleteMenuStart());
    try {
        await axios.delete(`/v1/menu/${menuId}`);
        dispatch(deleteMenuSuccess(menuId)); 
        toast.success("Xóa menu thành công!");
    } catch (error) {
        console.error("Delete menu failed:", error);
        toast.error("Không thể xóa menu!");
        dispatch(deleteMenuFailed()); 
    }
};
