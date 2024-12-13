import axios from "axios";

// axios.defaults.baseURL="http://localhost:8000/"
// axios.defaults.baseURL="http://192.168.2.144:8000/"
// axios.defaults.baseURL="https://doancuoiky-1.onrender.com/"
axios.defaults.baseURL="doancuoiky-production.up.railway.app/"
axios.defaults.headers.common = {
    "Content-Type": "application/json", 
    "Accept": "application/json",    
    'ngrok-skip-browser-warning': 'true'  
};
export default axios