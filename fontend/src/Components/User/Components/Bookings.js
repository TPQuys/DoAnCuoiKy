import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Grid } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { getBookingByUser, deleteBookingUser } from "../../../redux/actions/bookingRequest";
import { addRate } from "../../../redux/actions/rateRequest";
import MenuModal from "./MenuModal";
import PaymentModal from "./PaymentModal";
import AddRatingModal from "./AddRatingModal";
import RateDetailModal from "./RateDetailModal";
import { formatDate, formatDateTime, getDecore, getDecoreType, getEventType, getRangeTime, getTime } from './FormatFunction';
import EditEventModal from "./EditEventModal";
import { Delete, Edit } from "@mui/icons-material";

const Bookings = ({ bookings }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const menus = useSelector((state) => state.menus?.menus);
    const user = useSelector((state) => state.auth.login.currentUser);
    const [modalOpen, setModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [menu, setMenu] = useState({});
    const [payment, setPayment] = useState({});
    const [selectedBooking, setSelectBooking] = useState(null);
    const [rateDetail, setRateDetail] = useState(null); // Dữ liệu chi tiết đánh giá
    const [isRateModalOpen, setIsRateModalOpen] = useState(false); // Trạng thái mở modal chi tiết đánh giá
    const [remainingTimes, setRemainingTimes] = useState({}); // Lưu thời gian còn lại cho mỗi booking
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleClick = (booking) => {
        sessionStorage.setItem("booking", JSON.stringify(booking));
        navigate("/payment");
    };

    const openMenu = (menu) => { setIsMenuOpen(true); setMenu(menu); };
    const closeMenu = () => setIsMenuOpen(false);
    const openPayment = (payment) => { setIsPaymentOpen(true); setPayment(payment); };
    const closePayment = () => setIsPaymentOpen(false);

    const handleDelete = async (bookingID) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa booking này?")) {
            await deleteBookingUser(dispatch, bookingID);
            await getBookingByUser(dispatch);
        }
    };

    const handleOpen = (booking) => {
        setSelectBooking(booking);
        setModalOpen(true);
    };
    const handleClose = () => setModalOpen(false);

    const handleSubmit = async (data) => {
        const res = await addRate(dispatch, data);
        await getBookingByUser(dispatch)
        console.log("Submitted Data:", res.data);
    };

    const openRateDetail = (rate) => {
        setRateDetail(rate);
        setIsRateModalOpen(true);
    };

    const closeRateDetail = () => {
        setRateDetail(null);
        setIsRateModalOpen(false);
    };

    const openEditModal = (event, booking) => {
        setSelectBooking(booking)
        setSelectedEvent(event);
        setIsEditOpen(true);
    };

    const closeEditModal = () => {
        setIsEditOpen(false);
    };


    useEffect(() => {
        const interval = setInterval(() => {
            const newRemainingTimes = {};
            bookings.forEach(booking => {
                // Thời gian kết thúc là 1 ngày sau thời gian BookingTime
                const endTime = new Date(booking.BookingTime).getTime() + 24 * 60 * 60 * 1000;
                const currentTime = new Date().getTime();
                const timeLeft = Math.max(0, Math.floor((endTime - currentTime) / 1000));

                newRemainingTimes[booking.BookingID] = timeLeft > 0
                    ? `${Math.floor(timeLeft / 3600)}:${String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`
                    : 'Lịch đặt đã hết hạn';
            });
            setRemainingTimes(newRemainingTimes);
        }, 1000);

        return () => clearInterval(interval);
    }, [bookings]);


    return (
        <TableContainer component={Paper} title="Lịch sử đặt sự kiện">
            <Table stickyHeader aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Thời gian đặt</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Loại sự kiện</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Tổng số bàn</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Tổ chức ngày</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Thời gian</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Ghi chú</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Tên nhà hàng</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Trang trí</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Menu</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Phương thức thanh toán</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Hành động</TableCell>
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
                                    booking.Event?.Time !== "CUSTOM" ?
                                        getTime(booking.Event?.Time)
                                        : getRangeTime(booking.Event?.From, booking.Event?.To)
                                }</TableCell>
                                <TableCell>{booking.Event?.Note || "Không có"}</TableCell>
                                <TableCell>{booking.Event?.RoomEvent?.RoomName}</TableCell>
                                <TableCell>{getDecore(booking.Event?.Decore)} {getDecore(booking.Event?.Decore) !== "" && getDecoreType(booking.Event?.Decore)}</TableCell>
                                <TableCell>{booking.Event?.Menu?.MenuID && <Button sx={{ padding: 0, margin: 0 }} variant="text" onClick={() => openMenu(booking.Event?.Menu)}>Chi tiết Menu</Button>}</TableCell>
                                <TableCell>
                                    {booking.Payment ?
                                        <Button
                                            color="success"
                                            variant="text"
                                            sx={{ padding: 0, margin: 0 }}
                                            onClick={() => openPayment(booking?.Payment)}
                                        >
                                            Chi tiết thanh toán
                                        </Button>
                                        : remainingTimes[booking.BookingID]?.includes("hết")
                                            ? <Button color="error">{remainingTimes[booking.BookingID]}</Button>
                                            : <Button onClick={() => handleClick(booking)}>Thanh toán ngay ({remainingTimes[booking.BookingID]})</Button>}
                                </TableCell>
                                <TableCell>
                                    {!booking.Payment ?
                                        <Grid textAlign={"center"}>
                                            <IconButton
                                                disabled={booking.Payment}
                                                onClick={() => handleDelete(booking.BookingID)}
                                            >
                                                <Delete color="error" />
                                            </IconButton>
                                            <IconButton
                                                disabled={booking.Payment}
                                                onClick={() => openEditModal(booking.Event, booking)}
                                            >
                                                <Edit color="primary" />
                                            </IconButton>
                                        </Grid> :
                                        booking.Rate ?
                                            <Button variant="text" color="primary" onClick={() => openRateDetail(booking?.Rate)}>Xem đánh giá</Button> :
                                            new Date(booking.Event.EventDate) > new Date() ? "" :
                                                <Button variant="text" color="info" onClick={() => handleOpen(booking)}>Đánh giá</Button>
                                    }

                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            {selectedEvent && (
                <EditEventModal
                    open={isEditOpen}
                    onClose={closeEditModal}
                    menus={menus}
                    eventData={selectedEvent}
                    booking={selectedBooking}
                />
            )}
            <AddRatingModal booking={selectedBooking} open={modalOpen} onClose={handleClose} onSubmit={handleSubmit} user={user} />
            <MenuModal menu={menu} onClose={closeMenu} open={isMenuOpen} />
            <PaymentModal paymentData={payment} onClose={closePayment} open={isPaymentOpen} />
            <RateDetailModal rate={rateDetail} open={isRateModalOpen} onClose={closeRateDetail} />
        </TableContainer>
    );
};

export default Bookings;
