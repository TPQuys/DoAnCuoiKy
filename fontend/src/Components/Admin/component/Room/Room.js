import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Card, Grid, FormControl, TextField, Typography, InputAdornment } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { addRoom, deleteRoom, updateRequireDay, updateRoomHaveImage, updateRoomNoImage } from "../../../../redux/actions/roomRequest"; // Đảm bảo đường dẫn đúng
import { useState } from "react";
import RoomFormModal from './RoomModal'; // Đảm bảo đường dẫn đúng
import { toast } from "react-toastify";
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';

const Room = ({ rooms }) => {
    const dispatch = useDispatch();
    const requireDay = useSelector((state) => state.requireDay.numberDay)
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [selectedImage, setSelectedImage] = useState();
    const [numberDay, setNumberDay] = useState(requireDay.NumberDay)
    const [filterText, setFilterText] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

    const handleOpenDialog = (room = null) => {
        if (room) {
            setFormData(room);
            setEditMode(true);
        } else {
            setFormData({
                RoomEventID: '',
                RoomName: '',
                HeightRoom: '',
                WidthRoom: '',
                Capacity: '',
                MaxTable: '',
                Price: '',
                Description: '',
                RoomImage: '',
                RequireDay: '',
            });
            setEditMode(false);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const filteredAndSortedRooms = rooms
        ?.filter((room) =>
            room.RoomName.toLowerCase().includes(filterText.toLowerCase()) ||
            room.Description.toLowerCase().includes(filterText.toLowerCase())
        )
        ?.sort((a, b) => {
            if (sortConfig.key) {
                const direction = sortConfig.direction === 'asc' ? 1 : -1;
                if (a[sortConfig.key] < b[sortConfig.key]) return -1 * direction;
                if (a[sortConfig.key] > b[sortConfig.key]) return 1 * direction;
                return 0;
            }
            return 0;
        });


    const handleSubmit = async (data) => {
        try {
            // Hàm kiểm tra tệp có phải là hình ảnh hay không
            const isImageFile = (file) => file?.type.startsWith("image/");

            if (editMode) {
                // Cập nhật phòng
                if (selectedImage) {
                    if (isImageFile(selectedImage)) {
                        await updateRoomHaveImage(dispatch, data, selectedImage);
                    } else {
                        toast.error("Vui lòng chọn một tệp hình ảnh.");
                        return; // Kết thúc hàm nếu không phải hình ảnh
                    }
                } else {
                    await updateRoomNoImage(dispatch, data);
                }
            } else {
                // Thêm phòng
                if (selectedImage && isImageFile(selectedImage)) {
                    await addRoom(dispatch, data, selectedImage);
                } else {
                    toast.error("Vui lòng chọn một tệp hình ảnh.");
                    return; // Kết thúc hàm nếu không phải hình ảnh
                }
            }

            // Đóng dialog sau khi hoàn thành
            handleCloseDialog();
            return true;
        } catch (error) {
            console.error("Error during submit:", error);
            toast.error("Đã có lỗi xảy ra, vui lòng thử lại!"); // Thêm thông báo lỗi
            return false;
        }
    };


    const handleDeleteRoom = (roomId) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa phòng này?");
        if (confirmDelete) {
            deleteRoom(dispatch, roomId);
            handleCloseDialog();
        }
    };

    return (
        <Grid container sx={{ height: '100%'}}>
            <Grid item xs={10} sx={{ display: 'flex', flexDirection: 'column' }}>
                <TableContainer component={Paper} title="Danh sách phòng" sx={{ maxHeight: '700px', overflowY: 'auto', flex: 1 }}>
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}></TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Tên phòng</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Chiều dài</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Chiều rộng</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Sức chứa</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Số bàn tối đa</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Số ngày yêu cầu đặt trước</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Giá</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Mô tả</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredAndSortedRooms?.map((room) => (
                                <TableRow key={room?.RoomEventID}>
                                    <TableCell><img src={room.RoomImage} height={100} width={140} alt={room.RoomName} /></TableCell>
                                    <TableCell>{room.RoomName}</TableCell>
                                    <TableCell>{room.HeightRoom}</TableCell>
                                    <TableCell>{room.WidthRoom}</TableCell>
                                    <TableCell>{room.Capacity}</TableCell>
                                    <TableCell>{room.MaxTable}</TableCell>
                                    <TableCell>{room.RequireDay}</TableCell>
                                    <TableCell>{room.Price}</TableCell>
                                    <TableCell sx={{ height: '140px', maxHeight: '140px', overflowY: 'auto', display: 'block', alignContent: "center" }}>{room.Description}</TableCell>
                                    <TableCell>{room.Status}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleOpenDialog(room)} color="primary">
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button sx={{ marginTop: "20px" }} variant="contained" color="primary" onClick={() => handleOpenDialog()}>Thêm phòng</Button>
            </Grid>
            <Grid item xs={2} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Card sx={{ flex: 1, p: 2 }}>
                    <Typography variant="h4" gutterBottom>
                        Thiết lập chung
                    </Typography>
                    <Grid container marginBottom={2}>
                        <Grid item xs={8}>
                            <TextField
                                label="Số ngày yêu cầu đặt trước"
                                variant="outlined"
                                fullWidth
                                value={numberDay}
                                onChange={(e) => { setNumberDay(e.target.value) }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Button onClick={(() => updateRequireDay(dispatch, numberDay))}>Lưu</Button>
                        </Grid>
                    </Grid>


                    <TextField
                        sx={{ mb: 2 }}
                        fullWidth
                        label="Tìm kiếm"
                        variant="outlined"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        sx={{ mb: 2 }}
                        select
                        label="Sắp xếp theo"
                        fullWidth
                        SelectProps={{
                            native: true,
                        }}
                        onChange={(e) => {
                            const [key, direction] = e.target.value.split(':');
                            setSortConfig({ key, direction });
                        }}
                    >
                        <option value=""></option>
                        <option value="RoomName:asc">Tên phòng (A-Z)</option>
                        <option value="RoomName:desc">Tên phòng (Z-A)</option>
                        <option value="Price:asc">Giá (Thấp đến Cao)</option>
                        <option value="Price:desc">Giá (Cao đến Thấp)</option>
                        <option value="Capacity:asc">Sức chứa (Thấp đến Cao)</option>
                        <option value="Capacity:desc">Sức chứa (Cao đến Thấp)</option>
                    </TextField>
                </Card>
            </Grid>
            <RoomFormModal
                open={openDialog}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
                initialValues={formData}
                editMode={editMode}
                setSelectedImage={setSelectedImage}
                handleDeleteRoom={handleDeleteRoom}
            />
        </Grid>


    );
};

export default Room;
