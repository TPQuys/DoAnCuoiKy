import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { getBookingByUser, deleteBookingUser } from "../../../redux/actions/bookingRequest";
import MenuModal from "./MenuModal";
import PaymentModal from "./PaymentModal";

const formatDate = (date) => {
    if (date) {
        // Lấy ngày, tháng và năm
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // tháng bắt đầu từ 0 nên +1
        const year = date.getFullYear();

        // Định dạng thành dd/mm/yyyy
        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate
    }
}

const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    if (date) {
        return date.toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    }
};

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

const getDecoreType = (decore)=>{
    if(decore){
        if(decore?.DecorePrice?.Type==='BASIC'){
            return "(Cơ bản)"
        }else   if(decore?.DecorePrice?.Type==='ADVANCED'){
            return "(Nâng cao)"
        } else   if(decore?.DecorePrice?.Type==='PREMIUM'){
            return "(Cao cấp)"
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
    const lobby = Decore?.LobbyDecore ? "sảnh" : "";
    const stage = Decore?.StageDecore ? "sân khấu" : "";
    const table = Decore?.TableDecore ? "bàn" : "";

    // Tạo một mảng chỉ chứa các phần tử không rỗng
    const decoreArray = [lobby, stage, table]?.filter(item => item !== "");

    // Chỉ viết hoa chữ cái đầu tiên của phần tử đầu tiên
    if (decoreArray.length > 0) {
        decoreArray[0] = decoreArray[0].charAt(0).toUpperCase() + decoreArray[0].slice(1);
    }

    return decoreArray.join(", ");
};

const Bookings = ({ bookings }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [menu, setMenu] = useState({});
    const [payment, setPayment] = useState({});
    const [remainingTimes, setRemainingTimes] = useState({}); // Lưu thời gian còn lại cho mỗi booking

    const handleClick = (booking) => {
        sessionStorage.setItem("booking", JSON.stringify(booking))
        navigate("/payment")
    }

    const openMenu = (menu) => { setIsMenuOpen(true); setMenu(menu); };
    const closeMenu = () => setIsMenuOpen(false);
    const openPayment = (payment) => { setIsPaymentOpen(true); setPayment(payment); };
    const closePayment = () => setIsPaymentOpen(false);

    const handleDelete = async (bookingID) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa booking này?")) {
            await deleteBookingUser(dispatch, bookingID);
        }
    };

    useEffect(() => {
        if (bookings.length < 1) {
            getBookingByUser(dispatch);
        }

        // Cập nhật thời gian còn lại mỗi giây cho từng booking
        const interval = setInterval(() => {
            const newRemainingTimes = {};
            bookings.forEach(booking => {
                const endTime = new Date(booking.BookingTime).getTime() + 15 * 60 * 1000;
                const currentTime = new Date().getTime();
                const timeLeft = Math.max(0, Math.floor((endTime - currentTime) / 1000));
                newRemainingTimes[booking.BookingID] = timeLeft > 0 ? `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}` : 'Lịch đặt đã hết hạn';
            });
            setRemainingTimes(newRemainingTimes);
        }, 1000);

        return () => clearInterval(interval); // Dọn dẹp interval khi component bị huỷ
    }, [bookings]);

    return (
        <TableContainer component={Paper} title="Lịch sử đặt sự kiện">
            <Table stickyHeader aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Thời gian đặt</TableCell>
                        <TableCell>Loại sự kiện</TableCell>
                        <TableCell>Tổng số bàn</TableCell>
                        <TableCell>Tổ chức ngày</TableCell>
                        <TableCell>Thời gian</TableCell>
                        <TableCell>Ghi chú</TableCell>
                        <TableCell>Tên nhà hàng</TableCell>
                        <TableCell>Trang trí</TableCell>
                        <TableCell>Menu</TableCell>
                        <TableCell>Phương thức thanh toán</TableCell>
                        <TableCell>Hành động</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bookings
                    ?.filter(booking => booking != null)
                    ?.sort((a, b) => new Date(b.BookingTime) - new Date(a.BookingTime))
                    .map((booking) => (
                        <TableRow key={booking?.BookingID}>
                            <TableCell>{formatDateTime(new Date(booking.BookingTime))}</TableCell>
                            <TableCell>{getEventType(booking.Event?.EventType)}</TableCell>
                            <TableCell>{booking.Event?.TotalTable}</TableCell>
                            <TableCell>{formatDate(new Date(booking.Event?.EventDate))}</TableCell>
                            <TableCell>{getTime(booking.Event?.Time)}</TableCell>
                            <TableCell>{booking.Event?.Note || "Không có"}</TableCell>
                            <TableCell>{booking.Event?.RoomEvent?.RoomName}</TableCell>
                        <TableCell>{getDecore(booking.Event?.Decore)} {getDecoreType(booking.Event?.Decore)}</TableCell>
                            <TableCell>{booking.Event?.Menu?.MenuID && <Button sx={{ padding: 0, margin: 0 }} variant="text" onClick={() => openMenu(booking.Event?.Menu)}>Chi tiết Menu</Button>}</TableCell>
                            <TableCell>
                                {booking.Payment ?
                                    <Button color="success" variant="text" sx={{ padding: 0, margin: 0 }} onClick={() => openPayment(booking?.Payment)}>Chi tiết thanh toán</Button>
                                    : remainingTimes[booking.BookingID]?.includes("hết") 
                                    ? <Button color="error">{remainingTimes[booking.BookingID]}</Button> 
                                    : <Button onClick={() => handleClick(booking)}>Thanh toán ngay ({remainingTimes[booking.BookingID]})</Button>}
                            </TableCell>
                            <TableCell>
                                {!booking.Payment &&
                                    <Button variant="text" color="error" onClick={() => handleDelete(booking?.BookingID)}>
                                        Xóa
                                    </Button>}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <MenuModal menu={menu} onClose={closeMenu} open={isMenuOpen} />
            <PaymentModal paymentData={payment} onClose={closePayment} open={isPaymentOpen} />
        </TableContainer>
    );
};

export default Bookings;
