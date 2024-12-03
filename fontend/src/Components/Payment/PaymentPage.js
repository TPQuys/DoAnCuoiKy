import "./PaymentPage.css"
import Button from '@mui/material/Button';
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getBookingById } from "../../redux/actions/bookingRequest"
import Header from '../Header/Header';
import { PostZaloApi } from '../../redux/actions/paymentRequest';
import ReplayIcon from '@mui/icons-material/Replay';
const PaymentPage = () => {
    const booking = JSON.parse(sessionStorage.getItem("booking"))
    const [event, setEvent] = useState({});
    const [newBooking, setNewBooking] = useState({});
    const [isDisable, setIsDisable] = useState(false);
    const [remainingTime, setRemainingTime] = useState(900);
    const dispatch = useDispatch();

    const getBooking = async () => {
        const responseBooking = await getBookingById(dispatch, booking?.BookingID)
        if (responseBooking) {
            setNewBooking(responseBooking?.data)
            setEvent(responseBooking.data?.Event)
            console.log(responseBooking?.data)
        }
    }

    const resetLinkPayment = async () => {
        if (newBooking) {
            const zaloApi = await PostZaloApi(dispatch, newBooking)
            if (zaloApi?.data?.order_url) {
                setNewBooking({ ...newBooking, PaymentLink: zaloApi.data.order_url })
                setIsDisable(false)
            }
        }
    }

    useEffect(() => {
        getBooking()
    }, [])

    useEffect(() => {
        // Tính toán thời điểm kết thúc (bookingTime + 15 phút)
        const endTime = new Date(booking.BookingTime).getTime() + 15 * 60 * 1000;

        // Cập nhật thời gian còn lại mỗi giây
        const interval = setInterval(() => {
            const currentTime = new Date().getTime();
            const timeLeft = Math.max(0, Math.floor((endTime - currentTime) / 1000));
            setRemainingTime(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(interval);
            }
        }, 1000);

        // Dọn dẹp interval khi component bị huỷ
        return () => clearInterval(interval);
    }, [booking.BookingTime]);

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;



    const handlePayment = async () => {
        setIsDisable(true)
        if (newBooking) {
            // const zaloApi = await PostZaloApi(dispatch, newBooking)
            // console.log(zaloApi)
            if (newBooking.PaymentLink) {
                window.location.href = newBooking.PaymentLink;
                setIsDisable(false)
            }
        }
    }

    const getMenuPrice = (menu) => {
        if (menu) {
            let totalMenuPrice = 0
            // Tính toán giá của menu
            const foodTotalPrice = menu?.Food.reduce((total, food) => {
                return total + (food.UnitPrice);
            }, 0);

            const drinksTotalPrice = menu?.Drinks.reduce((total, drink) => {
                return total + (drink.UnitPrice);
            }, 0);

            totalMenuPrice = foodTotalPrice + drinksTotalPrice;
            return totalMenuPrice
        }
        return 0;
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
            } else if (type === "ORTHER") {
                return "Khác"
            }
        }
    }

    const getTime = (time) => {
        if (time) {
            if (time === "MORNING") {
                return "Buổi sáng"
            }
            if (time === "AFTERNOON") {
                return "Buổi chiều"
            }
            if (time === "ALLDAY") {
                return "Cả ngày"
            }
        }
    }

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



    const rommPriceByEvent = (event, roomPrice) => {
        if (event?.Time === "ALLDAY") {
            return roomPrice * 2
        }
        else {
            return roomPrice
        }
    }
    const getDecorePrice = (event, decore) => {
        if (decore) {
            let total = 0;
            if (decore?.LobbyDecore) {
                total += decore?.DecorePrice?.LobbyDecorePrice; // Sử dụng += để cộng dồn
            }
            if (decore?.StageDecore) {
                total += decore?.DecorePrice?.StageDecorePrice; // Sử dụng += để cộng dồn
            }
            if (decore?.TableDecore) {
                total += (decore?.DecorePrice?.TableDecorePrice) * event?.TotalTable; // Sử dụng += để cộng dồn
            }
            return total; // Trả về tổng giá trị
        }
    };
    const getDecoreType = (decore) => {
        if (decore) {
            if (decore?.DecorePrice?.Type === 'BASIC') {
                return "Cơ bản"
            } else if (decore?.DecorePrice?.Type === 'ADVANCED') {
                return "Nâng cao"
            } else if (decore?.DecorePrice?.Type === 'PREMIUM') {
                return "Cao cấp"
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
                        <h4>Giá: {(event.RoomEvent?.Price)?.toLocaleString()} VND</h4>
                        <img src={event.RoomEvent?.RoomImage} className='payment-img' alt="Room-img"></img>
                    </div>

                    <div className='payment-event'>
                        <h3>Thông tin sự kiện:</h3>
                        <div className="payment-content">
                            <p>Ngày tổ chức: {formatDate(new Date(event?.EventDate))}</p>
                            <p>Loại sự kiện: {getEventType(event?.EventType)}</p>
                            <p>Thời gian: {getTime(event?.Time)}</p>
                            <p>Tống số bàn: {event?.TotalTable}</p>
                            <p>Trang trí: {getDecore(event?.Decore)} ({getDecoreType(event?.Decore)})</p>
                            <p>Ghi chú: {event?.Note}</p>
                        </div>
                    </div>

                </div>
                <div className='flex'>
                    <div className='payment-menu'>
                        <h3 className=''>Menu</h3>
                        <h6>Tổng giá: {getMenuPrice(event.Menu)?.toLocaleString()} VND/Bàn</h6>
                        <div>
                            <div className=''>
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
                            <div className=''>
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
                            <h1>{(getMenuPrice(event.Menu) * event.TotalTable + getDecorePrice(event, event.Decore) + rommPriceByEvent(event, event.RoomEvent?.Price))?.toLocaleString()} VND</h1>
                        </div>
                    </div>
                </div>
                <div className='payment-button-container'>
                    {newBooking.Payment ? "Đã thanh toán" : remainingTime > 1 ?
                        <div>
                            <Button
                                component="a"
                                variant="contained"
                                sx={{ width: "400px", alignSelf: "center", background: "#e5cc5f" }}
                                onClick={() => handlePayment()}
                                disabled={isDisable}
                            >
                                Thanh toán ({minutes}:{seconds < 10 ? '0' : ''}{seconds})
                            </Button>
                            <Button variant="text" onClick={() => resetLinkPayment()}><ReplayIcon /></Button>
                        </div> : "Lịch đặt đã hết hạn"
                    }
                </div>
                <Button variant="text" onClick={() => resetLinkPayment()}><ReplayIcon /></Button>
            </div>
        </main>

    );
};

export default PaymentPage;
