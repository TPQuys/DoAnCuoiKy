import axios from "@/utils/axiosConfig";
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

// Lấy tất cả menu
export const getAllMenus = async (dispatch) => {
    dispatch(getMenusStart());
    try {
        const res = await axios.get("/v1/menu");
        dispatch(getMenusSuccess(res.data)); 
        console.log(res.data);
    } catch (error) {
        console.error("Get menus failed:", error);
        dispatch(getMenusFailed()); 
    }
};

// Thêm menu
export const addMenu = async (dispatch, menu) => {
    dispatch(addMenuStart());
    try {
        const res = await axios.post("/v1/menu", menu);
        dispatch(addMenuSuccess(res.data)); 
    } catch (error) {
        console.error("Add menu failed:", error);
        dispatch(addMenuFailed()); 
    }
};

// Cập nhật menu
export const updateMenu = async (dispatch, menu) => {
    dispatch(updateMenuStart());
    try {
        const res = await axios.put(`/v1/menu/${menu.MenuID}`, menu);
        dispatch(updateMenuSuccess(res.data)); 
    } catch (error) {
        console.error("Update menu failed:", error);
        dispatch(updateMenuFailed()); 
    }
};

// Xóa menu
export const deleteMenu = async (dispatch, menuId) => {
    dispatch(deleteMenuStart());
    try {
        await axios.delete(`/v1/menu/${menuId}`);
        dispatch(deleteMenuSuccess(menuId)); 
    } catch (error) {
        console.error("Delete menu failed:", error);
        dispatch(deleteMenuFailed()); 
    }
};
