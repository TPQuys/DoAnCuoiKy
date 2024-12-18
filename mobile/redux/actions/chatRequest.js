import { createAxios } from "../../utils/createInstance";

export const getAllMessage = async ( Room,user) => {
    let axiosJWT = createAxios(user);
    console.log(user,Room)
    try {
        const res = await axiosJWT.get(`/v1/chat/${Room}`);
        console.log(res.data)
        return res.data
    } catch (error) {
        console.error(error)
    }
};

export const getAllRoomChat = async (user) => {
    let axiosJWT = createAxios(user);

    try {
        const res = await axiosJWT.get(`/v1/chat/room`);
        console.log(res.data)
        return res.data
    } catch (error) {
        console.error(error)
    }
};

export const addMessage = async (data,user) => {
    let axiosJWT = createAxios(user);

    try {
        const res = await axiosJWT.post(`/v1/chat/`,data);
        console.log(res.data)
        return res.data
    } catch (error) {
        console.error(error)
    }
};