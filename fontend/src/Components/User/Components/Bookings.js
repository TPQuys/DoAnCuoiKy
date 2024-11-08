import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { getBookingByUser } from "../../../redux/actions/bookingRequest";

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
        } else if (type === "ORTHER") {
            return "Khác"
        }
    }
}

const getTime = (time) => {
    if (time) {
        if (time === "MORNING") {
            return "Buổi sáng"
        }
        if (time === "AFTERNOON") {
            return "Buổi chiều"
        }
        if (time === "ALLDAY") {
            return "Cả ngày"
        }
    }
}

const getDecore = (Decore) => {
    const lobby = Decore.LobbyDecore ? "sảnh" : "";
    const stage = Decore.StageDecore ? "sân khấu" : "";
    const table = Decore.TableDecore ? "bàn" : "";

    const decoreArray = [lobby, stage, table].filter(item => item !== "");

    const formattedDecoreArray = decoreArray.map(item => item.charAt(0).toUpperCase() + item.slice(1));

    return formattedDecoreArray.join(", ");
};

const Bookings = ({ bookings }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const handleClick = (booking) => {
        sessionStorage.setItem("booking", JSON.stringify(booking))
        navigate("/payment")
    }
    useEffect(() => {
        if (bookings.length < 1)
            getBookingByUser(dispatch)
    }, [bookings.length, dispatch])
    return (
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
                    {bookings?.filter(booking => booking != null).map((booking) => (
                        <TableRow key={booking?.BookingID}>
                            <TableCell>{getEventType(booking.Event?.EventType)}</TableCell>
                            <TableCell>{booking.Event?.TotalTable}</TableCell>
                            <TableCell>{formatDate(new Date(booking.Event?.EventDate))}</TableCell>
                            <TableCell>{getTime(booking.Event?.Time)}</TableCell>
                            <TableCell>{booking.Event?.Note || "Không có"}</TableCell>
                            <TableCell>{booking.Event?.RoomEvent?.RoomName}</TableCell>
                            <TableCell>
                                {booking.Payment ? (
                                    booking.Payment.PaymentMethod
                                ) : (
                                    <Button onClick={() => handleClick(booking)}>Thanh toán ngay</Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </TableContainer>
    );
};

export default Bookings;
