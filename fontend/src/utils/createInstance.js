import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

// Không cần hàm refreshToken nữa

export const createAxios = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const newInstance = axios.create();
    
    newInstance.interceptors.request.use(
        async (config) => {
            if (user && user.accessToken) {
                const decodedToken = jwtDecode(user.accessToken);
                const currentTime = Date.now() / 1000; 

                if (decodedToken.exp < currentTime) {
                    toast.error("Token đã hết hạn, vui lòng đăng nhập lại.");
                    return Promise.reject("Token đã hết hạn");
                }

                // Nếu token còn hiệu lực, thêm nó vào header
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
