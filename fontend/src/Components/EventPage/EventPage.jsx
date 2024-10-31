import "./eventPage.css";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Header from '../Header/Header'
import { getBookingByUser } from "../../redux/actions/bookingRequest";
import { useDispatch } from "react-redux";
const HomePage = () => {
  const dispatch = useDispatch()
  return (
    <main className="home-container">
      <Header background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/homeheader.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21laGVhZGVyLmpwZyIsImlhdCI6MTcyNzYxODE4OSwiZXhwIjoxNzU5MTU0MTg5fQ.QU5J1wJV043dbnA6WzcnrIvAVUFGtf3Xc7QCsdIPvR8&t=2024-09-29T13%3A56%3A29.431Z" title="SỰ KIỆN" />
      <div className="home-body">
        <div className="content-box">
          <div className="content-center">
            <div className="text-box">
              <Link className="content-title">TIỆC CƯỚI TRỌN VẸN</Link>
              <p className="content-text">[NAME] tự hào tổ chức thành công nhiều tiệc cưới ấn tượng nhất trong những năm gần đây. Thấu hiểu ước mơ về một tiệc cưới thần tiên của các đôi trẻ, [NAME] luôn...</p>
              <Button variant="contained" sx={{ backgroundColor: '#64463c', color: '#fff' }}
              onClick={()=>getBookingByUser(dispatch)}
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
              <Link className="content-title">HỘI NGHỊ HOÀN HẢO</Link>
              <p className="content-text">[NAME] có thể đáp ứng cho những đại tiệc hội nghị lên đến 4.500 khách với những tiện ích vượt ngoài mong đợi. Từ hội nghị khách hàng, tiệc liên hoan tất niên hàng năm cho...</p>
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
              <Link className="content-title">SỰ KIỆN ĐẲNG CẤP</Link>
              <p className="content-text">Hội tụ đầy đủ các yếu tố của một trung tâm tổ chức sự kiện hiện đại, từ không gian, địa điểm, phong cách cho đến nguồn nhân lực, trung tâm sự kiện [NAME] là điểm đến...</p>
              <Button variant="contained" sx={{ backgroundColor: '#81695e', color: '#fff' }}>
                Chi tiết
              </Button>
            </div>
            <img src="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/home_decor.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21lX2RlY29yLmpwZyIsImlhdCI6MTcyNzg5MTYwNiwiZXhwIjoxNzU5NDI3NjA2fQ.vq7vUyhpKjumPL2FH86q-mZiRoBVXKa_Q6B2hEHLpWM&t=2024-10-02T17%3A53%3A26.577Z" className="content-img" alt="img1" />
          </div>
        </div>
        <div>
          <h1>Ưu đãi đặc biệt</h1>
          <hr size="10" style={{width: '200px', margin: 'auto', marginBottom: '1rem'}}/>
          <img style={{width: 'calc(100% - 2rem)'}} className="mx-3" src="https://riversidepalace.vn/multidata/banner-web-1200x500-01.jpg" alt="Event Banner" />
        </div>
        <div className="mt-5">
          <h1>Tin tức đặc biệt</h1>
          <hr size="10" style={{width: '200px', margin: 'auto', marginBottom: '4rem'}}/>
          <div className="content-box">
            <div className="row flex-row flex-nowrap mx-2" style={{overflowX: 'scroll'}}>
              <NewsItem 
                src="https://riversidepalace.vn/multidata/tim-kiem-dia-diem-to-chuc-hoi-nghi-tai-tphcm-ung-y-cho-su-kien-cua-ban.jpg"
                title="Tìm kiếm địa điểm tổ chức hội nghị tại TPHCM ưng ý cho sự kiện của bạn?"
                content="Tổ chức hội thảo thành công là một chìa khóa quan trọng để thúc đẩy doanh nghiệp phát triển, nâng cao uy tín thương hiệu và thu hút khách hàng tiềm năng...."
              />
              <NewsItem 
                src="https://riversidepalace.vn/multidata/gia-tiec-cuoi-riverside.jpg"
                title='Vượt qua thử thách "tiết kiệm" trong mùa cưới?'
                content="Mùa cưới đang đến gần, mang theo niềm vui và háo hức cho các cặp đôi. Tuy nhiên, việc tổ chức với dịch vụ tiệc cưới trong mùa cao điểm cũng đồng nghĩa..."
              />
              <NewsItem 
                src="https://riversidepalace.vn/multidata/dich-vu-dam-cuoi-riverside.jpg"
                title='Khám phá 3 chủ đề trang trí tiệc cưới mùa hè được các cặp đôi ưa chuộng'
                content="Lễ cưới là một dấu mốc quan trọng trong cuộc đời mỗi người, là nơi khởi đầu cho hành trình hạnh phúc lứa đôi. Để ngày trọng đại thêm phần hoàn hảo, việc lựa..."
              />
              <NewsItem 
                src="https://riversidepalace.vn/multidata/n1.jpg"
                title='Các bước tổ chức đám cưới đầy đủ dành cho cô dâu chú rể'
                content="Đám cưới là sự kiện trọng đại trong đời nên ai cũng mong muốn chuẩn bị thật chỉn chu. Tuy nhiên, số lượng công việc cần thực hiện cho đám cưới lại khá nhiều,..."
              />
            </div>
          </div>
        </div>
      </div>
    </main >
  );
};

function NewsItem({src = '', title = '', content = ''}) {
  return <div className="col-4">
    <img style={{bottom: 30, position: 'relative', width: '100%'}} src={src} alt="" />
    <div>
      <h4 style={{textAlign: 'left'}}>{title}</h4>
      <hr style={{width: '25%', marginBottom: '1rem'}}/>
      <p style={{textAlign: 'left'}}>{content}</p>
    </div>
  </div>
}

export default HomePage;
