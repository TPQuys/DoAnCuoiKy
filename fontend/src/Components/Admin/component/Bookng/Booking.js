import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TableSortLabel, Select, MenuItem, InputLabel, FormControl, Card, TextField, Grid, IconButton, InputAdornment } from '@mui/material';
import { deleteBooking, getAllBooking } from "../../../../redux/actions/bookingRequest";
import MenuModal from "./Component.js/MenuModal";
import PaymentModal from "./Component.js/PaymentModal";
import { Delete, Menu as MenuIcon, Payment as PaymentIcon, Edit, Height } from '@mui/icons-material';  // Import icons
import EditEventModal from "./Component.js/EditEventModal";
import SearchIcon from '@mui/icons-material/Search';
import { exportToExcel } from './Component.js/exportBooking'
import {formatDate,formatDateTime,getDecore,getDecoreType,getEventType,getRangeTime,getTime} from './Component.js/FormatFunction'
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
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");

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

        // Lọc theo phòng
        if (selectedRoom) {
            filteredBookings = filteredBookings.filter(booking => booking.Event.RoomEvent?.RoomName === selectedRoom);
        }

        // Lọc theo tháng
        if (selectedMonth) {
            filteredBookings = filteredBookings.filter(booking => {
                const bookingMonth = new Date(booking.BookingTime).getMonth() + 1;
                return bookingMonth === parseInt(selectedMonth);
            });
        }

        // Lọc theo năm
        if (selectedYear) {
            filteredBookings = filteredBookings.filter(booking => {
                const bookingYear = new Date(booking.BookingTime).getFullYear();
                return bookingYear === parseInt(selectedYear);
            });
        }

        // Sắp xếp nếu cần
        if (sortConfig.key) {
            const sorted = [...filteredBookings].sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (sortConfig.key === 'EventDate') {
                    aValue = new Date(a.Event.EventDate);
                    bValue = new Date(b.Event.EventDate);
                } else if (sortConfig.key === 'BookingTime') {
                    aValue = new Date(a.BookingTime);
                    bValue = new Date(b.BookingTime);
                }

                return (aValue > bValue ? 1 : -1) * (sortConfig.direction === 'asc' ? 1 : -1);
            });
            return sorted;
        }

        return filteredBookings;
    }, [bookings, sortConfig, selectedRoom, searchQuery, selectedMonth, selectedYear]);  // Thêm selectedMonth và selectedYear

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <Card sx={{ p: 3 }}>
            <Grid container spacing={3} justifyContent={"space-around"} marginBottom={3}>
                <Grid item xs={12}>
                    <TextField
                        label="Tìm kiếm"
                        variant="outlined"
                        margin="normal"
                        value={searchQuery}
                        fullWidth
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            marginBottom: 0,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px', // Tăng border-radius
                                height: '45px', // Giảm chiều cao
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: '0.875rem', // Giảm kích thước label
                            },
                        }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <FormControl
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        sx={{
                            marginTop: 0,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px', // Tăng border-radius
                                height: '45px', // Giảm chiều cao
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: '0.875rem', // Giảm kích thước label
                            },
                        }}
                    >
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
                <Grid item xs={4}>
                    <FormControl
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        sx={{
                            marginTop: 0,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                height: '45px',
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: '0.875rem',
                            },
                        }}
                    >
                        <InputLabel id="select-month-label">Chọn tháng</InputLabel>
                        <Select
                            labelId="select-month-label"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            label="Chọn tháng"
                        >
                            <MenuItem value="">
                                <em>Tất cả</em>
                            </MenuItem>
                            {[...Array(12)].map((_, i) => (
                                <MenuItem key={i + 1} value={i + 1}>
                                    {`Tháng ${i + 1}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        sx={{
                            marginTop: 0,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                height: '45px',
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: '0.875rem',
                            },
                        }}
                    >
                        <InputLabel id="select-year-label">Chọn năm</InputLabel>
                        <Select
                            labelId="select-year-label"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            label="Chọn năm"
                        >
                            <MenuItem value="">
                                <em>Tất cả</em>
                            </MenuItem>
                            {[2023, 2024, 2025].map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => exportToExcel(bookings)}
                    sx={{ marginBottom: 3 }}
                >
                    Xuất Excel
                </Button>

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
