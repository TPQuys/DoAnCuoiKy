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
            <Header background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/room-header.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9yb29tLWhlYWRlci5qcGciLCJpYXQiOjE3Mjk4NjU2NDQsImV4cCI6MTc2MTQwMTY0NH0.X1m9vEDzQi-PR17kKxJDvoxcfBTjNmimrzGOFC_F6Eg&t=2024-10-25T14%3A14%3A02.614Z" title="NHÀ HÀNG" />
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
                                    to={`/booking/${item.RoomEventID}`} 
                                    variant="contained"
                                    sx={{ backgroundColor: '#64463c', color: '#fff', margin:"auto" }}
                                >
                                    Đặt ngay
                                </Button>
                            </div>
                            <img src={item.RoomImage} className="room-content-img" alt="img1" />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default RoomPage;
