import "./room.css";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Header from "../Header/Header";
import React from "react";
import { useSelector } from "react-redux";


const RoomPage = () => {
    const rooms = useSelector((state) => state.rooms?.rooms);

    return (
        <main className="room-container">
            <Header background="https://www.forumhotelcharlottesville.com/images/1700-960/washington-5-e923ac60.jpg" title="Room" />
            <div className="room-body">
                {rooms.map((item) => (
                    <div className="room-content-box" key={item.RoomEventID}>
                        <div className="room-content-center">
                            <div className="room-text-box">
                                <Link className="room-content-title">{item.RoomName} </Link>
                                <div className="room-content-table">
                                    <div className="room-content-row">
                                        <span className="room-content-text">Chiều dài: {item.HeightRoom}</span>
                                        <span className="room-content-text">Chiều rộng: {item.WidthRoom}</span>
                                    </div>
                                    <div className="room-content-row">
                                        <span className="room-content-text">Số người: {item.Capacity}</span>
                                        <span className="room-content-text">Số bàn tối đa: {item.MaxTable}</span>
                                    </div>
                                </div>
                                <p className="room-content-text">{item.Description}</p>
                                <Button
                                    component={Link}
                                    to="/booking"
                                    variant="contained"
                                    sx={{ backgroundColor: '#64463c', color: '#fff', margin:"auto" }}
                                >
                                    Đặt ngay
                                </Button>
                            </div>
                            <img src="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/home_lobby.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21lX2xvYmJ5LmpwZWciLCJpYXQiOjE3Mjc4OTE0NTYsImV4cCI6MTc1OTQyNzQ1Nn0.k-RnOmYq9JeJSMToDeYN-ztbswvpWrf__GYNe35hDA0&t=2024-10-02T17%3A50%3A55.704Z" className="room-content-img" alt="img1" />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default RoomPage;
