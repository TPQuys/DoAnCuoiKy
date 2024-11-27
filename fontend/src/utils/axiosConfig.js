import axios from "axios";

// axios.defaults.baseURL="https://doancuoiky-1.onrender.com/"
axios.defaults.baseURL="http://localhost:8000/"
axios.defaults.headers.common = {
    "Content-Type": "application/json", // Adjust as needed
    "Accept": "application/json",    
    'ngrok-skip-browser-warning': 'true'    // Specify the response format
};
export default axios