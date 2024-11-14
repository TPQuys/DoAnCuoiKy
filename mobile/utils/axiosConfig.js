import axios from "axios";

axios.defaults.baseURL="https://doancuoiky-1.onrender.com/"
axios.defaults.headers.common = {
    "Content-Type": "application/json", 
    "Accept": "application/json",    
    'ngrok-skip-browser-warning': 'true'  
};
export default axios