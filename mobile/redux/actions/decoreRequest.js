import { createAxios } from "@/utils/createInstance";
// Thêm mới Decore
export const addDecore = async (dispatch, decoreData,user) => {
    let axiosJWT = createAxios(user);
    try {
        const res = await axiosJWT.post("/v1/decore", decoreData);
        return res.data
    } catch (error) {
    }
};
