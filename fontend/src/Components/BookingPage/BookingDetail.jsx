import React, { useState } from 'react';
import { Paper, Typography, Grid, Box, Card, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import { useSelector } from 'react-redux';
import MenuSelect  from './component/MenuSelect'
// Tạo một component Paper có nền trong suốt
const TransparentPaper = styled(Paper)({
    padding: 16,
    backgroundColor: 'transparent',
    boxShadow: 'none',
});

const EventDetails = () => {
    const location = useLocation();
    const menus = useSelector((state) => state.menus?.menus);
    const { formData, room } = location.state || {};

    const [selected, setSelected] = useState(null);
    const handleSelect = (value) => {
        setSelected((prevSelected) => (prevSelected === value ? null : value));
    };
    


    if (!formData) {
        return (
            <Typography variant="h6" color="textSecondary">
                Không có sự kiện nào được đặt.
            </Typography>
        );
    }

    const { EventType, EventDate, Time, TotalTable, Note, SelectedTimes } = formData;





    return (
        <main className="room-container">
            <Header
                background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/room-header.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9yb29tLWhlYWRlci5qcGciLCJpYXQiOjE3Mjk4NjU2NDQsImV4cCI6MTc2MTQwMTY0NH0.X1m9vEDzQi-PR17kKxJDvoxcfBTjNmimrzGOFC_F6Eg&t=2024-10-25T14%3A14%3A02.614Z"
                title="ĐẶT CHỖ"
            />
            <div className="room-body">
                <div className="booking-room-name">Chi tiết sự kiện đã đặt</div>
                <div className="booking-center">
                    <TransparentPaper>

                        <Grid container spacing={3}>
                            <Grid item xs={3}>
                                <Card
                                    style={{
                                        width: 'auto',
                                        maxWidth: 'fit-content',
                                        padding: '16px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                        marginBottom: '30px'
                                    }}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1">Loại sự kiện:</Typography>
                                            <Typography>{EventType}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1">Ngày:</Typography>
                                            <Typography>
                                                {EventDate ? new Date(EventDate).toDateString() : 'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1">Thời gian:</Typography>
                                            <Typography>
                                                {Time === 'CUSTOM'
                                                    ? SelectedTimes?.join(', ') || 'N/A'
                                                    : Time === 'MORNING'
                                                        ? 'Buổi sáng (8:00-14:00)'
                                                        : Time === 'AFTERNOON'
                                                            ? 'Buổi chiều (16:00-23:00)'
                                                            : 'Cả ngày'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1">Tổng số bàn:</Typography>
                                            <Typography>{TotalTable}</Typography>
                                        </Grid>
                                        {Note && (
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle1">Ghi chú:</Typography>
                                                <Typography>{Note}</Typography>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Card>
                                <Card
                                    style={{
                                        padding: '16px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                        marginBottom: '30px'
                                    }}
                                >
                                    <Typography variant="subtitle1">Lưu ý:</Typography>
                                    <Typography>- Hãy thanh toán trong vòng 24 giờ trước khi đơn đặt hết hạn</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={9} >
                                <Card sx={{ marginBottom: 3 }}>
                                    <Grid container m={3}>
                                        <Grid item xs={4} alignContent='center'>
                                            <img
                                                src={room.RoomImage}
                                                alt="room"
                                                style={{ width: "100%", borderRadius: "8px" }}
                                            />
                                        </Grid>
                                        {/* Thông tin bên phải */}
                                        <Grid item xs={8} justifyItems='left' pl={4}>
                                            <Typography variant="h6" gutterBottom>
                                                <Link to={`/`} className="room-content-title" style={{ textDecoration: 'none', color: '#64463c' }}>
                                                    {room.RoomName}
                                                </Link>
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Kích thước:</strong> Chiều dài: {room.HeightRoom}m, Chiều rộng: {room.WidthRoom}m
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Sức chứa:</strong> Số người: {room.Capacity}, Số bàn tối đa: {room.MaxTable}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                component="div"
                                                gutterBottom
                                                align="left"
                                                style={{ textAlign: 'left', maxWidth: "90%" }}
                                            >
                                                <strong>Mô tả:</strong> {room.Description}
                                            </Typography>
                                            <Typography style={{
                                                position: 'relative',
                                                borderRadius: '4px',
                                                fontWeight: 'bold',
                                            }} variant="h5" gutterBottom>
                                                <strong>Giá: </strong> {room.Price.toLocaleString()} VND
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Card>
                                <Card >
                                    <Typography variant="h5" gutterBottom>
                                        Dịch vụ thêm
                                    </Typography>
                                    <MenuSelect menus={menus} handleSelect={handleSelect} selected={selected}/>
                                </Card>
                            </Grid>
                        </Grid>
                    </TransparentPaper>
                </div>
            </div>
        </main>
    );
};

export default EventDetails;
