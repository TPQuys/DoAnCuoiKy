import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "../Home/HomePage";
import Login from "../Login/Login";
import Register from "../Register/Register";
import Room from "../Rooms/Room";
import BookingPage from "../BookingPage/BookingPage";
import Footer from "../Footer/Footer"
import { toast } from "react-toastify";

const AppRoutes = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const user = sessionStorage.getItem("user");
    const previousPath = location.pathname; 

    useEffect(() => {
        if (!user && (location.pathname === "/booking" || location.pathname === "/room")) {
            toast.info("Hãy đăng nhập để đặt phòng");
            sessionStorage.setItem("previousPath",previousPath)
            navigate("/login"); // Chuyển hướng và lưu đường dẫn trước đó
        }
    }, [user, location.pathname, navigate, previousPath]);

    return (
        <>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/room" element={<Room />} />
                    <Route path="/booking" element={<BookingPage />} />
                </Routes>
            </div>
            {location.pathname !== "/login" && location.pathname !== "/register" && <Footer />}
        </>
    );
};

export default AppRoutes;
