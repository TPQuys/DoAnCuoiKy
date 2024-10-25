import React, { useEffect, useState } from "react";
import Header from '../Header/Header';
import { useSelector } from "react-redux";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";

const formatDate = (date) => {
    if (date) {
        // Lấy ngày, tháng và năm
        const day = String(date.getDate()).padStart(2, '0'); // thêm '0' nếu nhỏ hơn 10
        const month = String(date.getMonth() + 1).padStart(2, '0'); // tháng bắt đầu từ 0 nên +1
        const year = date.getFullYear();

        // Định dạng thành dd/mm/yyyy
        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate
    }
}

const getEventType = (type) => {
    if (type) {
        if (type === "WEDDING") {
            return "Đám cưới"
        } else if (type === "CONFERENCE") {
            return "Hội nghị"
        } else if (type === "BIRTHDAY") {
            return "Sinh nhật"
        } else if (type === "ORDER") {
            return "Khác"
        }
    }
}

const getTime = (time) => {
    if (time) {
        if (time = "MORNING") {
            return "Buổi sáng"
        }
        if (time = "AFTERNOON") {
            return "Buổi chiều"
        }
        if (time = "ALLDAY") {
            return "Cả ngày"
        }
    }
}

const UserPage = () => {
    const bookings = useSelector((state) => state.bookings?.bookings)
    const navigate = useNavigate();
    const handleClick = (booking) => {
        sessionStorage.setItem("booking",JSON.stringify(booking))
        navigate("/payment")
    }

    return (
        <main className='room-container'>
            <Header background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/homeheader.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21laGVhZGVyLmpwZyIsImlhdCI6MTcyNzYxODE4OSwiZXhwIjoxNzU5MTU0MTg5fQ.QU5J1wJV043dbnA6WzcnrIvAVUFGtf3Xc7QCsdIPvR8&t=2024-09-29T13%3A56%3A29.431Z" title="NGƯỜI DÙNG" />
            <div className="payment-body">
                <TableContainer component={Paper} title="Lịch sử đặt sự kiện">
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Loại sự kiện</TableCell>
                                <TableCell>Tổng số bàn</TableCell>
                                <TableCell>Tổ chức ngày</TableCell>
                                <TableCell>Thời gian</TableCell>
                                <TableCell>Ghi chú</TableCell>
                                <TableCell>Tên nhà hàng</TableCell>
                                <TableCell>Phương thức thanh toán</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bookings.map((booking) => (
                                <TableRow key={booking.BookingID}>
                                    <TableCell>{getEventType(booking.Event.EventType)}</TableCell>
                                    <TableCell>{booking.Event.TotalTable}</TableCell> {/* Tổng số bàn */}
                                    <TableCell>{formatDate(new Date(booking.Event.EventDate))}</TableCell> {/* Tổ chức ngày */}
                                    <TableCell>{getTime(booking.Event.Time)}</TableCell> {/* Thời gian */}
                                    <TableCell>{booking.Event.Note}</TableCell> {/* Thời gian */}
                                    <TableCell>{booking.Event.RoomEvent.RoomName}</TableCell> {/* Tên nhà hàng */}
                                    <TableCell>{booking.Payment ? booking.Payment.PaymentMethod :
                                       <Button onClick={()=>(handleClick(booking))}>Thanh toán ngay</Button>
                                    }</TableCell> {/* Thành tiền */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>


            </div>
        </main>

    );
};

export default UserPage;
