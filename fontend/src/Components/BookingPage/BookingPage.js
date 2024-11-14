import "./bookingPage.css";
import { Link, useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import Header from "../Header/Header";
import Form from "./component/BookingForm"
import React, { useRef, useState } from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch
import { addEvent } from "../../redux/actions/eventRequest"; // Import hàm thêm sự kiện từ API
import { toast } from "react-toastify";
import { addBooking } from "../../redux/actions/bookingRequest";
import { addDecore } from "../../redux/actions/decoreRequest";
import { PostZaloApi } from "../../redux/actions/paymentRequest";
const HomePage = () => {
    const [selected, setSelected] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false)
    const [Decore, setDecore] = useState({
        LobbyDecore: true,
        StageDecore: true,
        TableDecore: true,
    });

    const formikRef = useRef(null);
    const { roomId } = useParams();
    const dispatch = useDispatch();
    const menus = useSelector((state) => state.menus?.menus);
    const rooms = useSelector((state) => state.rooms?.rooms)
    const room = rooms.find(item => item.RoomEventID === roomId)
    const user = useSelector((state) => state.auth.login.currentUser)
    const handleSubmit = (values) => {
    }
    const handleChangeCheckbox = (event) => {
        const { name, checked } = event.target;
        setDecore({
            ...Decore,
            [name]: checked,
        });
    };
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

            const decore = await addDecore(dispatch, Decore)

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
                    TotalTable: formValues.TotalTable,
                    EventDate: formValues.EventDate,
                    Time: formValues.Time,
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
                    <Form ref={formikRef} handleSubmit={handleSubmit} maxTable={room?.MaxTable} />

                </div>
                <div className="booking-room-name">Chọn Menu</div>

                <div className="booking-center">
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
                                    <h3>{`Giá: ${totalMenuPrice.toLocaleString()} VND/bàn`}</h3> {/* Hiển thị giá của menu */}
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

                <div>
                    <div className="booking-room-name">Trang trí</div>
                    <FormGroup sx={{ flexDirection: "row", justifyContent: "center", padding: 5, gap: 5 }}>
                        <FormControlLabel
                            control={<Checkbox checked={Decore.LobbyDecore} onChange={handleChangeCheckbox} name="LobbyDecore" />}
                            label="Sảnh"
                            labelPlacement="top"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={Decore.StageDecore} onChange={handleChangeCheckbox} name="StageDecore" />}
                            label="Sân khấu"
                            labelPlacement="top"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={Decore.TableDecore} onChange={handleChangeCheckbox} name="TableDecore" />}
                            label="Bàn"
                            labelPlacement="top"
                        />
                    </FormGroup>

                </div>
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
        </main>
    );
};

export default HomePage;
