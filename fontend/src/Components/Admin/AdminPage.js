import React, { useEffect, useState } from "react";
import Header from '../Header/Header';
import Room from "./component/Room/Room";
import Bookings from "./component/Bookng/Booking";
import { useSelector } from "react-redux";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { Box, Stack, } from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
const UserPage = () => {
    const [value, setValue] = useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const Booking = useSelector((state) => state.bookings.bookings)
    const rooms = useSelector((state) => state.rooms?.rooms);

    return (
        <main className='room-container'>
            <Header background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/user-header.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC91c2VyLWhlYWRlci53ZWJwIiwiaWF0IjoxNzI5ODY1NDgwLCJleHAiOjE3NjE0MDE0ODB9.skF1ZqXKPkSYiMKxkwb_KaZETbIpPrffb9M8bMj893U&t=2024-10-25T14%3A11%3A18.654Z" title="ADMIN" />
            <div className="room-body">
                <div className="booking-center">
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Phòng" value="1" />
                                <Tab label="Lịch sử đặt" value="2" />
                                <Tab label="Item Three" value="3" />
                            </TabList>
                        </Box>
                        <TabPanel value="1"> <Room rooms={rooms}/></TabPanel>
                        <TabPanel value="2"> <Bookings bookings={Booking} rooms={rooms}/></TabPanel>
                        <TabPanel value="3">Item Three</TabPanel>
                    </TabContext>
                    <Stack direction="row" >
                    </Stack>
                </div>
            </div>
        </main>

    );
};

export default UserPage;
