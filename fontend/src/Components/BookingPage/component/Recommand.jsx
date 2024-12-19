import { Box, Card, Grid, Typography } from "@mui/material"

const Recommand = ({ availableRoom, navigate }) => (

    <Card sx={{ position: 'fixed', height: 'auto', width: 300, top: 250, right: availableRoom.length < 1 ? -300 : 20, zIndex: 100, transition: 'right 0.3s ease', }}>
        <Typography m={1} variant='h6' fontWeight={600}>Phòng gợi ý </Typography>
        {availableRoom.map((room) => (
            <Box key={room.RoomEventID}
                onClick={() =>
                    navigate(`/room/${room.RoomEventID}`, {
                        state: { roomDetail: room }, // Truyền thông tin phòng qua state
                    })
                }
                sx={{
                    backgroundColor: '#fff', // Màu nền sáng
                    borderRadius: '10px', // Bo góc mềm mại
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Đổ bóng nhẹ cho hộp
                    overflow: 'hidden', // Đảm bảo các phần tử không bị tràn ra ngoài
                    '&:hover': {
                        cursor: 'pointer', // Hiển thị con trỏ tay khi hover
                        transform: 'scale(1.05)', // Tăng kích thước một chút khi hover
                        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)', // Tăng bóng đổ khi hover
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Hiệu ứng mượt mà khi hover
                    },
                    '&:active': {
                        transform: 'scale(0.98)', // Thu nhỏ khi click
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)', // Giảm bóng đổ khi click
                    },
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Hiệu ứng chuyển tiếp mượt mà
                }}
            >
                <Box sx={{ padding: 2 }}>
                    {/* Phần tiêu đề */}
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 'bold',
                            color: '#333', // Màu chữ tối cho tiêu đề
                            marginBottom: 1,
                        }}
                    >
                        {room.RoomName}
                    </Typography>

                    <Grid container spacing={2}>
                        {/* Hình ảnh phòng */}
                        <Grid item xs={12} sm={7}>
                            <img
                                src={room.RoomImage}
                                alt={room.RoomName}
                                style={{
                                    width: '100%',
                                    objectFit: 'cover', // Đảm bảo hình ảnh không bị vỡ tỷ lệ
                                }}
                            />
                        </Grid>

                        {/* Thông tin chi tiết phòng */}
                        <Grid item xs={12} sm={5} textAlign="left">
                            <Typography variant="body2" sx={{ color: '#555', marginBottom: 1 }}>
                                <strong>Sức chứa:</strong> {room.Capacity}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555', marginBottom: 1 }}>
                                <strong>Số bàn:</strong> {room.MaxTable}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555', marginBottom: 1 }}>
                                <strong>Chiều dài:</strong> {room.HeightRoom}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555', marginBottom: 1 }}>
                                <strong>Chiều rộng:</strong> {room.WidthRoom}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>


        ))}
    </Card>
)

export default Recommand;