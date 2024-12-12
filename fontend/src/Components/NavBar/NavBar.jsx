import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import "./navbar.css";
import { logOut } from "../../redux/actions/apiRequest";
import { createAxios } from "../../utils/createInstance";
import {
  FaHome,
  // FaUtensils, 
  FaTag,
  // FaNewspaper, 
  FaCalendarAlt, FaUserCircle, FaUser
} from 'react-icons/fa';
import { CiLogin } from "react-icons/ci";
import { IoCloseCircle } from "react-icons/io5";
import { GiFlowers } from "react-icons/gi";
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';
import { Avatar } from "@mui/material";
const NavBar = () => {
  const user = useSelector((state) => state.auth.login.currentUser)?.user;
  const [accessToken] = useState(user?.accessToken);
  const id = user?._id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogOut = () => {
    logOut(dispatch, id, navigate, accessToken, axiosJWT);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerWidth * 0.1;
      if (window.scrollY > scrollThreshold) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    if (user?.email) {
      if (window.Tawk_API) {
        try {
          window.Tawk_API.endChat(); // Đóng chat hiện tại
        } catch {
          console.error("Error")
        }
        window.Tawk_API.visitor = {
          name: user.email || "Khách",
        };
      }
    } else {
      // Xóa đoạn chat hiện tại khi user là null
      if (window.Tawk_API) {
        window.Tawk_API.hideWidget(); // Đóng chat hiện tại
        console.log("Tawk chat session ended");
      }
    }
  }, [user]);
  const onLoad = () => {
    console.log('onLoad works!');
  };

  return (
    <nav className={`navbar-container ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <Link to="/" className="navbar-home"><FaHome /> Trang chủ </Link>
      <div className="navbar-dropdown">
        <Link className="navbar-home"> <FaCalendarAlt /> Thêm </Link>
        <div className="dropdown-menu">
          <Link to="/menu">Menu</Link>
           {/* <Link to="/discount" className="navbar-home"><FaTag /> Ưu đãi </Link> */}
      {/* <Link to="/news" className="navbar-home"><FaNewspaper /> Tin tức </Link> */}
      <Link to="/decore" className="navbar-home"><GiFlowers /> Trang trí </Link>
        </div>
      </div>
      <Link to="/room" className="navbar-home"><FaTag /> Đặt nhà hàng </Link>

      {user ? (
        user?.role!=="USER" ? (
          <>
            <div className="navbar-dropdown">
              <Link to="/admin" className="navbar-home">
              <Avatar sx={{ width: "25px", height: "25px", margin: 1, display:'inline-flex'}} src={user?.avatar} />
               {user?.role} <span> {user?.username} </span> </Link>
           
            </div>
            <Link className="navbar-logout" onClick={handleLogOut}> <IoCloseCircle /> Đăng xuất</Link>
          </>
        ) : (
          <>
            {user?.email && <TawkMessengerReact
              propertyId="674b27722480f5b4f5a62a5d"
              widgetId="1idup45v4"
              onLoad={onLoad} />
            }
            <div className="navbar-dropdown">
              <Link to="/user/info" className="navbar-home">
              <Avatar sx={{ width: "25px", height: "25px", margin: 1, display:'inline-flex'}} src={user?.avatar} />
              Cá nhân <span> {user.username} </span> </Link>
              <div className="dropdown-menu">
                <Link to="/user/info">Thông tin cá nhân</Link>
                <Link to="/user">Lịch sử</Link>
              </div>
            </div>
            <Link className="navbar-logout" onClick={handleLogOut}> <IoCloseCircle /> Đăng xuất</Link>
          </>
        )
      ) : (
        <>
          <Link to="/login" className="navbar-login"><CiLogin /> Đăng nhập </Link>
          <Link to="/register" className="navbar-register"><FaUserCircle /> Đăng ký</Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;
