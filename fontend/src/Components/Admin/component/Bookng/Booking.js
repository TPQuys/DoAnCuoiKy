import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TableSortLabel, Select, MenuItem, InputLabel, FormControl, Card, TextField, Grid, IconButton } from '@mui/material';
import { deleteBooking, getAllBooking } from "../../../../redux/actions/bookingRequest";
import MenuModal from "./Component.js/MenuModal";
import PaymentModal from "./Component.js/PaymentModal";
import { Delete, Menu as MenuIcon, Payment as PaymentIcon, Edit } from '@mui/icons-material';  // Import icons
import EditEventModal from "./Component.js/EditEventModal";
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

const getRangeTime = (from, to) => {
    const fromTime = new Date(from).toLocaleTimeString()
    const toTime = new Date(to).toLocaleTimeString()

    return fromTime + "-" + toTime
}

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

const getDecoreType = (decore) => {
    if (decore) {
        if (decore?.DecorePrice?.Type === 'BASIC') {
            return "(Cơ bản)"
        } else if (decore?.DecorePrice?.Type === 'ADVANCED') {
            return "(Nâng cao)"
        } else if (decore?.DecorePrice?.Type === 'PREMIUM') {
            return "(Cao cấp)"
        }
    }
}

const Bookings = ({ bookings, rooms }) => {
    const menus = useSelector((state) => state.menus?.menus);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [menu, setMenu] = useState({});
    const [payment, setPayment] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [selectedRoom, setSelectedRoom] = useState("");
    const [searchQuery, setSearchQuery] = useState("");  // Thêm state cho tìm kiếm
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectBooking, setSelectBooking] = useState(null)

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

    const openEditModal = (event, booking) => {
        setSelectBooking(booking)
        setSelectedEvent(event);
        setIsEditOpen(true);
    };

    const closeEditModal = () => {
        setIsEditOpen(false);
    };

    const sortedBookings = React.useMemo(() => {
        let filteredBookings = bookings;

        // Lọc theo từ khóa tìm kiếm
        if (searchQuery) {
            filteredBookings = filteredBookings.filter(booking =>
                booking.User?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                getEventType(booking.Event?.EventType).toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.Event?.RoomEvent?.RoomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                getDecore(booking.Event?.Decore).toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

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
    }, [bookings, sortConfig, selectedRoom, searchQuery]);  // Thêm searchQuery vào dependencies

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <Card sx={{ p: 3 }}>
            <Grid container spacing={2} marginBottom={2}>
                <Grid item xs={6}>
                    <TextField
                        label="Tìm kiếm"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
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
                </Grid>
            </Grid>

            <TableContainer component={Paper} title="Lịch sử đặt sự kiện" sx={{ maxHeight: '700px', overflowY: 'auto' }}>
                <Table stickyHeader aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>
                                <TableSortLabel
                                    active={sortConfig.key === 'BookingTime'}
                                    direction={sortConfig.direction}
                                    onClick={() => requestSort('BookingTime')}
                                >
                                    Thời gian đặt
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>
                                <TableSortLabel
                                    active={sortConfig.key === 'EventType'}
                                    direction={sortConfig.direction}
                                    onClick={() => requestSort('EventType')}
                                >
                                    Loại sự kiện
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Tổng số bàn</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>
                                <TableSortLabel
                                    active={sortConfig.key === 'EventDate'}
                                    direction={sortConfig.direction}
                                    onClick={() => requestSort('EventDate')}
                                >
                                    Tổ chức ngày
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Thời gian</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Ghi chú</TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'RoomName'}
                                    direction={sortConfig.direction}
                                    onClick={() => requestSort('RoomName')}
                                >
                                    Tên nhà hàng
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Trang trí</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Menu</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Phương thức thanh toán</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Hành động</TableCell>
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
                                <TableCell>{
                                    booking.Event.Time !== "CUSTOM" ?
                                        getTime(booking.Event?.Time)
                                        : getRangeTime(booking.Event?.From, booking.Event?.To)
                                }</TableCell>
                                <TableCell>{booking.Event?.Note || "Không có"}</TableCell>
                                <TableCell>{booking.Event?.RoomEvent?.RoomName}</TableCell>
                                <TableCell>{getDecore(booking.Event?.Decore)} {getDecoreType(booking.Event?.Decore)}</TableCell>
                                <TableCell>{booking.Event?.Menu?.MenuID && <Button sx={{ padding: 0, margin: 0 }} variant="text" onClick={() => openMenu(booking.Event?.Menu)}>Chi tiết Menu</Button>}</TableCell>
                                <TableCell>
                                    {booking.Payment ? (
                                        <Button variant="text" sx={{ padding: 0, margin: 0 }} onClick={() => openPayment(booking?.Payment)}>Chi tiết thanh toán</Button>
                                    ) : "Chưa thanh toán"}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        disabled={booking.Payment}
                                        onClick={() => handleDelete(booking.BookingID)}
                                        sx={{
                                            color: booking.Payment ? 'rgba(255, 0, 0, 0.5)' : 'error.main', // Nhạt màu khi disabled
                                            '&:hover': {
                                                backgroundColor: booking.Payment ? 'transparent' : 'rgba(255, 0, 0, 0.1)', // Giảm độ sáng khi hover trên nút disabled
                                            },
                                        }}
                                    >
                                        <Delete />
                                    </IconButton>
                                    <IconButton
                                        disabled={booking.Payment}
                                        onClick={() => openEditModal(booking.Event, booking)}
                                        sx={{
                                            color: booking.Payment ? 'rgba(0, 0, 255, 0.5)' : 'primary.main', // Nhạt màu khi disabled
                                            '&:hover': {
                                                backgroundColor: booking.Payment ? 'transparent' : 'rgba(0, 0, 255, 0.1)', // Giảm độ sáng khi hover trên nút disabled
                                            },
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {selectedEvent && (
                    <EditEventModal
                        booking={selectBooking}
                        open={isEditOpen}
                        onClose={closeEditModal}
                        menus={menus}
                        eventData={selectedEvent}
                    />
                )}
                <MenuModal menu={menu} onClose={closeMenu} open={isMenuOpen} />
                <PaymentModal paymentData={payment} onClose={closePayment} open={isPaymentOpen} />
            </TableContainer>
        </Card>
    );
};

export default Bookings;
