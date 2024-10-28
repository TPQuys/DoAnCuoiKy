import axios from "axios";


// import { jwtDecode } from "jwt-decode";

const refreshToken = async () => {
    try {
        console.log("reflesh")
        const res = await axios.post("/v1/auth/refresh", {
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export const createAxios = (user) => {
    const newInstance = axios.create();
    newInstance.interceptors.request.use(
        async (config) => {
            // let date = new Date();
            // const decodedToken = jwtDecode(user?.accessToken);
            // if(decodedToken.exp < date.getTime()/1000){
            const data = await refreshToken();
            // const refreshUser = {
            //     ...user,
            //     accessToken: data.accessToken,
            // };
            config.headers["token"] = "Bearer " + data.accessToken;
            // }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    return newInstance;
}