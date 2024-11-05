import React, { useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import { getAllRooms, addRoom, updateRoom, deleteRoom, updateRoomHaveImage, updateRoomNoImage } from "../../../../redux/actions/roomRequest"; // Đảm bảo đường dẫn đúng
import { useState } from "react";
import RoomFormModal from './RoomModal'; // Đảm bảo đường dẫn đúng
import { toast } from "react-toastify";

const Room = ({rooms}) => {
    const dispatch = useDispatch();
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [selectedImage, setSelectedImage] = useState();

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
                RoomImage: ''
            });
            setEditMode(false);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

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
        }
    };

    return (
        <div>
            <TableContainer component={Paper} title="Danh sách phòng">
                <Table stickyHeader aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Tên phòng</TableCell>
                            <TableCell>Chiều dài</TableCell>
                            <TableCell>Chiều rộng</TableCell>
                            <TableCell>Sức chứa</TableCell>
                            <TableCell>Số bàn tối đa</TableCell>
                            <TableCell>Giá</TableCell>
                            <TableCell>Mô tả</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rooms?.map((room) => (
                            <TableRow key={room?.RoomEventID}>
                                <TableCell><img src={room.RoomImage} height={100} width={140} alt={room.RoomName} /></TableCell>
                                <TableCell>{room.RoomName}</TableCell>
                                <TableCell>{room.HeightRoom}</TableCell>
                                <TableCell>{room.WidthRoom}</TableCell>
                                <TableCell>{room.Capacity}</TableCell>
                                <TableCell>{room.MaxTable}</TableCell>
                                <TableCell>{room.Price}</TableCell>
                                <TableCell sx={{ height: '140px', maxHeight: '140px', overflowY: 'auto', display: 'block', alignContent: "center" }}>{room.Description}</TableCell>
                                <TableCell>{room.Status}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleOpenDialog(room)}>Sửa</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button sx={{ marginTop: "20px" }} variant="contained" color="primary" onClick={() => handleOpenDialog()}>Thêm phòng</Button>
            <RoomFormModal
                open={openDialog}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
                initialValues={formData}
                editMode={editMode}
                setSelectedImage={setSelectedImage}
                handleDeleteRoom={handleDeleteRoom}
            />
        </div>
    );
};

export default Room;
