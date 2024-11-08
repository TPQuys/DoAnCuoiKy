import axios from "axios";
import { useSelector } from "react-redux";

// Không cần hàm refreshToken nữa

export const createAxios = (user) => {
    const newInstance = axios.create();
    newInstance.interceptors.request.use(
        async (config) => {
            // Kiểm tra xem user có tồn tại và có accessToken không
            if (user && user.accessToken) {
                config.headers["authorization"] = "Bearer " + user.accessToken;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return newInstance;
}
