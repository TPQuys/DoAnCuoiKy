import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { getBookingByUser, deleteBookingUser } from "../../../redux/actions/bookingRequest";
import MenuModal from "./MenuModal";
import PaymentModal from "./PaymentModal";
import AddRatingModal from "./AddRatingModal";
import {formatDate, formatDateTime, getDecore, getDecoreType, getEventType, getRangeTime, getTime} from './FormatFunction'


const Bookings = ({ bookings }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [modalOpen, setModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [menu, setMenu] = useState({});
    const [payment, setPayment] = useState({});
    const [selectedBooking,setSelectBooking] = useState(null);
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
            await getBookingByUser(dispatch)
        }
    };

    const handleOpen = (bookingID) => {
        console.log(bookingID)
        setSelectBooking(bookingID)
        setModalOpen(true);
    }
    const handleClose = () => setModalOpen(false);
  
    const handleSubmit = (data) => {
      console.log("Submitted Data:", data);
      // Xử lý gửi dữ liệu lên server
    };

    useEffect(() => {
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
                            <TableCell>{
                            booking.Event.Time!=="CUSTOM"?
                            getTime(booking.Event?.Time)
                            :getRangeTime(booking.Event?.From,booking.Event?.To)
                            }</TableCell>
                            <TableCell>{booking.Event?.Note || "Không có"}</TableCell>
                            <TableCell>{booking.Event?.RoomEvent?.RoomName}</TableCell>
                        <TableCell>{getDecore(booking.Event?.Decore)} {getDecore(booking.Event?.Decore)!==""&&getDecoreType(booking.Event?.Decore)}</TableCell>
                            <TableCell>{booking.Event?.Menu?.MenuID && <Button sx={{ padding: 0, margin: 0 }} variant="text" onClick={() => openMenu(booking.Event?.Menu)}>Chi tiết Menu</Button>}</TableCell>
                            <TableCell>
                                {booking.Payment ?
                                    <Button color="success" variant="text" sx={{ padding: 0, margin: 0 }} onClick={() => openPayment(booking?.Payment)}>Chi tiết thanh toán</Button>
                                    : remainingTimes[booking.BookingID]?.includes("hết") 
                                    ? <Button color="error">{remainingTimes[booking.BookingID]}</Button> 
                                    : <Button onClick={() => handleClick(booking)}>Thanh toán ngay ({remainingTimes[booking.BookingID]})</Button>}
                            </TableCell>
                            <TableCell>
                                {!booking.Payment ?
                                    <Button variant="text" color="error" onClick={() => handleDelete(booking?.BookingID)}>
                                        Xóa
                                    </Button>:
                                    <Button variant="text" color="info" onClick={()=>handleOpen(booking?.BookingID)}>Add Rating</Button>
                                    }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <AddRatingModal booking={selectedBooking} open={modalOpen} onClose={handleClose} onSubmit={handleSubmit} />
            <MenuModal menu={menu} onClose={closeMenu} open={isMenuOpen} />
            <PaymentModal paymentData={payment} onClose={closePayment} open={isPaymentOpen} />
        </TableContainer>
    );
};

export default Bookings;
