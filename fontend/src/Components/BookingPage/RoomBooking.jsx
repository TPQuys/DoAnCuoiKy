import "./bookingPage.css";
import { useNavigate, useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import Header from "../Header/Header";
import Form from "./component/RoomBookingForm";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

const HomePage = () => {
    const navigate = useNavigate();
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);

    const formikRef = useRef(null);
    const { roomId } = useParams();
    console.log(roomId);

    const rooms = useSelector((state) => state.rooms?.rooms);
    const room = rooms.find(item => item.RoomEventID === roomId);
    const requireDay = useSelector((state) => state.requireDay.numberDay);

    const handleSubmit = (values) => {
        const formik = formikRef.current;
        const formValues = formik.values;
        const formData = {...formValues, From: from, To: to}
        navigate('/booking/detail', { state: { formData, room } });
    };

    // const handleSubmitHomePage = async () => {
    //     setIsDisabled(true);
    //     if (formikRef.current) {
    //         const formik = formikRef.current;

    //         // Kiểm tra form có hợp lệ không
    //         const isValid = await formik.validateForm();
    //         formik.setTouched({
    //             EventType: true,
    //             TotalTable: true,
    //             EventDate: true,
    //             Time: true,
    //             Note: true,
    //         });

    //         const decore = await addDecore(dispatch, { ...Decore, DecorePriceID: selectedPrice.DecorePriceID })

    //         if (isValid && Object.keys(isValid).length === 0) {
    //             const formValues = formik.values;

    //             // Lấy thông tin menu đã chọn
    //             const selectedMenu = menus.find(menu => menu.MenuID === selected);
    //             const foodTotalPrice = selectedMenu?.Food.reduce((total, food) => {
    //                 return total + (food.UnitPrice * food.MenuFoods.Quantity);
    //             }, 0);

    //             const drinksTotalPrice = selectedMenu?.Drinks.reduce((total, drink) => {
    //                 return total + (drink.UnitPrice * drink.MenuDrinks.Quantity);
    //             }, 0);

    //             const totalMenuPrice = foodTotalPrice + drinksTotalPrice;

    //             // Tạo eventData với thông tin từ form và menu đã chọn
    //             const eventData = {
    //                 RoomEventID: roomId,
    //                 MenuID: selected,
    //                 DecoreID: decore.DecoreID,
    //                 EventType: formValues.EventType,
    //                 TotalTable: room.MaxTable > 5 ? formValues.TotalTable : 1,
    //                 EventDate: formValues.EventDate,
    //                 Time: room.MaxTable > 5 ? formValues.Time : "CUSTOM",
    //                 From: from,
    //                 To: to,
    //                 TotalPrice: totalMenuPrice,
    //                 Note: formValues.Note
    //                 // Thêm thông tin giá tổng
    //                 // Thêm các trường khác nếu cần
    //             };

    //             try {
    //                 const newEvent = await addEvent(dispatch, eventData);
    //                 if (newEvent && user) {
    //                     const newBooking = await addBooking(dispatch,
    //                         {
    //                             EventID: newEvent.EventID,
    //                             UserID: user.user.id,
    //                             BookingTime: new Date()
    //                         }
    //                     )
    //                     if (newBooking) {
    //                         console.log(newBooking)
    //                         const zaloApi = await PostZaloApi(dispatch, newBooking)
    //                         setBookingSuccess(true)
    //                         sessionStorage.setItem("booking", JSON.stringify(newBooking))
    //                     }
    //                 }
    //                 else {
    //                     console.log("invaid user")
    //                 }
    //             } catch (error) {
    //                 console.log(error.message);
    //             }
    //         } else {
    //             toast.info("Form không hợp lệ:", isValid);
    //         }
    //     }
    //     setIsDisabled(false);
    // };

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
                    <Form
                        requireDay={requireDay}
                        RoomEventID={roomId}
                        setFrom={setFrom}
                        setTo={setTo}
                        ref={formikRef}
                        handleSubmit={handleSubmit}
                        maxTable={room?.MaxTable}
                    />
                </div>
                <div>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#64463c', color: '#fff', margin: "20px" }}
                        onClick={() => formikRef.current?.submitForm()} // Gọi formik's submitForm method khi người dùng bấm nút Đặt ngay
                    >
                        Đặt ngay
                    </Button>
                </div>
            </div>
        </main>
    );
};

export default HomePage;
