import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "../Home/HomePage";
import Login from "../Login/Login";
import Register from "../Register/Register";
import Room from "../Rooms/Room";
import BookingPage from "../BookingPage/BookingPage";
import EventPage from "../EventPage/EventPage";
import PaymentPage from "../Payment/PaymentPage";
import UserPage from "../User/UserPage";
import UserInfoPage from "../UserInfo/UserInfo";
import DecorePage from "../Decore/DecorePage";
import Footer from "../Footer/Footer"
import AdminPage from "../Admin/AdminPage"
import Verified from "../Verified/Verified"
import Menu from "../Menu/Menu"
import { toast } from "react-toastify";
import { getAllRooms } from "../../redux/actions/roomRequest";
import { getAllDrink, getAllFood, getAllMenus } from "../../redux/actions/menuRequest";
import { useDispatch } from "react-redux";
import ResetPassword from "../ResetPassword/ResetPassword"
import ResetPasswordEmail from "../ResetPassword/ResetPasswordEmail"
import { getAllUsers } from "../../redux/actions/userRequest";
import { getDecorePrice } from "../../redux/actions/decoreRequest";
const AppRoutes = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user1 = sessionStorage.getItem("user");

    const previousPath = location.pathname;
    useEffect(() => {
        getAllRooms(dispatch);
        getAllMenus(dispatch);
        getAllFood(dispatch)
        getAllDrink(dispatch)
        getDecorePrice(dispatch)
        if(user1){
            if (user1?.user?.admin) {
                getAllUsers(dispatch)
            }
        }
    }, [dispatch,user1]);

    useEffect(() => {

        if (!user1) {
            if (location.pathname === "/booking" || location.pathname === "/room") {
                toast.info("Hãy đăng nhập để đặt phòng");
                sessionStorage.setItem("previousPath", previousPath)
                navigate("/login");

            }
            if (location.pathname === "/logout" || location.pathname === "/user") {
                navigate("/login");

            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionStorage, location.pathname, navigate, previousPath],user1);

    return (
        <>
            <div className="App">
                <Routes>
                    <Route path="/" element={<EventPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/room" element={<Room />} />
                    <Route path="/booking/:roomId" element={<BookingPage />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/user" element={<UserPage />} />
                    <Route path="/user/info" element={<UserInfoPage />} />
                    {/* <Route path="/event" element={<EventPage />} /> */}
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/decore" element={<DecorePage />} />
                    <Route path="/reset_password" element={<ResetPassword />} />
                    <Route path="/reset_password_email" element={<ResetPasswordEmail />} />
                    <Route path="/verified" element={<Verified />} />
                    <Route path="/menu" element={<Menu />} />
                </Routes>
            </div>
            {location.pathname !== "/login" && location.pathname !== "/register" && location.pathname !== "/verified" && <Footer />}
        </>
    );
};

export default AppRoutes;
