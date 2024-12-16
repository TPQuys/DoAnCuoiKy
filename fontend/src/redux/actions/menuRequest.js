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
import {
    getFoodsStart,
    getFoodsFailed,
    getFoodsSuccess
} from "../reducers/foodSilce"
import {
    getDrinksFailed,
    getDrinksStart,
    getDrinksSuccess
} from "../reducers/drinkSlice"
import { toast } from "react-toastify";

// Lấy tất cả menu
export const getAllMenus = async (dispatch) => {
    dispatch(getMenusStart());
    try {
        const res = await axios.get("/v1/menu");
        dispatch(getMenusSuccess(res.data)); 
    } catch (error) {
        console.error("Get menus failed:", error);
        toast.error("Không thể lấy danh sách menu!");
        dispatch(getMenusFailed()); 
    }
};

export const getAllFood = async (dispatch) => {
    dispatch(getFoodsStart());
    try {
        const res = await axios.get("/v1/menu/foods");
        dispatch(getFoodsSuccess(res.data)); 
    } catch (error) {
        console.error("Get menus failed:", error);
        toast.error("Không thể lấy danh sách món ăn!");
        dispatch(getFoodsFailed()); 
    }
};

export const getAllDrink = async (dispatch) => {
    dispatch(getDrinksStart());
    try {
        const res = await axios.get("/v1/menu/drinks");
        dispatch(getDrinksSuccess(res.data)); 
    } catch (error) {
        console.error("Get menus failed:", error);
        toast.error("Không thể lấy danh sách đồ uống!");
        dispatch(getDrinksFailed()); 
    }
};

// Thêm menu
export const addMenu = async (dispatch, menu,update) => {
    dispatch(addMenuStart());
    try {
        const res = await axios.post("/v1/menu", menu);
        dispatch(addMenuSuccess({...res.data,Name:"Menu mới"})); 
        if(!update){
            toast.success("Thêm menu thành công!");
        }
        return res.data
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
