import React, { useEffect, useState } from 'react';
import { Paper, Typography, Grid, Box, Card, Link, Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import MenuSelect from './component/MenuSelect'
import CreateMenuModal from './component/ModalMenu'
import DecoreSelection from './component/DecoreSelection'
import { addDecore } from '../../redux/actions/decoreRequest';
import { PostZaloApi } from '../../redux/actions/paymentRequest';
import { addEvent } from '../../redux/actions/eventRequest';
import { addBooking } from '../../redux/actions/bookingRequest';
import { useNavigate } from "react-router-dom";
// Tạo một component Paper có nền trong suốt
const TransparentPaper = styled(Paper)({
    padding: 16,
    backgroundColor: 'transparent',
    boxShadow: 'none',
});

const EventDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const menus = useSelector((state) => state.menus?.menus);
    const caution = useSelector((state) => state.requireDay?.numberDay?.Caution) || ''
    const user = useSelector((state) => state.auth.login.currentUser);
    const deocrePrice = useSelector((state) => state.roomPrices?.roomPrices)
    const [selectedPrice, setSelectedPrice] = useState()
    const { formData, room } = location.state || {};
    const [selected, setSelected] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [note, setNote] = useState(formData?.Note||'')
    const [Decore, setDecore] = useState({
        LobbyDecore: true,
        StageDecore: true,
        TableDecore: true,
    });

    const { EventType, From, To, EventDate, Time, TotalTable, SelectedTimes } = formData || {};


    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    useEffect(() => {
        setSelectedPrice(deocrePrice[0])
    }, [deocrePrice])

    const handleSelect = (value) => {
        setSelected((prevSelected) => (prevSelected === value ? null : value));
    };

    function convertToArray(text) {
        const result =  text.split('/').filter(item => item.trim() !== '');
        console.log(result)
        return result
    }

    const handleBooking = async () => {
        console.log(new Date(EventDate.$d))
        setIsDisabled(true);
        if (formData) {
            const decore = await addDecore(dispatch, { ...Decore, DecorePriceID: selectedPrice.DecorePriceID })
            // Lấy thông tin menu đã chọn
            const selectedMenu = menus.find(menu => menu.MenuID === selected);
            const foodTotalPrice = selectedMenu?.Food.reduce((total, food) => {
                return total + (food.UnitPrice * food.MenuFoods.Quantity);
            }, 0);

            const drinksTotalPrice = selectedMenu?.Drinks.reduce((total, drink) => {
                return total + (drink.UnitPrice * drink.MenuDrinks.Quantity);
            }, 0);

            const totalMenuPrice = foodTotalPrice + drinksTotalPrice;
            // Tạo eventData với thông tin từ form và menu đã chọn
            const eventData = {
                ...formData,
                RoomEventID: room.RoomEventID,
                MenuID: selected,
                DecoreID: decore.DecoreID,
                EventType: formData.EventType,
                TotalPrice: totalMenuPrice,
                EventDate: new Date(EventDate.$d),
                Note: note,
                // EventDate: dayjs(EventDate).toDate(),
                From: From !== "Invalid Date" ? new Date(From) : null,
                To: To !== "Invalid Date" ? new Date(To) : null
            };
            try {
                const newEvent = await addEvent(dispatch, eventData);
                if (newEvent && user) {
                    console.log(newEvent)
                    const newBooking = await addBooking(dispatch,
                        {
                            EventID: newEvent.EventID,
                            UserID: user.user.id,
                            BookingTime: new Date()
                        }
                    )
                    if (newBooking) {
                        console.log(newBooking)
                        const zaloApi = await PostZaloApi(dispatch, newBooking)
                        sessionStorage.setItem("booking", JSON.stringify(newBooking))
                        navigate('/payment')
                    }
                }
                else {
                    console.log("invaid user")
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        setIsDisabled(false);
    };

    //

    if (!formData) {
        return (
            <Typography variant="h6" color="textSecondary">
                Không có sự kiện nào được đặt.
            </Typography>
        );
    }

    return (
        <main className="room-container">
            <Header
                background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/room-header.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9yb29tLWhlYWRlci5qcGciLCJpYXQiOjE3Mjk4NjU2NDQsImV4cCI6MTc2MTQwMTY0NH0.X1m9vEDzQi-PR17kKxJDvoxcfBTjNmimrzGOFC_F6Eg&t=2024-10-25T14%3A14%3A02.614Z"
                title="ĐẶT CHỖ"
            />
            <div className="room-body">
                <div className="booking-room-name">Chi tiết sự kiện đã đặt</div>
                <div className="booking-center">
                    <TransparentPaper>
                        <Grid container spacing={3}>
                            <Grid item xs={9} >
                                <Card sx={{ marginBottom: 3 }}>
                                    <Grid container m={3}>
                                        <Grid item xs={4} alignContent='center'>
                                            <img
                                                src={room.RoomImage}
                                                alt="room"
                                                style={{ width: "100%", borderRadius: "8px" }}
                                            />
                                        </Grid>
                                        {/* Thông tin bên phải */}
                                        <Grid item xs={8} justifyItems='left' pl={4}>
                                            <Typography variant="h6" gutterBottom>
                                                <Link to={`/`} className="room-content-title" style={{ textDecoration: 'none', color: '#64463c' }}>
                                                    {room.RoomName}
                                                </Link>
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Kích thước:</strong> Chiều dài: {room.HeightRoom}m, Chiều rộng: {room.WidthRoom}m
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Sức chứa:</strong> Số người: {room.Capacity}, Số bàn tối đa: {room.MaxTable}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                component="div"
                                                gutterBottom
                                                align="left"
                                                style={{ textAlign: 'left', maxWidth: "90%" }}
                                            >
                                                <strong>Mô tả:</strong> {room.Description}
                                            </Typography>
                                            <Typography style={{
                                                position: 'relative',
                                                borderRadius: '4px',
                                                fontWeight: 'bold',
                                            }} variant="h5" gutterBottom>
                                                <strong>Giá: </strong> {room.Price.toLocaleString()} VND
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Card>
                                <Card sx={{ p: 3 }}>
                                    <Typography variant="h5" gutterBottom>
                                        Menu
                                    </Typography>
                                    <MenuSelect menus={menus} handleSelect={handleSelect} selected={selected} />
                                    <Button
                                        variant="text"
                                        sx={{ fontWeight: 600, color: "#64463c", textDecoration: "underline" }}
                                        onClick={handleOpenModal}
                                    >
                                        Tự chọn menu
                                    </Button>
                                </Card>
                                <Card sx={{ p: 3 }}>
                                    <Typography variant="h5" gutterBottom>
                                        Trang trí
                                    </Typography>
                                    <DecoreSelection
                                        price={deocrePrice}
                                        Decore={Decore}
                                        onDecoreChange={(name, value) => setDecore({ ...Decore, [name]: value })}
                                        setSelectedPrice={setSelectedPrice}
                                        selectedPrice={selectedPrice}
                                    />
                                </Card>
                            </Grid>
                            <Grid item xs={3}>
                                <Card
                                    style={{
                                        width: 'auto',
                                        maxWidth: 'fit-content',
                                        padding: '16px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                        marginBottom: '30px'
                                    }}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Typography textAlign={'left'} variant="subtitle1">Loại sự kiện: {EventType}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography textAlign={'left'} variant="subtitle1">Ngày: {EventDate ? new Date(EventDate.$d).toLocaleDateString() : 'N/A'}</Typography>

                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography textAlign={'left'} variant="subtitle1">Thời gian:     {Time === 'CUSTOM'
                                                ? SelectedTimes?.join(', ') || `${new Date(From).toLocaleTimeString()} - ${new Date(To).toLocaleTimeString()}`
                                                : Time === 'MORNING'
                                                    ? 'Buổi sáng (8:00-14:00)'
                                                    : Time === 'AFTERNOON'
                                                        ? 'Buổi chiều (16:00-23:00)'
                                                        : 'Cả ngày'}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography textAlign={'left'} variant="subtitle1">Tổng số bàn: {TotalTable}</Typography>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                value={note}
                                                name="Note"
                                                label="Ghi chú"
                                                fullWidth
                                                multiline
                                                rows={4}
                                                onChange={(e) => setNote(e.target.value)} // Truy cập giá trị từ event
                                            />

                                        </Grid>

                                    </Grid>
                                </Card>
                                <Card
                                    style={{
                                        padding: '16px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                        marginBottom: '30px'
                                    }}
                                >
                                    <Typography variant="h5" fontWeight={600} m={1}>Lưu ý</Typography>
                                    {convertToArray(caution)?.map((item) => (
                                        <Typography textAlign='left' m={2}>{item}</Typography>
                                    ))}
                                </Card>
                                <Card
                                    style={{
                                        padding: '16px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                        marginBottom: '30px'
                                    }}
                                >
                                    <Button
                                        onClick={handleBooking}
                                        disabled={isDisabled}
                                        variant='contained'
                                        color='primary'
                                        fullWidth
                                    >
                                        Đặt ngay
                                    </Button>
                                </Card>
                            </Grid>
                        </Grid>
                    </TransparentPaper>
                </div>
            </div>
            <CreateMenuModal open={openModal} handleClose={handleCloseModal} setSelected={setSelected} />
        </main>
    );
};

export default EventDetails;
