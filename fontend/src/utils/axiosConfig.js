import axios from "axios";

axios.defaults.baseURL="https://3ada-171-252-209-229.ngrok-free.app/"
axios.defaults.headers.common = {
    "Content-Type": "application/json", // Adjust as needed
    "Accept": "application/json",    
    'ngrok-skip-browser-warning': 'true'    // Specify the response format
};
export default axios