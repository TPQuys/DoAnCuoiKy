import axios from "axios";

axios.defaults.baseURL="http://192.168.2.113:8000/"
axios.defaults.headers.common = {
    "Content-Type": "application/json", // Adjust as needed
    "Accept": "application/json",    
    'ngrok-skip-browser-warning': 'true'    // Specify the response format
};
export default axios