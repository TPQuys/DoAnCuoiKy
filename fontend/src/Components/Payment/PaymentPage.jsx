import "./PaymentPage.css"
import Button from '@mui/material/Button';
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getBookingById } from "../../redux/actions/bookingRequest"
import Header from '../Header/Header';
import { PostZaloApi } from '../../redux/actions/paymentRequest';
import { toast } from "react-toastify";
import ReplayIcon from '@mui/icons-material/Replay';
import { formatDate, getDecorePrice, getMenuPrice, rommPriceByEvent, getDecore, getDecoreType, getEventType, getRangeTime, getTime } from './FormatFunction'

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
                toast.success("Tạo mới link thanh toán thành công!");
            }
        }
    }

    useEffect(() => {
        getBooking()
    }, [])

    useEffect(() => {
        // Tính toán thời điểm kết thúc (bookingTime + 1 ngày)
        const endTime = new Date(booking?.BookingTime).getTime() + 24 * 60 * 60 * 1000;

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
    }, [booking?.BookingTime]);


    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;



    const handlePayment = async () => {
        setIsDisable(true)
        if (newBooking) {
            if (new Date(newBooking.LinkExpiry) < new Date()) {
                const zaloApi = await PostZaloApi(dispatch, newBooking)
                window.location.href = zaloApi.data.order_url;
                return
            }
            if (newBooking.PaymentLink) {
                window.location.href = newBooking.PaymentLink;
                setIsDisable(false)
            } else {
                const zaloApi = await PostZaloApi(dispatch, newBooking)
                window.location.href = zaloApi?.data?.order_url

            }
        }
    }


    return (
        <main className='room-container'>
            <Header background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/homeheader.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21laGVhZGVyLmpwZyIsImlhdCI6MTcyNzYxODE4OSwiZXhwIjoxNzU5MTU0MTg5fQ.QU5J1wJV043dbnA6WzcnrIvAVUFGtf3Xc7QCsdIPvR8&t=2024-09-29T13%3A56%3A29.431Z" title="Thanh toán" />
            <div className="payment-body">
                <div className='flex'>
                    <div className='payment-room'>
                        <h3>Nơi tổ chức: {event.RoomEvent?.RoomName}</h3>
                        <h4>Giá: {(event.RoomEvent?.Price)?.toLocaleString()} VND</h4>
                        <img src={event.RoomEvent?.RoomImage} className='payment-img' alt="Room-img"></img>
                    </div>

                    <div className='payment-event'>
                        <h3>Thông tin sự kiện:</h3>
                        <div className="payment-content">
                            <p>Ngày tổ chức: {formatDate(new Date(event?.EventDate))}</p>
                            <p>Loại sự kiện: {getEventType(event?.EventType)}</p>
                            {event?.RoomEvent?.MaxTable >= 5 ?
                                <p>Thời gian: {getTime(event?.Time)}</p>
                                :
                                <p>Thời gian: {getRangeTime(event?.From, event?.To)}</p>
                            }
                            <p>Tống số bàn: {event?.TotalTable}</p>
                            {getDecore(event?.Decore).length > 0 &&
                                <p>Trang trí: {getDecore(event?.Decore)} {getDecoreType(event?.Decore)}</p>
                            }
                            <p>Ghi chú: {event?.Note}</p>
                        </div>
                    </div>

                </div>
                <div className='flex'>
                    {event?.Menu &&
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
                    }
                    <div className='payment-menu' >
                        <div className="payment-price" >
                            <h3>Thành tiền</h3>
                            <div className='menu-item'>
                                <span>Phòng</span>
                                <span>{rommPriceByEvent(event, event.RoomEvent?.Price)?.toLocaleString()} VND</span>
                            </div>
                            <div className='menu-item'>
                                <span>Menu</span>
                                <span>{(getMenuPrice(event?.Menu) * event?.TotalTable)?.toLocaleString()} VND</span>
                            </div>
                            <div className='menu-item'>
                                <span>Trang trí</span>
                                <span>{getDecorePrice(event, event?.Decore).toLocaleString()} VND</span>
                            </div>
                            <div className='menu-item'>
                                <span>VAT</span>
                                <span>{((getMenuPrice(event.Menu) * event.TotalTable + getDecorePrice(event, event.Decore) + rommPriceByEvent(event, event.RoomEvent?.Price)) * 0.1)?.toLocaleString()} VND</span>
                            </div>
                            <div style={{ height: 40 }}></div>
                            <h3>TỔNG GIÁ</h3>
                            <h1>{((getMenuPrice(event.Menu) * event.TotalTable + getDecorePrice(event, event.Decore) + rommPriceByEvent(event, event.RoomEvent?.Price)) * 1.1)?.toLocaleString()} VND</h1>
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
                                Thanh toán {minutes <= 30 && `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}

                            </Button>
                            <Button variant="text" onClick={() => resetLinkPayment()}><ReplayIcon /></Button>
                        </div> : "Lịch đặt đã hết hạn"
                    }
                </div>
            </div>
        </main>

    );
};

export default PaymentPage;
