import "./PaymentPage.css"
import Button from '@mui/material/Button';
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getBookingById } from "../../redux/actions/bookingRequest"
import Header from '../Header/Header';
import { PostZaloApi } from '../../redux/actions/paymentRequest';
const PaymentPage = () => {
    const booking = JSON.parse(sessionStorage.getItem("booking"))
    const [event, setEvent] = useState({});
    const [newBooking, setNewBooking] = useState({});

    const dispatch = useDispatch();

    const getBooking = async () => {
        const responseBooking = await getBookingById(dispatch, booking?.BookingID)
        if (responseBooking) {
            setNewBooking(responseBooking?.data)
            setEvent(responseBooking.data?.Event)
            console.log(responseBooking?.data)
        }
    }
    useEffect(() => {
        getBooking()
    }, [])

    const handlePayment = async () => {
        if (newBooking) {
            const zaloApi = await PostZaloApi(dispatch, newBooking)
            window.location.href = zaloApi.data.order_url;
        }
    }

    const getMenuPrice = (menu) => {
        let totalMenuPrice = 0
        // Tính toán giá của menu
        const foodTotalPrice = menu?.Food.reduce((total, food) => {
            return total + (food.UnitPrice * food.MenuFoods.Quantity);
        }, 0);

        const drinksTotalPrice = menu?.Drinks.reduce((total, drink) => {
            return total + (drink.UnitPrice * drink.MenuDrinks.Quantity);
        }, 0);

        totalMenuPrice = foodTotalPrice + drinksTotalPrice;
        return totalMenuPrice
    }

    const formatDate = (date) => {
        if (date) {
            // Lấy ngày, tháng và năm
            const day = String(date.getDate()).padStart(2, '0'); // thêm '0' nếu nhỏ hơn 10
            const month = String(date.getMonth() + 1).padStart(2, '0'); // tháng bắt đầu từ 0 nên +1
            const year = date.getFullYear();

            // Định dạng thành dd/mm/yyyy
            const formattedDate = `${day}/${month}/${year}`;
            return formattedDate
        }
    }

    const getEventType = (type) => {
        if (type) {
            if (type === "WEDDING") {
                return "Đám cưới"
            } else if (type === "CONFERENCE") {
                return "Hội nghị"
            } else if (type === "BIRTHDAY") {
                return "Sinh nhật"
            } else if (type === "ORDER") {
                return "Khác"
            }
        }
    }

    const getTime = (time) => {
        if (time) {
            if (time = "MORNING") {
                return "Buổi sáng"
            }
            if (time = "AFTERNOON") {
                return "Buổi chiều"
            }
            if (time = "ALLDAY") {
                return "Cả ngày"
            }
        }
    }
    return (
        <main className='room-container'>
            <Header background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/homeheader.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21laGVhZGVyLmpwZyIsImlhdCI6MTcyNzYxODE4OSwiZXhwIjoxNzU5MTU0MTg5fQ.QU5J1wJV043dbnA6WzcnrIvAVUFGtf3Xc7QCsdIPvR8&t=2024-09-29T13%3A56%3A29.431Z" title="Thanh toán" />
            <div className="payment-body">
                <div className='flex'>
                    <div className='payment-room'>
                        <h3>Nhà hàng: {event.RoomEvent?.RoomName}</h3>
                        <h4>Giá: {event.RoomEvent?.Price} VND</h4>
                        <img src={event.RoomEvent?.RoomImage} className='payment-img'></img>
                    </div>

                    <div className='payment-event'>
                        <h3>Thông tin sự kiện:</h3>
                        <div className="payment-content">
                        <p>Ngày tổ chức: {formatDate(new Date(event?.EventDate))}</p>
                        <p>Loại sự kiện: {getEventType(event?.EventType)}</p>
                        <p>Thời gian: {getTime(event?.Time)}</p>
                        <p>Tống số bàn: {event?.TotalTable}</p>
                        <p>Ghi chú: {event?.Note}</p>
                        </div>
                    </div>

                </div>
                <div className='flex'>
                    <div className='payment-menu'>
                        <h3 className='menu-title'>Menu</h3>
                        <h6>Tổng giá: {getMenuPrice(event.Menu)} VND/Bàn</h6>
                        <div>
                            <div className='menu-item'>
                                <strong>Món ăn</strong>
                                {/* <strong>Số lượng</strong> */}
                            </div>
                            {event.Menu?.Food.map((food, idx) => (
                                <div key={idx} className='menu-item'>
                                    <span >{food.Name}</span>
                                    {/* <span >{food.MenuFoods.Quantity}</span> */}
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className='menu-item'>
                                <strong>Đồ uống</strong>
                                {/* <strong>Số lượng</strong> */}
                            </div>
                            {event.Menu?.Drinks.map((drink, idx) => (
                                <div key={idx} className='menu-item'>
                                    <span >{drink.Name}</span>
                                    {/* <span >{drink.MenuDrinks.Quantity}</span> */}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='payment-menu'>
                        <div className="payment-price">
                            <h3>TỔNG GIÁ</h3>
                            <h1>{getMenuPrice(event.Menu) * event.TotalTable + event.RoomEvent?.Price} VND</h1>
                        </div>
                    </div>
                </div>
                <div className='payment-button-container'>
                    {newBooking.Payment ? "Đã thanh toán" :
                        <Button
                            component="a"
                            variant="contained"
                            sx={{width:"400px", alignSelf:"center", background:"#e5cc5f"}}
                            onClick={()=>handlePayment()}
                        >
                            Thanh toán</Button>
                    }
                </div>
            </div>
        </main>

    );
};

export default PaymentPage;
