import "./room.css";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Header from "../Header/Header";
import React from "react";
import { useSelector } from "react-redux";
import { Card, Grid, Typography } from "@mui/material";


const RoomPage = () => {
    const rooms = useSelector((state) => state.rooms?.rooms);

    return (
        <main className="room-container">
            <Header background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/room-header.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9yb29tLWhlYWRlci5qcGciLCJpYXQiOjE3Mjk4NjU2NDQsImV4cCI6MTc2MTQwMTY0NH0.X1m9vEDzQi-PR17kKxJDvoxcfBTjNmimrzGOFC_F6Eg&t=2024-10-25T14%3A14%3A02.614Z" title="NHÀ HÀNG" />
            <div className="room-body">
                {rooms.map((item) =>
                    item.Status === "OPEN" ? (
                        <Card sx={{ p: 3, width: "100%", }}>
                            <Grid container key={item.RoomEventID} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                                {/* Hình ảnh bên trái */}
                                <Grid item xs={3} alignContent='center'>
                                    <img
                                        src={item.RoomImage}
                                        alt="room"
                                        style={{ width: "100%", borderRadius: "8px" }}
                                    />
                                </Grid>
                                {/* Thông tin bên phải */}
                                <Grid item xs={7} justifyItems='left' pl={4}>
                                    <Typography variant="h6" gutterBottom>
                                        <Link to={`/`} className="room-content-title" style={{ textDecoration: 'none', color: '#64463c' }}>
                                            {item.RoomName}
                                        </Link>
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        <strong>Kích thước:</strong> Chiều dài: {item.HeightRoom}m, Chiều rộng: {item.WidthRoom}m
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        <strong>Sức chứa:</strong> Số người: {item.Capacity}, Số bàn tối đa: {item.MaxTable}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        component="div"
                                        gutterBottom
                                        align="left"
                                        style={{ textAlign: 'left' }}
                                    >
                                        <strong>Mô tả:</strong> {item.Description}
                                    </Typography>

                                </Grid>
                                <Grid item xs={2} justifyItems='center' alignContent='center' >
                                    <Typography variant="h5">
                                        Giá {item.Price.toLocaleString()} VND
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        sx={{ backgroundColor: '#64463c', color: '#fff', marginTop: '8px' }}
                                    >
                                        Chi tiết
                                    </Button>
                                </Grid>
                            </Grid>
                        </Card>
                    ) : null
                )}
            </div>
        </main>
    );
};

export default RoomPage;
