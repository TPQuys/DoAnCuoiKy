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
// import { GiFlowers } from "react-icons/gi";

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

  return (
    <nav className={`navbar-container ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <Link to="/" className="navbar-home"><FaHome /> Trang chủ </Link>
      <div className="navbar-dropdown">
        <Link className="navbar-home"> <FaCalendarAlt /> Thêm </Link>
        <div className="dropdown-menu">
          <Link to="/menu">Menu</Link>
          <Link to="/event/conference">Hội nghị</Link>
          <Link to="/event/other">Sự kiện khác</Link>
        </div>
      </div>
      {/* <div className="navbar-dropdown">
        <Link to="/food" className="navbar-home"><FaUtensils /> Thực đơn </Link>
        <div className="dropdown-menu">
          <Link to="/food/main-course">Món chính</Link>
          <Link to="/food/side-dish">Món phụ</Link>
          <Link to="/food/drinks">Đồ uống</Link>
        </div>
      </div> */}
      {/* <Link to="/decore" className="navbar-home"><GiFlowers /> Trang trí </Link> */}
      <Link to="/room" className="navbar-home"><FaTag /> Đặt nhà hàng </Link>
      {/* <Link to="/discount" className="navbar-home"><FaTag /> Ưu đãi </Link> */}
      {/* <Link to="/news" className="navbar-home"><FaNewspaper /> Tin tức </Link> */}
      {user ? (
        user?.admin ? (
          <>
          <div className="navbar-dropdown">
              <Link to="/admin" className="navbar-home"><FaUser /> Admin <span> {user?.username} </span> </Link>
              {/* <div className="dropdown-menu">
                <Link to="/user/info">Thông tin cá nhân</Link>
                <Link to="/payment">Thanh toán</Link>
              </div> */}
            </div>
            <Link className="navbar-logout" onClick={handleLogOut}> <IoCloseCircle /> Đăng xuất</Link>
          </> 
        ) : (
          <>
            <div className="navbar-dropdown">
              <Link to="/user/info" className="navbar-home"><FaUser /> Cá nhân <span> {user.username} </span> </Link>
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
