import "./home.css";
import { Link, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';

const HomePage = () => {
  return (
    <main className="home-container">
      <div className="home-header">
      <div>Home</div>
      <h1>EventsIuh</h1>
      </div>s
      <div className="home-body">
        <div className="content-box">
          <div className="content-center">
            <div className="text-box">
              <Link className="content-title">Sảnh sự kiện diễn ra</Link>
              <p className="content-text">Nhà hàng cung cấp gói sự kiện như tiệc cưới, hội nghị, tiệc cá nhân đa dạng về loại hình cho mọi người thoải mái lựa chọn </p>
              <Button variant="contained" sx={{ backgroundColor: '#64463c', color: '#fff' }}>
                Chi tiết
              </Button>
            </div>
            <img src="https://riversidepalace.vn/multidata/_mg_1690-hdr.jpg" className="content-img" alt="img1" />
          </div>
        </div>
        <div className="content-box">
          <div className="content-center">
            <div className="text-box">
              <Link className="content-title">Thực đơn tiếp đãi </Link>
              <p className="content-text">Tùy thuộc vào loại hình sự kiện mà thực đơn sẽ phù hợp theo khẩu vị của khách hàng</p>
              <Button variant="contained" sx={{ backgroundColor: '#81695e', color: '#fff' }}>
                Chi tiết
              </Button>
            </div>
            <img src="https://riversidepalace.vn/multidata/_mg_1690-hdr.jpg" className="content-img" alt="img1" />
          </div>
        </div>
        <div className="content-box">
          <div className="content-center">
            <div className="text-box">
              <Link className="content-title">Trang trí sự kiện</Link>
              <p className="content-text">Đội ngũ trang trí sự kiện luôn tỷ mĩ và chuyên cần để phục vụ tận tâm nhu cầu của khách hàng</p>
              <Button variant="contained" sx={{ backgroundColor: '#81695e', color: '#fff' }}>
                Chi tiết
              </Button>
            </div>
            <img src="https://riversidepalace.vn/multidata/_mg_1690-hdr.jpg" className="content-img" alt="img1" />
          </div>
        </div>
        
      </div>

    </main>
  );
};

export default HomePage;
