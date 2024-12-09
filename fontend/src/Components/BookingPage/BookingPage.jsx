import "./bookingPage.css";
import { Link, useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import Header from "../Header/Header";
import Form from "./component/BookingForm"
import DecoreSelection from "./component/DecoreSelection";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, Checkbox, FormControlLabel, FormGroup, Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch
import { addEvent } from "../../redux/actions/eventRequest"; // Import hàm thêm sự kiện từ API
import { toast } from "react-toastify";

import { addBooking } from "../../redux/actions/bookingRequest";
import { addDecore } from "../../redux/actions/decoreRequest";
import { PostZaloApi } from "../../redux/actions/paymentRequest";

import CreateMenuModal from "./component/ModalMenu";
const HomePage = () => {
    const [selected, setSelected] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false)
    const [Decore, setDecore] = useState({
        LobbyDecore: true,
        StageDecore: true,
        TableDecore: true,
    });
    const [openModal, setOpenModal] = useState(false);
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const formikRef = useRef(null);
    const { roomId } = useParams();
    const dispatch = useDispatch();
    const menus = useSelector((state) => state.menus?.menus);
    const rooms = useSelector((state) => state.rooms?.rooms)
    const room = rooms.find(item => item.RoomEventID === roomId)
    const user = useSelector((state) => state.auth.login.currentUser);
    const deocrePrice = useSelector((state) => state.roomPrices?.roomPrices)
    const [selectedPrice, setSelectedPrice] = useState()

    useEffect(() => {
        if(room?.MaxTable<5){
            setDecore({
                LobbyDecore: false,
                StageDecore: false,
                TableDecore: false,
            })
        }
        setSelectedPrice(deocrePrice[0])
    }, [deocrePrice])

    const handleSubmit = (values) => {
    }
    const handleSubmitHomePage = async () => {
        setIsDisabled(true);
        if (formikRef.current) {
            const formik = formikRef.current;

            // Kiểm tra form có hợp lệ không
            const isValid = await formik.validateForm();
            formik.setTouched({
                EventType: true,
                TotalTable: true,
                EventDate: true,
                Time: true,
                Note: true,
            });

            const decore = await addDecore(dispatch, { ...Decore, DecorePriceID: selectedPrice.DecorePriceID })

            if (isValid && Object.keys(isValid).length === 0) {
                const formValues = formik.values;

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
                    RoomEventID: roomId,
                    MenuID: selected,
                    DecoreID: decore.DecoreID,
                    EventType: formValues.EventType,
                    TotalTable: room.MaxTable>5?formValues.TotalTable:1,
                    EventDate: formValues.EventDate,
                    Time: room.MaxTable>5?formValues.Time:"CUSTOM",
                    From:from,
                    To:to,
                    TotalPrice: totalMenuPrice,
                    Note: formValues.Note
                    // Thêm thông tin giá tổng
                    // Thêm các trường khác nếu cần
                };

                try {
                    const newEvent = await addEvent(dispatch, eventData);
                    if (newEvent && user) {
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
                            setBookingSuccess(true)
                            sessionStorage.setItem("booking", JSON.stringify(newBooking))
                        }
                    }
                    else {
                        console.log("invaid user")
                    }
                } catch (error) {
                    console.log(error.message);
                }
            } else {
                toast.info("Form không hợp lệ:", isValid);
            }
        }
        setIsDisabled(false);
    };

    const handleSelect = (value) => {
        setSelected(value);
    };

    return (
        <main className="room-container">
            <Header background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/room-header.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9yb29tLWhlYWRlci5qcGciLCJpYXQiOjE3Mjk4NjU2NDQsImV4cCI6MTc2MTQwMTY0NH0.X1m9vEDzQi-PR17kKxJDvoxcfBTjNmimrzGOFC_F6Eg&t=2024-10-25T14%3A14%3A02.614Z" title="ĐẶT CHỖ" />
            <div className="room-body">
                <div>
                    <div className="booking-room-name">{room?.RoomName}</div>
                    <div className="booking-img" style={{
                        backgroundImage: `url(${room?.RoomImage})`,
                    }}>
                        <div className="booking-room-info">
                            <div className="booking-room-info-content">
                                <h6>Chiều dài</h6>
                                <h5>{room?.HeightRoom}</h5>
                            </div>
                            <div className="booking-room-info-content">
                                <h6>Chiều rộng</h6>
                                <h5>{room?.WidthRoom}</h5>
                            </div>
                            <div className="booking-room-info-content">
                                <h6>Số bàn</h6>
                                <h5>{room?.MaxTable}</h5>
                            </div>
                            <div className="booking-room-info-content">
                                <h6>Giá</h6>
                                <h5>{room?.Price}</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="booking-room-name">Nhập Thông Tin Sự Kiện</div>
                <div className="booking-center">
                    <Form RoomEventID={roomId} setFrom={setFrom} setTo={setTo} ref={formikRef} handleSubmit={handleSubmit} maxTable={room?.MaxTable} />
                </div>
                {room?.MaxTable > 5 &&

                    <div>
                        <div className="booking-room-name">Chọn Menu</div>

                        <div className="booking-center">
                            <div className="menu-container">
                                <Grid container spacing={3} justifyContent='center'>
                                    {menus
                                        .filter((item) => item.Name !== null)
                                        .map((menu, index) => {
                                            const foodTotalPrice = menu.Food?.reduce((total, food) => {
                                                return total + (food.UnitPrice * 1);
                                                {/* return total + (food.UnitPrice * food.MenuFoods.Quantity); */ }
                                            }, 0);

                                            const drinksTotalPrice = menu.Drinks?.reduce((total, drink) => {
                                                return total + (drink.UnitPrice * 1);
                                                {/* return total + (drink.UnitPrice * drink.MenuDrinks.Quantity); */ }
                                            }, 0);

                                            const totalMenuPrice = foodTotalPrice + drinksTotalPrice;

                                            return (

                                                <Grid item xs={8} sm={6} md={4} key={index} >
                                                    <Card variant="outlined"
                                                        sx={{
                                                            backgroundColor: selected === menu?.MenuID ? '#fff4d0' : 'white',
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() => handleSelect(menu?.MenuID)}
                                                    >
                                                        <Typography
                                                            variant="h5"
                                                            sx={{
                                                                backgroundColor: '#fdeacd',
                                                                fontSize: 25,
                                                                fontWeight: 600,
                                                                color: '#81695e',
                                                                padding: '10px', // Đảm bảo có khoảng cách xung quanh
                                                            }}
                                                        >
                                                            {menu.Name}
                                                        </Typography>
                                                        <Typography
                                                            variant="h6"
                                                            color="textSecondary"
                                                            sx={{
                                                                fontSize: '1.2rem',
                                                                textAlign: 'left', // Căn trái giá
                                                                paddingX: '10px' // Khoảng cách từ hai bên
                                                            }}
                                                        >
                                                            {`Giá: ${totalMenuPrice.toLocaleString()} VND/bàn`}
                                                        </Typography>
                                                        <CardContent>
                                                            <img
                                                                src={menu.Image}
                                                                height={200}
                                                                width={300}
                                                            />
                                                            <div>
                                                                <Typography>
                                                                    <strong>Món ăn:</strong>
                                                                </Typography>
                                                                {menu?.Food?.map((food, idx) => (
                                                                    <Typography
                                                                        key={idx}
                                                                        variant="body2"
                                                                        sx={{
                                                                            fontSize: '1rem',
                                                                            textAlign: 'left',
                                                                            borderBottom: '1px solid #ddd', // Đường viền nhạt
                                                                            paddingBottom: '5px' // Khoảng cách dưới dòng
                                                                        }}
                                                                    >
                                                                        {food.Name}
                                                                    </Typography>
                                                                ))}
                                                            </div>
                                                            <div>
                                                                <Typography>
                                                                    <strong>Đồ uống:</strong>
                                                                </Typography>
                                                                {menu?.Drinks?.map((drink, idx) => (
                                                                    <Typography
                                                                        key={idx}
                                                                        variant="body2"
                                                                        sx={{
                                                                            fontSize: '1rem',
                                                                            textAlign: 'left',
                                                                            borderBottom: '1px solid #ddd', // Đường viền nhạt
                                                                            paddingBottom: '5px' // Khoảng cách dưới dòng
                                                                        }}
                                                                    >
                                                                        {drink.Name}
                                                                    </Typography>
                                                                ))}
                                                            </div>
                                                        </CardContent>
                                                    </Card>

                                                </Grid>
                                            );
                                        })}
                                </Grid>
                            </div>
                            <Button
                                variant="text"
                                sx={{ fontWeight: 600, color: "#64463c", textDecoration: "underline" }}
                                onClick={handleOpenModal}
                            >
                                Tự chọn menu
                            </Button>


                        </div>

                        <div>
                            <div className="booking-room-name">Trang trí</div>
                            <div className="booking-center">

                                <DecoreSelection
                                    price={deocrePrice}
                                    Decore={Decore}
                                    onDecoreChange={(name, value) => setDecore({ ...Decore, [name]: value })}
                                    setSelectedPrice={setSelectedPrice}
                                    selectedPrice={selectedPrice}
                                />
                            </div>
                        </div>
                    </div>

                }
                <div>
                    {bookingSuccess ?
                        <Link className="booking-link" to={"/payment"}>Đặt thành công, đến trang thanh toán </Link>
                        :
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: '#64463c', color: '#fff', margin: "20px" }}
                            onClick={handleSubmitHomePage}
                            disabled={isDisabled}
                        >
                            Đặt ngay
                        </Button>
                    }
                </div>
            </div>
            <CreateMenuModal open={openModal} handleClose={handleCloseModal} setSelected={setSelected} />
        </main>
    );
};

export default HomePage;
