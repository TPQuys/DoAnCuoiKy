import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Grid, MenuItem } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const EditUserModal = ({ open, onClose, onSubmit, initialValues }) => {
    const [isDisable, setIsDisable] = useState(false);
    
    // Xác thực thông tin người dùng
    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
        fullname: Yup.string().required("Họ và tên là bắt buộc"),
        phone: Yup.string().required("Số điện thoại là bắt buộc"),
        role: Yup.string().required("Vai trò là bắt buộc")
    });

    console.log(initialValues)

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogContent>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        setIsDisable(true);
                        await onSubmit(values);
                        setIsDisable(false);
                    }}
                >
                    {({ handleChange, values, errors, touched,setFieldValue }) => (
                        <Form>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        name="email"
                                        label="Email"
                                        type="email"
                                        fullWidth
                                        value={values.email}
                                        onChange={handleChange}
                                        error={touched.email && Boolean(errors.email)}
                                        helperText={touched.email && errors.email}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        margin="dense"
                                        name="fullname"
                                        label="Họ và tên"
                                        type="text"
                                        fullWidth
                                        value={values.fullname}
                                        onChange={handleChange}
                                        error={touched.fullname && Boolean(errors.fullname)}
                                        helperText={touched.fullname && errors.fullname}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        margin="dense"
                                        name="phone"
                                        label="Số điện thoại"
                                        type="text"
                                        fullWidth
                                        value={values.phone}
                                        onChange={handleChange}
                                        error={touched.phone && Boolean(errors.phone)}
                                        helperText={touched.phone && errors.phone}
                                    />
                                </Grid>
                            
                                <Grid item xs={12} sm={6}>
                                <TextField
                                    sx={{
                                        '& .MuiInputBase-input.Mui-disabled': {
                                            WebkitTextFillColor: 'black',
                                        },
                                    }}
                                    name="gender"
                                    select
                                    label="Giới tính"
                                    fullWidth
                                    value={values.gender}
                                    onChange={handleChange}
                                    error={touched.gender && Boolean(errors.gender)}
                                    helperText={touched.gender && errors.gender}
                                >
                                    <MenuItem value=""></MenuItem>
                                    <MenuItem value="male">Nam</MenuItem>
                                    <MenuItem value="female">Nữ</MenuItem>
                                    <MenuItem value="orther">Khác</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Field name="dayofbirth">
                                        {({ field }) => (
                                            <DatePicker
                                                sx={{
                                                    width: "100%",
                                                    '& .MuiInputBase-input': {
                                                        color: 'black',
                                                    },
                                                    '& .MuiInputBase-input.Mui-disabled': {
                                                        WebkitTextFillColor: 'black',
                                                    },
                                                }}
                                                label="Ngày sinh"
                                                value={field?.value}
                                                onChange={(newValue) => setFieldValue(field.name, newValue)}
                                                slotProps={{
                                                    textField: {
                                                        error: touched.dayofbirth && Boolean(errors.dayofbirth),
                                                        helperText: touched.dayofbirth && errors.dayofbirth,
                                                    },
                                                }}
                                                format='DD/MM/YYYY'
                                            />
                                        )}
                                    </Field>
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="address"
                                    label="Địa chỉ"
                                    fullWidth
                                    sx={{
                                        '& .MuiInputBase-input.Mui-disabled': {
                                            WebkitTextFillColor: 'black',
                                        },
                                    }}
                                    value={values.address}
                                    onChange={handleChange}
                                    error={touched.address && Boolean(errors.address)}
                                    helperText={touched.address && errors.address}
                                />
                            </Grid>
                            </Grid>
                            <DialogActions>
                                <Button onClick={onClose} color="primary">Hủy</Button>
                                <Button type="submit" color="primary" disabled={isDisable}>
                                    Cập nhật
                                </Button>

                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default EditUserModal;
