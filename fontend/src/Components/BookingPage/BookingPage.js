import "./bookingPage.css";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Header from "../Header/Header";
import React, { useState } from "react";


const HomePage = () => {
    const [selected, setSelected] = useState(null);

    const handleSelect = (value) => {
        setSelected(value);
    };

    return (
        <main className="room-container">
            <Header background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/homeheader.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21laGVhZGVyLmpwZyIsImlhdCI6MTcyNzYxODE4OSwiZXhwIjoxNzU5MTU0MTg5fQ.QU5J1wJV043dbnA6WzcnrIvAVUFGtf3Xc7QCsdIPvR8&t=2024-09-29T13%3A56%3A29.431Z" title="Room" />
            <div className="room-body">
                <div>
                    <div className="booking-room-name">Room name</div>
                    <div className="booking-img" src="">
                        <div className="booking-room-info">
                            <div className="booking-room-info-content">
                                <h3>content </h3>
                                <p>content</p>
                            </div>
                            <div className="booking-room-info-content">
                                <h3>content </h3>
                                <p>content</p>
                            </div>
                            <div className="booking-room-info-content">
                                <h3>content </h3>
                                <p>content</p>
                            </div>
                            <div className="booking-room-info-content">
                                <h3>content </h3>
                                <p>content</p>
                            </div>
                            <div className="booking-room-info-content">
                                <h3>content </h3>
                                <p>content</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="menu-container">
                        {['Option 1', 'Option 2', 'Option 3'].map((option, index) => (
                            <div
                                key={index}
                                className={`radio-div ${selected === option ? 'selected' : ''}`}
                                onClick={() => handleSelect(option)}
                            >
                            <h1>Menu</h1>
                            <h3>price</h3>
                            <div>
                                <p>foods</p>
                                <p>foods</p>
                                <p>foods</p>
                                <p>foods</p>
                                <p>foods</p>
                            </div>
                                {option}
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    trang trí
                </div>
                <div>
                    đặt phòng
                </div>
            </div>
        </main>
    );
};

export default HomePage;
