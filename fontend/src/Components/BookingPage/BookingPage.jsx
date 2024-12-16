import "./bookingPage.css";
import Header from "../Header/Header";
import Form from "./component/BookingForm"
import React, { useRef, useState } from "react";
import { getAvailableRooms } from "../../redux/actions/roomRequest";
import { Button, Card, Grid, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { addEvent } from "../../redux/actions/eventRequest";
import { addBooking } from "../../redux/actions/bookingRequest";
import { PostZaloApi } from "../../redux/actions/paymentRequest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const HomePage = () => {
    const formikRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const user = useSelector((state) => state.auth.login.currentUser);
    const rooms = useSelector((state) => state.rooms?.rooms);
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const [availableRooms, setAvailableRooms] = useState(null)
    const [formData, setFormData] = useState({})

    const handleSubmit = async (values) => {
        if (values?.Time === "CUSTOM" && from === null) {
            toast.error("Hãy chọn thời gian tổ chức")
            return
        }
        const finalData = { ...values, From: from, To: to };
        setFormData(finalData)
        const res = await getAvailableRooms(finalData)
        setAvailableRooms(res)
    }

    const handleBooking = async (room) => {
        navigate('/booking/detail', { state: { formData, room } });
    }

    return (
        <main className="room-container">
            <Header background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/room-header.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9yb29tLWhlYWRlci5qcGciLCJpYXQiOjE3Mjk4NjU2NDQsImV4cCI6MTc2MTQwMTY0NH0.X1m9vEDzQi-PR17kKxJDvoxcfBTjNmimrzGOFC_F6Eg&t=2024-10-25T14%3A14%3A02.614Z" title="ĐẶT CHỖ" />
            <div className="room-body">
                <div className="booking-room-name">Nhập Thông Tin Sự Kiện</div>
                <div className="booking-center">
                    <Form RoomEventID={null} setFrom={setFrom} setTo={setTo} ref={formikRef} handleSubmit={handleSubmit} maxTable={50} />

                    <Grid container sx={{ maxHeight: "700px", overflowY: "auto", minHeight: "600px" }}>
                        {availableRooms?.length > 0 ? (
                            availableRooms.map((item) =>
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
                                                    onClick={() => handleBooking(item)}
                                                    variant="contained"
                                                    sx={{ backgroundColor: '#64463c', color: '#fff', marginTop: '8px' }}
                                                >
                                                    Đặt ngay
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                ) : null
                            )
                        ) : (
                            <Card sx={{ justifyContent: 'center', background: "#f9ecd9", width: "100%" }}>
                                <img
                                    src="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/public/Event/home_decor.jpg"
                                    alt=""
                                    height="600px"
                                    width="1000px"
                                    style={{ backgroundPosition: "auto", borderRadius: 30 }}
                                />
                                <Typography
                                    variant="h4"
                                    sx={{ fontWeight: 600, color: "white", bottom: "300px", position: "relative" }}
                                >
                                    {availableRooms === null
                                        ? "Hãy nhập thông tin để tìm kiếm phòng phù hợp"
                                        : "Rất tiếc hiện không có địa điểm phù hợp với bạn"}
                                </Typography>
                            </Card>
                        )}
                    </Grid>

                </div>
            </div>
        </main>
    );
};

export default HomePage;
