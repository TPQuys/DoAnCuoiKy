import axios from "axios";

// Không cần hàm refreshToken nữa

export const createAxios = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
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
