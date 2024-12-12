import React, { useEffect, useState } from "react";
import Header from '../Header/Header';
import Room from "./component/Room/Room";
import Bookings from "./component/Bookng/Booking";
import User from "./component/User/UserManager";
import UserProfile from "./component/Profile/UserProfile";
import PaymentSuccessChart from "./component/Charts/PaymentSuccesChart";
import RoomChart from "./component/Charts/RoomChart";
import PaymentChart from "./component/Charts/PaymentChart";
import { useDispatch, useSelector } from "react-redux";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { Box, Grid2, Stack, } from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
import { getAllUsers } from "../../redux/actions/userRequest";
import { getAllBooking } from "../../redux/actions/bookingRequest";
import { getRate } from "../../redux/actions/rateRequest";
const UserPage = () => {
    const [value, setValue] = useState('1');
    const Booking = useSelector((state) => state.bookings.bookings)
    const rooms = useSelector((state) => state.rooms?.rooms);
    const user = useSelector((state) => state.auth.login.currentUser)?.user;
    const dispatch = useDispatch()
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    useEffect(() => {
        const getAllRate = async () => {
            const res = await getRate();
            console.log(res)
        } 
        if (user.role === "ADMIN" || user.role === "HR") {
            getAllUsers(dispatch)
        }
        if (user.role === "ADMIN" || user.role === "ACCOUNTANT") {
            getAllBooking(dispatch)
            getAllRate()
        }
    }, [])

    return (
        <main className='room-container'>
            <Header background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/user-header.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC91c2VyLWhlYWRlci53ZWJwIiwiaWF0IjoxNzI5ODY1NDgwLCJleHAiOjE3NjE0MDE0ODB9.skF1ZqXKPkSYiMKxkwb_KaZETbIpPrffb9M8bMj893U&t=2024-10-25T14%3A11%3A18.654Z" title="ADMIN" />
            <div className="room-body">
                <div className="booking-center">
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: "#fafaeb" }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Cá nhân" value="1" />
                                {(user.role === "ADMIN" || user.role === "MANAGER" )&& <Tab label="Phòng" value="2" />}
                                {(user.role === "ADMIN" || user.role === "ACCOUNTANT") && <Tab label="Lịch sử đặt" value="3" />}
                                {(user.role === "ADMIN" || user.role === "HR" )&& <Tab label="Người dùng" value="4" />}
                                {(user.role === "ADMIN" || user.role === "ACCOUNTANT") && <Tab label="Biểu đồ" value="5" />}
                            </TabList>
                        </Box>
                        <TabPanel value="1"><UserProfile /></TabPanel>
                        <TabPanel value="2"><Room rooms={rooms} /></TabPanel>
                        <TabPanel value="3"><Bookings bookings={Booking} rooms={rooms} /></TabPanel>
                        <TabPanel value="4"><User /></TabPanel>
                        <TabPanel value="5">
                            <PaymentChart bookings={Booking} />
                            <Grid2 container sx={{ gap: "20px" }}>
                                <RoomChart bookings={Booking} />
                                <PaymentSuccessChart bookings={Booking} />
                            </Grid2>

                        </TabPanel>

                    </TabContext>
                    <Stack direction="row" >
                    </Stack>
                </div>
            </div>
        </main>

    );
};

export default UserPage;
