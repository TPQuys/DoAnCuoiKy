import { createAxios } from "../../utils/createInstance";

export const getAllMessage = async ( Room) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    let axiosJWT = createAxios(user);

    try {
        const res = await axiosJWT.get(`/v1/chat/${Room}`);
        console.log(res.data)
        return res.data
    } catch (error) {
        console.error(error)
    }
};

export const getAllRoomChat = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    let axiosJWT = createAxios(user);

    try {
        const res = await axiosJWT.get(`/v1/chat/room`);
        console.log(res.data)
        return res.data
    } catch (error) {
        console.error(error)
    }
};

export const addMessage = async (data) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    let axiosJWT = createAxios(user);

    try {
        const res = await axiosJWT.post(`/v1/chat/`,data);
        console.log(res.data)
        return res.data
    } catch (error) {
        console.error(error)
    }
};