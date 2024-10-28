import React, { useEffect } from "react";
import Header from '../Header/Header';
import { useDispatch, useSelector } from "react-redux";
import { Box, Stack, } from '@mui/material';
// import { useNavigate } from "react-router-dom";
import { getBookingByUser } from "../../redux/actions/bookingRequest";
import UserProfile from "./UserProfile";
import Bookings from "./Bookings";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

// const formatDate = (date) => {
//     if (date) {
//         // Lấy ngày, tháng và năm
//         const day = String(date.getDate()).padStart(2, '0'); // thêm '0' nếu nhỏ hơn 10
//         const month = String(date.getMonth() + 1).padStart(2, '0'); // tháng bắt đầu từ 0 nên +1
//         const year = date.getFullYear();

//         // Định dạng thành dd/mm/yyyy
//         const formattedDate = `${day}/${month}/${year}`;
//         return formattedDate
//     }
// }

const UserPage = () => {
    const bookings = useSelector((state) => state.bookings?.bookings)
    // const navigate = useNavigate();
    const dispatch = useDispatch()
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // const handleClick = (booking) => {
    //     sessionStorage.setItem("booking", JSON.stringify(booking))
    //     navigate("/payment")
    // }
    useEffect(() => {
        if (bookings.length < 1)
            getBookingByUser(dispatch)
    }, [dispatch,bookings.length])
    return (
        <main className='room-container'>
            <Header background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/user-header.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC91c2VyLWhlYWRlci53ZWJwIiwiaWF0IjoxNzI5ODY1NDgwLCJleHAiOjE3NjE0MDE0ODB9.skF1ZqXKPkSYiMKxkwb_KaZETbIpPrffb9M8bMj893U&t=2024-10-25T14%3A11%3A18.654Z" title="NGƯỜI DÙNG" />
            <div className="room-body">
                <div className="booking-center">
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Item One" value="1" />
                                <Tab label="Item Two" value="2" />
                                <Tab label="Item Three" value="3" />
                            </TabList>
                        </Box>
                        <TabPanel value="1"><UserProfile /></TabPanel>
                        <TabPanel value="2"><Bookings bookings={bookings} /></TabPanel>
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
