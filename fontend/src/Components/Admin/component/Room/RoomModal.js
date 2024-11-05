import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Grid, MenuItem } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import DropZone from './DropzoneImagePicker';

const RoomFormModal = ({ open, onClose, onSubmit, initialValues, editMode, setSelectedImage, handleDeleteRoom }) => {
    const [isDisable, setIsDisable] = useState(false)
    console.log(initialValues)
    const validationSchema = Yup.object().shape({
        RoomName: Yup.string().required("Tên phòng là bắt buộc"),
        HeightRoom: Yup.number().required("Chiều cao là bắt buộc").positive("Chiều cao phải là số dương"),
        WidthRoom: Yup.number().required("Chiều rộng là bắt buộc").positive("Chiều rộng phải là số dương"),
        Capacity: Yup.number().required("Sức chứa là bắt buộc").positive("Sức chứa phải là số dương"),
        MaxTable: Yup.number().required("Số bàn tối đa là bắt buộc").positive("Số bàn tối đa phải là số dương"),
        Price: Yup.number().required("Giá là bắt buộc").positive("Giá phải là số dương"),
        Description: Yup.string().required("Mô tả là bắt buộc"),
    });

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{editMode ? "Cập nhật phòng" : "Thêm phòng"}</DialogTitle>
            <DialogContent>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        setIsDisable(true)
                        await onSubmit(values)
                        setIsDisable(false)
                    }}
                >
                    {({ handleChange, values, errors, touched }) => (
                        <Form>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        name="RoomName"
                                        label="Tên phòng"
                                        type="text"
                                        fullWidth
                                        value={values.RoomName}
                                        onChange={handleChange}
                                        error={touched.RoomName && Boolean(errors.RoomName)}
                                        helperText={touched.RoomName && errors.RoomName}
                                    />
                                    <TextField
                                        margin="dense"
                                        name="HeightRoom"
                                        label="Chiều dài"
                                        type="number"
                                        fullWidth
                                        value={values.HeightRoom}
                                        onChange={handleChange}
                                        error={touched.HeightRoom && Boolean(errors.HeightRoom)}
                                        helperText={touched.HeightRoom && errors.HeightRoom}
                                    />
                                    <TextField
                                        margin="dense"
                                        name="WidthRoom"
                                        label="Chiều rộng"
                                        type="number"
                                        fullWidth
                                        value={values.WidthRoom}
                                        onChange={handleChange}
                                        error={touched.WidthRoom && Boolean(errors.WidthRoom)}
                                        helperText={touched.WidthRoom && errors.WidthRoom}
                                    />
                                    <TextField
                                        margin="dense"
                                        name="Capacity"
                                        label="Sức chứa"
                                        type="number"
                                        fullWidth
                                        value={values.Capacity}
                                        onChange={handleChange}
                                        error={touched.Capacity && Boolean(errors.Capacity)}
                                        helperText={touched.Capacity && errors.Capacity}
                                    />
                                    <TextField
                                        margin="dense"
                                        name="MaxTable"
                                        label="Số bàn tối đa"
                                        type="number"
                                        fullWidth
                                        value={values.MaxTable}
                                        onChange={handleChange}
                                        error={touched.MaxTable && Boolean(errors.MaxTable)}
                                        helperText={touched.MaxTable && errors.MaxTable}
                                    />
                                    <TextField
                                        margin="dense"
                                        name="Price"
                                        label="Giá"
                                        type="number"
                                        fullWidth
                                        value={values.Price}
                                        onChange={handleChange}
                                        error={touched.Price && Boolean(errors.Price)}
                                        helperText={touched.Price && errors.Price}
                                    />
                                    <TextField
                                        margin="dense"
                                        name="Status"
                                        label="Trạng thái"
                                        select
                                        fullWidth
                                        value={values.Status}
                                        onChange={handleChange}
                                        error={touched.Price && Boolean(errors.Price)}
                                        helperText={touched.Price && errors.Price}
                                    >
                                        <MenuItem value="OPEN">OPEN</MenuItem>
                                        <MenuItem value="CLOSE">CLOSE</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <DialogContent>Chọn ảnh phòng:</DialogContent>
                                    <DropZone setSelectedFile={setSelectedImage} imageUrl={initialValues?.RoomImage} />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        name="Description"
                                        label="Mô tả"
                                        type="text"
                                        multiline={3}
                                        fullWidth
                                        required
                                        value={values.Description}
                                        onChange={handleChange}
                                        error={touched.Description && Boolean(errors.Description)}
                                        helperText={touched.Description && errors.Description}
                                    />
                                </Grid>
                            </Grid>
                            <DialogActions>
                                <Button onClick={onClose} color="primary">Hủy</Button>
                                <Button type="submit" color="primary" disabled={isDisable}>{editMode ? "Cập nhật" : "Thêm"}</Button>
                                <Button color="error" onClick={()=>handleDeleteRoom(initialValues.RoomEventID)} >Xóa</Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog >
    );
};

export default RoomFormModal;
