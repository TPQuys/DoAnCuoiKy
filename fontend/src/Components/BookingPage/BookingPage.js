import "./bookingPage.css";
import { Link,  useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import Header from "../Header/Header";
import Form from "./component/BookingForm"
import React, { useRef, useState } from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch
import { addEvent } from "../../redux/actions/eventRequest"; // Import hàm thêm sự kiện từ API
import { toast } from "react-toastify";
import { addBooking } from "../../redux/actions/bookingRequest";
const HomePage = () => {
    const [selected, setSelected] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);
    const [bookingSuccess,setBookingSuccess] = useState(false)
    const formikRef = useRef(null);
    const { roomId } = useParams();
    const dispatch = useDispatch();
    const menus = useSelector((state) => state.menus?.menus);
    const rooms = useSelector((state) => state.rooms?.rooms)
    const room = rooms.find(item => item.RoomEventID == roomId)
    const user = useSelector((state) => state.auth.login.currentUser)
    const handleSubmit = (values) => {
    }
    const handleSubmitHomePage = async () => {
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
                    EventType: formValues.EventType,
                    TotalTable: formValues.TotalTable,
                    EventDate: formValues.EventDate,
                    Time: formValues.Time,
                    TotalPrice: totalMenuPrice,
                    Note: formValues.Note
                    // Thêm thông tin giá tổng
                    // Thêm các trường khác nếu cần
                };

                console.log(eventData)

                try {
                    setIsDisabled(true);
                    const newEvent = await addEvent(dispatch, eventData);
                    if (newEvent && user) {
                        const newBooking = await addBooking(dispatch,
                            {
                                EventID: newEvent.EventID,
                                UserID: user.user.id
                            }
                        )
                        if (newBooking) {
                        setBookingSuccess(true)
                            sessionStorage.setItem("booking",JSON.stringify(newBooking))
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
            <Header background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/homeheader.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21laGVhZGVyLmpwZyIsImlhdCI6MTcyNzYxODE4OSwiZXhwIjoxNzU5MTU0MTg5fQ.QU5J1wJV043dbnA6WzcnrIvAVUFGtf3Xc7QCsdIPvR8&t=2024-09-29T13%3A56%3A29.431Z" title="ĐẶT CHỖ" />
            <div className="room-body">
                <div>
                </div>
                <div>
                    <div className="booking-room-name">{room?.RoomName}</div>
                    <div className="booking-img" style={{
                        backgroundImage: `url(${room?.RoomImage})`,
                    }}>
                        <div className="booking-room-info">
                            <div className="booking-room-info-content">
                                <p>Chiều dài</p>
                                <h3>{room?.HeightRoom}</h3>
                            </div>
                            <div className="booking-room-info-content">
                                <p>Chiều rộng</p>
                                <h3>{room?.WidthRoom}</h3>
                            </div>
                            <div className="booking-room-info-content">
                                <p>Số bàn</p>
                                <h3>{room?.MaxTable}</h3>
                            </div>
                            <div className="booking-room-info-content">
                                <p>Giá</p>
                                <h3>{room?.Price}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <Form ref={formikRef} handleSubmit={handleSubmit} />

                    <div>
                        <div className="menu-container">
                            {menus.map((menu, index) => {
                                // Tính toán giá của menu
                                const foodTotalPrice = menu.Food.reduce((total, food) => {
                                    return total + (food.UnitPrice * food.MenuFoods.Quantity);
                                }, 0);

                                const drinksTotalPrice = menu.Drinks.reduce((total, drink) => {
                                    return total + (drink.UnitPrice * drink.MenuDrinks.Quantity);
                                }, 0);

                                const totalMenuPrice = foodTotalPrice + drinksTotalPrice;

                                return (
                                    <div
                                        key={index}
                                        className={`radio-div ${selected === menu?.MenuID ? 'selected' : ''}`}
                                        onClick={() => handleSelect(menu?.MenuID)}
                                    >
                                        <h1>{menu.Name}</h1>
                                        <h3>{`Price: $${totalMenuPrice.toFixed(0)}`}</h3> {/* Hiển thị giá của menu */}
                                        <div>
                                            <strong>Foods:</strong>
                                            {menu.Food.map((food, idx) => (
                                                <div key={idx} className='menu-item'>
                                                    <span >{food.Name}</span>
                                                    {/* <span >{food.UnitPrice}</span> */}
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <strong>Drinks:</strong>
                                            {menu.Drinks.map((drink, idx) => (
                                                <div key={idx} className='menu-item'>
                                                    <span >{drink.Name}</span>
                                                    {/* <span >{drink.UnitPrice}</span> */}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                    </div>

                </div>
                <div>
                    <h1>decore</h1>
                    <FormGroup sx={{ flexDirection: "row", justifyContent: "center", background: "#fafaeb", padding: 5, gap: 5 }}>
                        <FormControlLabel control={<Checkbox defaultChecked />} label="LobbyDecore" labelPlacement="top" />
                        <FormControlLabel control={<Checkbox />} label="StageDecore" labelPlacement="top" />
                        <FormControlLabel control={<Checkbox />} label="TableDecore" labelPlacement="top" />
                    </FormGroup>
                </div>
                <div>
                    {bookingSuccess ?
                        <Link className="booking-link" to={"/payment"}>Đặt thành công, đến trang thanh toán </Link>
                        :
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#64463c', color: '#fff' }}
                        onClick={handleSubmitHomePage}
                        disabled={isDisabled}
                    >
                        Đặt ngay
                    </Button>
                    }
                </div>
            </div>
        </main>
    );
};

export default HomePage;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};