import "./bookingPage.css";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Header from "../Header/Header";
import Form from "./BookingForm"
import React, { useRef, useState } from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useDispatch } from "react-redux"; // Import useDispatch
import { addEvent } from "../../redux/actions/eventRequest"; // Import hàm thêm sự kiện từ API

const HomePage = () => {
    const [selected, setSelected] = useState(null);
    const formikRef = useRef(null);
    const dispatch = useDispatch(); 

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
                StartEventTime: true,
                EndEventTime: true,
                EventOrder: true,
                RoomEventID: true,
            });
    
            // Nếu form hợp lệ, tiếp tục
            if (isValid && Object.keys(isValid).length === 0) {
                const formValues = formik.values; // Lấy giá trị từ formik
    
                const selectedMenu = menus.find(menu => menu.Name === selected);
                const eventData = {
                    EventType: "Wedding", // Hoặc loại sự kiện khác
                    TotalTable: 10, // Thay đổi số bàn theo yêu cầu
                    EventDate: new Date(), // Thay đổi theo thời gian thực tế
                    RoomEventID:"RE001",
                };
    
                try {
                    addEvent(dispatch,eventData);
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

    const menus = [
        {
            MenuID: "menu_001",
            Name: "Standard Wedding Menu",
            Price: 500.00,
            Foods: ["Grilled Chicken", "Salad", "Soup", "Steak", "Dessert"],
            Drinks: ["Wine", "Beer", "Soft Drinks"]
        },
        {
            MenuID: "menu_002",
            Name: "Luxury Wedding Menu",
            Price: 800.00,
            Foods: ["Lobster", "Truffle Soup", "Caviar", "Filet Mignon", "Chocolate Lava Cake"],
            Drinks: ["Champagne", "Cocktails", "Premium Wine"]
        },
        {
            MenuID: "menu_003",
            Name: "Conference Menu",
            Price: 300.00,
            Foods: ["Sandwiches", "Fruit Salad", "Cheese Platter", "Cookies", "Muffins"],
            Drinks: ["Coffee", "Tea", "Juices"]
        }
    ];

    return (
        <main className="room-container">
            <Header background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/homeheader.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21laGVhZGVyLmpwZyIsImlhdCI6MTcyNzYxODE4OSwiZXhwIjoxNzU5MTU0MTg5fQ.QU5J1wJV043dbnA6WzcnrIvAVUFGtf3Xc7QCsdIPvR8&t=2024-09-29T13%3A56%3A29.431Z" title="Room" />
            <div className="room-body">
                <div>
                </div>
                <div>
                    <div className="booking-room-name">Room name</div>
                    <div className="booking-img" src="">
                        <div className="booking-room-info">
                            <div className="booking-room-info-content">
                                <h3>content </h3>
                                <p>content</p>
                            </div>
                            <div className="booking-room-info-content">
                                <h3>content </h3>
                                <p>content</p>
                            </div>
                            <div className="booking-room-info-content">
                                <h3>content </h3>
                                <p>content</p>
                            </div>
                            <div className="booking-room-info-content">
                                <h3>content </h3>
                                <p>content</p>
                            </div>
                            <div className="booking-room-info-content">
                                <h3>content </h3>
                                <p>content</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <div className="menu-container">
                            {menus.map((menu, index) => (
                                <div
                                    key={index}
                                    className={`radio-div ${selected === menu.Name ? 'selected' : ''}`}
                                    onClick={() => handleSelect(menu.Name)}
                                >
                                    <h1>{menu.Name}</h1>
                                    <h3>{`Price: $${menu.Price}`}</h3>
                                    <div>
                                        <p><strong>Foods:</strong></p>
                                        {menu.Foods.map((food, idx) => (
                                            <p key={idx}>{food}</p>
                                        ))}
                                    </div>
                                    <div>
                                        <p><strong>Drinks:</strong></p>
                                        {menu.Drinks.map((drink, idx) => (
                                            <p key={idx}>{drink}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
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
                    <Form ref={formikRef} handleSubmit={handleSubmit} />
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
