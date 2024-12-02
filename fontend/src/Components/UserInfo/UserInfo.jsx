import "./userInfo.css";
import { useState } from "react";
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
// import Radio from '@mui/material/Radio';
// import RadioGroup from '@mui/material/RadioGroup';
// import { FormLabel, FormControlLabel } from '@mui/material';
import Header from '../Header/Header'
// import TextField from '@mui/material/TextField';
// import { Button } from "@mui/material";
// import { FaUser } from 'react-icons/fa';
import UserProfile from './Component/UserProfile'
function UserInfo(params) {
    const [birth, setBirth] = useState(dayjs(new Date()));

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return <main className='room-container' >

        <Header background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/homeheader.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21laGVhZGVyLmpwZyIsImlhdCI6MTcyNzYxODE4OSwiZXhwIjoxNzU5MTU0MTg5fQ.QU5J1wJV043dbnA6WzcnrIvAVUFGtf3Xc7QCsdIPvR8&t=2024-09-29T13%3A56%3A29.431Z" title="THÔNG TIN USER" />
        <div className="room-body">
            <div className="booking-center">
                <UserProfile />
            </div>
        </div>
    </main>
}

export default UserInfo;