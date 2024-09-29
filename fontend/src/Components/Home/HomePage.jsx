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
              <Link className="content-title">Sảnh sự kiện</Link>
              <p className="content-text">Chín sảnh tiệc được đặt theo tên những dòng sông huyền thoại trên thế giới như Seine, Nile, Volga, Thames, Danube, Amur, Elbe và có thể thông nhau phục vụ cùng lúc 4.500...</p>
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
              <Link className="content-title">Sảnh sự kiện</Link>
              <p className="content-text">Chín sảnh tiệc được đặt theo tên những dòng sông huyền thoại trên thế giới như Seine, Nile, Volga, Thames, Danube, Amur, Elbe và có thể thông nhau phục vụ cùng lúc 4.500...</p>
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
              <Link className="content-title">Sảnh sự kiện</Link>
              <p className="content-text">Chín sảnh tiệc được đặt theo tên những dòng sông huyền thoại trên thế giới như Seine, Nile, Volga, Thames, Danube, Amur, Elbe và có thể thông nhau phục vụ cùng lúc 4.500...</p>
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
