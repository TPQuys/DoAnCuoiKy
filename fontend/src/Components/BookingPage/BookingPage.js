import "./bookingPage.css";
import { Link, useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import Header from "../Header/Header";
import Form from "./BookingForm"
import React, { useRef, useState } from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch
import { addEvent } from "../../redux/actions/eventRequest"; // Import hàm thêm sự kiện từ API
import { getAllMenus } from "../../redux/actions/menuRequest";
const HomePage = () => {
    const [selected, setSelected] = useState(null);
    const formikRef = useRef(null);
    const dispatch = useDispatch();
    const menus = useSelector((state) => state.menus?.menus);
    const { roomId } = useParams();
    const rooms = useSelector((state) => state.rooms?.rooms)
    const room = rooms.find(item => item.RoomEventID == roomId)
    console.log(room)
    const handleSubmit = (values) => {
        console.log(values);
    }
    const handleSubmitHomePage = async () => {
        if (formikRef.current) {
            const formik = formikRef.current;

            // Kiểm tra form có hợp lệ không
            const isValid = await formik.validateForm();
            formik.setTouched({
                EventType: true,
                TotalTable: true,
                EventDate: true, // Cập nhật trường này nếu cần
                Time: true, // Cập nhật trường này nếu cần
            });

            // Nếu form hợp lệ, tiếp tục
            if (isValid && Object.keys(isValid).length === 0) {
                const formValues = formik.values; // Lấy giá trị từ formik

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
                    RoomEventID:roomId,
                    MenuID: selected,
                    EventType: formValues.EventType,
                    TotalTable: formValues.TotalTable,
                    EventDate: formValues.EventDate,
                    Time: formValues.Time,
                    TotalPrice: totalMenuPrice, // Thêm thông tin giá tổng
                    // Thêm các trường khác nếu cần
                };

                try {
                    await addEvent(dispatch, eventData); // Chờ cho đến khi sự kiện được thêm
                } catch (error) {
                    console.log(error.message);
                }
            } else {
                console.log("Form không hợp lệ:", isValid);
            }
        }
    };



    const handleSelect = (value) => {
        setSelected(value);
    };

    return (
        <main className="room-container">
            <Header background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/homeheader.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21laGVhZGVyLmpwZyIsImlhdCI6MTcyNzYxODE4OSwiZXhwIjoxNzU5MTU0MTg5fQ.QU5J1wJV043dbnA6WzcnrIvAVUFGtf3Xc7QCsdIPvR8&t=2024-09-29T13%3A56%3A29.431Z" title="Room" />
            <div className="room-body">
                <div>
                </div>
                <div>
                    <div className="booking-room-name">{room?.RoomName}</div>
                    <div className="booking-img" src="">
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
                                            <p><strong>Foods:</strong></p>
                                            {menu.Food.map((food, idx) => (
                                                <p key={idx}>{food.Name}</p>
                                            ))}
                                        </div>
                                        <div>
                                            <p><strong>Drinks:</strong></p>
                                            {menu.Drinks.map((drink, idx) => (
                                                <p key={idx}>{drink.Name}</p>
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
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#64463c', color: '#fff' }}
                        onClick={handleSubmitHomePage} // Gọi hàm submit của EventForm từ đây
                    >
                        Đặt ngay
                    </Button>
                </div>
            </div>
        </main>
    );
};

export default HomePage;
