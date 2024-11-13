import axios from "axios";

axios.defaults.baseURL="https://ab7c-27-65-230-251.ngrok-free.app/"
axios.defaults.headers.common = {
    "Content-Type": "application/json", 
    "Accept": "application/json",    
    'ngrok-skip-browser-warning': 'true'  
};
export default axios