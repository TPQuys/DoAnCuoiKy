import "./home.css";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Header from '../Header/Header'
const HomePage = () => {
  return (
    <main className="home-container">
      <Header background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/homeheader.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21laGVhZGVyLmpwZyIsImlhdCI6MTcyNzYxODE4OSwiZXhwIjoxNzU5MTU0MTg5fQ.QU5J1wJV043dbnA6WzcnrIvAVUFGtf3Xc7QCsdIPvR8&t=2024-09-29T13%3A56%3A29.431Z" title="TRANG CHỦ" />
      <div className="home-body">
        <div className="content-box">
          <div className="content-center">
            <div className="text-box">
              <Link className="content-title">Sảnh sự kiện diễn ra</Link>
              <p className="content-text">Nhà hàng cung cấp gói sự kiện như tiệc cưới, hội nghị, tiệc cá nhân đa dạng về loại hình cho mọi người thoải mái lựa chọn </p>
              <Button variant="contained" sx={{ backgroundColor: '#64463c', color: '#fff' }}
              >
                Chi tiết
              </Button>
            </div>
            <img src="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/home_lobby.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21lX2xvYmJ5LmpwZWciLCJpYXQiOjE3Mjc4OTE0NTYsImV4cCI6MTc1OTQyNzQ1Nn0.k-RnOmYq9JeJSMToDeYN-ztbswvpWrf__GYNe35hDA0&t=2024-10-02T17%3A50%3A55.704Z" className="content-img" alt="img1" />
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
            <img src="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/home_menu.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21lX21lbnUuanBlZyIsImlhdCI6MTcyNzg5MTU4MywiZXhwIjoxNzU5NDI3NTgzfQ.XjBLtDi_lLPgFYXSN6MGNRF8jOUL6pZQ3pe3AOvzhgU&t=2024-10-02T17%3A53%3A03.097Z" className="content-img" alt="img1" />
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
            <img src="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/home_decor.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21lX2RlY29yLmpwZyIsImlhdCI6MTcyNzg5MTYwNiwiZXhwIjoxNzU5NDI3NjA2fQ.vq7vUyhpKjumPL2FH86q-mZiRoBVXKa_Q6B2hEHLpWM&t=2024-10-02T17%3A53%3A26.577Z" className="content-img" alt="img1" />
          </div>
        </div>

      </div>
    </main >
  );
};

export default HomePage;
