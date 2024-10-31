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

    return <>
        <Header background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/homeheader.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21laGVhZGVyLmpwZyIsImlhdCI6MTcyNzYxODE4OSwiZXhwIjoxNzU5MTU0MTg5fQ.QU5J1wJV043dbnA6WzcnrIvAVUFGtf3Xc7QCsdIPvR8&t=2024-09-29T13%3A56%3A29.431Z" title="THÔNG TIN USER" />
        <UserProfile/>
        {/* <div className="w-100 pb-3">
            <form onSubmit={handleSubmit}>
                <div className="row w-100 pt-3">
                    <div className="col-md-6">
                            <div className="mb-3">
                                <FaUser size={135}/>
                            </div>
                            <Button
                                className="mb-3"
                                variant="contained"
                                component="label"
                            >
                                Chọn hình của bạn
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                />
                            </Button>
                        <div className="mb-3">
                            <FormLabel>Giới tính</FormLabel>
                            <RadioGroup
                                className="justify-content-around"
                                row
                                name="gender"
                            >
                                <FormControlLabel value="female" control={<Radio />} label="Nam" />
                                <FormControlLabel value="male" control={<Radio />} label="Nữ" />
                            </RadioGroup>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <TextField className="mb-3"
                            type="text"
                            name="name"
                            fullWidth
                            variant="outlined"
                            label="Tên"
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker className="w-100 mb-3"
                            label="Ngày Sinh"
                            value={birth}
                            onChange={(newBirth) => setBirth(newBirth)}
                        />
                        </LocalizationProvider>
                        <TextField className="mb-3"
                            type="text"
                            name="address"
                            fullWidth
                            variant="outlined"
                            label="Địa chỉ"
                        />
                        <TextField className="mb-3"
                            type="number"
                            name="phone"
                            fullWidth
                            variant="outlined"
                            label="Số điện thoại"
                        />
                    </div>
                </div>
                <Button variant="contained">Cập nhật thông tin</Button>
            </form>
        </div> */}
    </>
}

export default UserInfo;