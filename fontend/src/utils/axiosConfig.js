import axios from "axios";
import url from "./url"
axios.defaults.baseURL=url
// axios.defaults.baseURL="https://doancuoiky-production.up.railway.app/"
// axios.defaults.baseURL="http://localhost:8000/"
axios.defaults.headers.common = {
    "Content-Type": "application/json", // Adjust as needed
    "Accept": "application/json",    
    'ngrok-skip-browser-warning': 'true'    // Specify the response format
};
export default axios