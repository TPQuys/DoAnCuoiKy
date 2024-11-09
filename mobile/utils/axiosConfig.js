import axios from "axios";

axios.defaults.baseURL="http://192.168.2.120:8000/"
axios.defaults.headers.common = {
    "Content-Type": "application/json", 
    "Accept": "application/json",    
    'ngrok-skip-browser-warning': 'true'  
};
export default axios