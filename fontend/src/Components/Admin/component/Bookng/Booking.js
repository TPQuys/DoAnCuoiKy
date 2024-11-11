import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TableSortLabel, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { deleteBooking, getAllBooking } from "../../../../redux/actions/bookingRequest";
import MenuModal from "./Component.js/MenuModal";
import PaymentModal from "./Component.js/PaymentModal";

const formatDate = (date) => {
    if (date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
};

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
    switch (type) {
        case "WEDDING": return "Đám cưới";
        case "CONFERENCE": return "Hội nghị";
        case "BIRTHDAY": return "Sinh nhật";
        case "OTHER": return "Khác";
        default: return "";
    }
};

const getTime = (time) => {
    switch (time) {
        case "MORNING": return "Buổi sáng";
        case "AFTERNOON": return "Buổi chiều";
        case "ALLDAY": return "Cả ngày";
        default: return "";
    }
};

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



const Bookings = ({ bookings, rooms }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [menu, setMenu] = useState({});
    const [payment, setPayment] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [selectedRoom, setSelectedRoom] = useState("");

    const dispatch = useDispatch();

    const openMenu = (menu) => { setIsMenuOpen(true); setMenu(menu); };
    const closeMenu = () => setIsMenuOpen(false);
    const openPayment = (payment) => { setIsPaymentOpen(true); setPayment(payment); };
    const closePayment = () => setIsPaymentOpen(false);

    const handleDelete = async (bookingID) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa booking này?")) {
            await deleteBooking(dispatch, bookingID);
            getAllBooking(dispatch);
        }
    };

    const sortedBookings = React.useMemo(() => {
        let filteredBookings = bookings;
    
        if (selectedRoom) {
            filteredBookings = filteredBookings.filter(booking => booking.Event.RoomEvent?.RoomName === selectedRoom);
        }
    
        if (sortConfig.key) {
            const sorted = [...filteredBookings].sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];
    
                // Kiểm tra nếu đang sắp xếp theo 'EventDate' hoặc 'BookingTime'
                if (sortConfig.key === 'EventDate') {
                    aValue = new Date(a.Event.EventDate);
                    bValue = new Date(b.Event.EventDate);
                } else if (sortConfig.key === 'BookingTime') {
                    aValue = new Date(a.BookingTime);  // Sử dụng 'BookingTime' ở đây
                    bValue = new Date(b.BookingTime);
                }
    
                return (aValue > bValue ? 1 : -1) * (sortConfig.direction === 'asc' ? 1 : -1);
            });
            return sorted;
        }
        return filteredBookings;
    }, [bookings, sortConfig, selectedRoom]);
    

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    useEffect(() => {
        getAllBooking(dispatch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <TableContainer component={Paper} title="Lịch sử đặt sự kiện">
            <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel id="select-room-label">Chọn nhà hàng</InputLabel>
                <Select
                    labelId="select-room-label"
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    label="Chọn nhà hàng"
                >
                    <MenuItem value="">
                        <em>Tất cả</em>
                    </MenuItem>
                    {rooms.map((room) => (
                        <MenuItem key={room.RoomID} value={room.RoomName}>{room.RoomName}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Table stickyHeader aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <TableSortLabel
                                active={sortConfig.key === 'BookingTime'}
                                direction={sortConfig.direction}
                                onClick={() => requestSort('BookingTime')}
                            >
                                Thời gian đặt
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={sortConfig.key === 'EventType'}
                                direction={sortConfig.direction}
                                onClick={() => requestSort('EventType')}
                            >
                                Loại sự kiện
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>Tổng số bàn</TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={sortConfig.key === 'EventDate'}
                                direction={sortConfig.direction}
                                onClick={() => requestSort('EventDate')}
                            >
                                Tổ chức ngày
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>Thời gian</TableCell>
                        <TableCell>Ghi chú</TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={sortConfig.key === 'RoomName'}
                                direction={sortConfig.direction}
                                onClick={() => requestSort('RoomName')}
                            >
                                Tên nhà hàng
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>Trang trí</TableCell>
                        <TableCell>Menu</TableCell>
                        <TableCell>Phương thức thanh toán</TableCell>
                        <TableCell>Hành động</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedBookings.filter(booking => booking != null).map((booking) => (
                        <TableRow key={booking?.BookingID}>
                            <TableCell>{formatDateTime(new Date(booking.BookingTime))}</TableCell>
                            <TableCell>{booking?.User?.email}</TableCell>
                            <TableCell>{getEventType(booking.Event?.EventType)}</TableCell>
                            <TableCell>{booking.Event?.TotalTable}</TableCell>
                            <TableCell>{formatDate(new Date(booking.Event?.EventDate))}</TableCell>
                            <TableCell>{getTime(booking.Event?.Time)}</TableCell>
                            <TableCell>{booking.Event?.Note || "Không có"}</TableCell>
                            <TableCell>{booking.Event?.RoomEvent?.RoomName}</TableCell>
                            <TableCell>{getDecore(booking.Event?.Decore)}</TableCell>
                            <TableCell>{booking.Event?.Menu?.MenuID && <Button sx={{ padding: 0, margin: 0 }} variant="text" onClick={() => openMenu(booking.Event?.Menu)}>Chi tiết Menu</Button>}</TableCell>
                            <TableCell>
                                {booking.Payment ? (
                                    <Button variant="text" sx={{ padding: 0, margin: 0 }} onClick={() => openPayment(booking?.Payment)}>Chi tiết thanh toán</Button>
                                ) : "Chưa thanh toán"}
                            </TableCell>
                            <TableCell>
                                <Button variant="text" color="error" onClick={() => handleDelete(booking?.BookingID)}>
                                    Xóa
                                </Button>
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
