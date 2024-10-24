import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "../Home/HomePage";
import Login from "../Login/Login";
import Register from "../Register/Register";
import Room from "../Rooms/Room";
import BookingPage from "../BookingPage/BookingPage";
import PaymentPage from "../Payment/PaymentPage";
import Footer from "../Footer/Footer"
import { toast } from "react-toastify";
import { getAllRooms } from "../../redux/actions/roomRequest";
import { getAllMenus } from "../../redux/actions/menuRequest";
import { useDispatch } from "react-redux";

const AppRoutes = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const previousPath = location.pathname; 

    useEffect(() => {
        getAllRooms(dispatch);
        getAllMenus(dispatch)
    }, []);

    useEffect(() => {
        const user = sessionStorage.getItem("user");
        if (!user && (location.pathname === "/booking" || location.pathname === "/room")) {
            toast.info("Hãy đăng nhập để đặt phòng");
            sessionStorage.setItem("previousPath",previousPath)
            navigate("/login"); 
        }
    }, [sessionStorage, location.pathname, navigate, previousPath]);

    return (
        <>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/room" element={<Room />} />
                    <Route path="/booking/:roomId" element={<BookingPage />} />
                    <Route path="/payment" element={<PaymentPage />} />
                </Routes>
            </div>
            {location.pathname !== "/login" && location.pathname !== "/register" && <Footer />}
        </>
    );
};

export default AppRoutes;
