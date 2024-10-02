import "./room.css";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Header from "../Header/Header";

const HomePage = () => {
    return (
        <main className="room-container">
            <Header background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/homeheader.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21laGVhZGVyLmpwZyIsImlhdCI6MTcyNzYxODE4OSwiZXhwIjoxNzU5MTU0MTg5fQ.QU5J1wJV043dbnA6WzcnrIvAVUFGtf3Xc7QCsdIPvR8&t=2024-09-29T13%3A56%3A29.431Z" title="Room" />
            <div className="room-body">
                <div className="room-content-box">
                    <div className="room-content-center">
                        <div className="room-text-box">
                            <Link className="room-content-title">'Tên bàn' </Link>
                            <p className="room-content-text">Chiều dài: </p>
                            <p className="room-content-text">Chiều rộng: </p>
                            <p className="room-content-text">Số người: </p>
                            <p className="room-content-text">Số bàn tối đa: </p>
                            <Button variant="contained" sx={{ backgroundColor: '#64463c', color: '#fff' }}>
                                Đặt ngay
                            </Button>
                        </div>
                        <img src="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/home_lobby.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21lX2xvYmJ5LmpwZWciLCJpYXQiOjE3Mjc4OTE0NTYsImV4cCI6MTc1OTQyNzQ1Nn0.k-RnOmYq9JeJSMToDeYN-ztbswvpWrf__GYNe35hDA0&t=2024-10-02T17%3A50%3A55.704Z" className="room-content-img" alt="img1" />
                    </div>
                </div>
                <div className="room-content-box">
                    <div className="room-content-center">
                        <div className="room-text-box">
                            <Link className="room-content-title">'Tên bàn' </Link>
                            <p className="room-content-text">Chiều dài: </p>
                            <p className="room-content-text">Chiều rộng: </p>
                            <p className="room-content-text">Số người: </p>
                            <p className="room-content-text">Số bàn tối đa: </p>
                            <Button variant="contained" sx={{ backgroundColor: '#64463c', color: '#fff' }}>
                                Đặt ngay
                            </Button>
                        </div>
                        <img src="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/home_lobby.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21lX2xvYmJ5LmpwZWciLCJpYXQiOjE3Mjc4OTE0NTYsImV4cCI6MTc1OTQyNzQ1Nn0.k-RnOmYq9JeJSMToDeYN-ztbswvpWrf__GYNe35hDA0&t=2024-10-02T17%3A50%3A55.704Z" className="room-content-img" alt="img1" />
                    </div>
                </div>
                <div className="room-content-box">
                    <div className="room-content-center">
                        <div className="room-text-box">
                            <Link className="room-content-title">'Tên bàn' </Link>
                            <p className="room-content-text">Chiều dài: </p>
                            <p className="room-content-text">Chiều rộng: </p>
                            <p className="room-content-text">Số người: </p>
                            <p className="room-content-text">Số bàn tối đa: </p>
                            <Button variant="contained" sx={{ backgroundColor: '#64463c', color: '#fff' }}>
                                Đặt ngay
                            </Button>
                        </div>
                        <img src="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/home_lobby.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21lX2xvYmJ5LmpwZWciLCJpYXQiOjE3Mjc4OTE0NTYsImV4cCI6MTc1OTQyNzQ1Nn0.k-RnOmYq9JeJSMToDeYN-ztbswvpWrf__GYNe35hDA0&t=2024-10-02T17%3A50%3A55.704Z" className="room-content-img" alt="img1" />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default HomePage;
