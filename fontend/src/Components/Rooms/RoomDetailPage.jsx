import { useLocation } from "react-router-dom";
import { Card, Grid, Typography, Box, Divider, Button } from "@mui/material";
import Header from "../Header/Header";
import {  useNavigate } from "react-router-dom";

const RoomDetailPage = () => {
    const location = useLocation();
    const roomDetail = location.state?.roomDetail; // Lấy thông tin phòng từ state
    const navigate = useNavigate()
    if (!roomDetail) {
        return <Typography variant="h5" color="error" align="center">Không tìm thấy thông tin phòng.</Typography>;
    }

    return (
        <main className="room-container">
            <Header 
                background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/room-header.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9yb29tLWhlYWRlci5qcGciLCJpYXQiOjE3Mjk4NjU2NDQsImV4cCI6MTc2MTQwMTY0NH0.X1m9vEDzQi-PR17kKxJDvoxcfBTjNmimrzGOFC_F6Eg&t=2024-10-25T14%3A14%3A02.614Z" 
                title="PHÒNG SỰ KIỆN" 
            />
            <div className="room-body">
                <Card sx={{ p: 4, maxWidth: '1200px', margin: 'auto', borderRadius: '12px', boxShadow: 3 }}>
                    {/* Hình ảnh phòng */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                        <img
                            src={roomDetail.RoomImage}
                            alt="room"
                            style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                        />
                    </Box>

                    {/* Thông tin chi tiết phòng */}
                    <Box>
                        <Typography justifyContent={"left"} variant="h3" gutterBottom fontWeight="bold" color="#3e3e3e">
                            {roomDetail.RoomName}
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Typography textAlign={"left"} variant="body1" color="textSecondary" gutterBottom>
                            <strong>Kích thước:</strong> {roomDetail.HeightRoom}m x {roomDetail.WidthRoom}m
                        </Typography>
                        <Typography textAlign={"left"} variant="body1" color="textSecondary" gutterBottom>
                            <strong>Sức chứa:</strong> {roomDetail.Capacity} người | <strong>Số bàn tối đa:</strong> {roomDetail.MaxTable}
                        </Typography>
                        {roomDetail.Rates && roomDetail.Rates.length > 0 && (
                            <Typography variant="body2" color="textSecondary" textAlign={'left'}>
                                <strong>Đánh giá trung bình:</strong> {(
                                    roomDetail.Rates.reduce((sum, rate) => sum + parseInt(rate.Rate), 0) / roomDetail.Rates.length
                                ).toFixed(1)} / 5
                            </Typography>
                        )}
                        <Typography textAlign={"left"} variant="body1" color="textSecondary" gutterBottom>
                            <strong>Mô tả:</strong> {roomDetail.Description}
                        </Typography>
                        <Typography variant="h5" color="#64463c" sx={{ fontWeight: 'bold', mt: 2 }}>
                            Giá: {roomDetail.Price.toLocaleString()} VND
                        </Typography>
                        <Divider sx={{ my: 3 }} />

                        {/* Đánh giá phòng */}
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#444' }} gutterBottom>
                            Đánh giá
                        </Typography>
                        <Card sx={{ maxHeight: "400px", overflowY: "scroll", padding: 2 }}>
                            {roomDetail.Rates && roomDetail.Rates.length > 0 ? (
                                roomDetail.Rates.map((rate, index) => (
                                    <Box key={index} sx={{ mb: 3, p: 2, borderRadius: '8px', backgroundColor: '#f7f7f7' }}>
                                        <Typography textAlign={"left"} variant="body2" color="textSecondary">
                                            <strong>Khách hàng:</strong> {rate.Email}
                                        </Typography>
                                        <Typography textAlign={"left"} variant="body2" color="textSecondary">
                                            <strong>Đánh giá phòng:</strong> {rate.Rate} / 5
                                        </Typography>
                                        <Typography textAlign={"left"} variant="body2" color="textSecondary">
                                            <strong>Đánh giá dịch vụ:</strong> {rate.RateService} / 5
                                        </Typography>
                                        <Typography textAlign={"left"} variant="body2" color="textSecondary">
                                            <strong>Bình luận:</strong> {rate.Comment}
                                        </Typography>
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2" color="textSecondary">Chưa có đánh giá cho phòng này.</Typography>
                            )}
                        </Card>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Grid container justifyContent="center">
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ fontSize: '1rem', borderRadius: '8px', padding: '10px 20px', textTransform: 'none' }}
                            onClick={() => navigate(`/room_booking/${roomDetail.RoomEventID}`)}
                        >
                            Đặt ngay
                        </Button>
                    </Grid>
                </Card>
            </div>
        </main>
    );
};

export default RoomDetailPage;
