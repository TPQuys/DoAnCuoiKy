import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import {
    TextField,
    MenuItem,
    Grid,
    Button,
    Avatar,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { updateUser } from '../../redux/actions/userRequest';
import { useDispatch } from 'react-redux';

const validationSchema = Yup.object({
    fullname: Yup.string(),
    gender: Yup.string(),
    dayofbirth: Yup.date().nullable().max(new Date(),"Ngày sinh không hợp lệ"),
    address: Yup.string(),
    phone: Yup.string()
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(10, 'Must be exactly 10 digits')
        .max(10, 'Must be exactly 10 digits'),
});

const MyForm = () => {
    const user = JSON.parse(sessionStorage.getItem("user"))?.user || null
    const dispatch = useDispatch()
    const [edit, setEdit] = useState(false)
    return (
        <Formik
            initialValues={{
                fullname: user.fullname,
                gender: user.gender || '',
                dayofbirth: user.dayofbirth ? dayjs(user.dayofbirth) : null,
                address: user.address || '',
                phone: user.phone || '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                updateUser(dispatch,values)
                console.log(values)
            }}
        >
            {({ errors, touched, handleChange, values, setFieldValue }) => (
                <Form>
                    <Avatar sx={{ width: "200px", height: "200px" }} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                sx={{
                                    '& .MuiInputBase-input.Mui-disabled': {
                                        WebkitTextFillColor: 'black',
                                    },
                                }}
                                name="fullname"
                                label="Họ tên"
                                fullWidth
                                disabled={!edit}
                                value={values.fullname} // Thêm dòng này
                                onChange={handleChange} // Thêm dòng này
                                error={touched.fullname && Boolean(errors.fullname)}
                                helperText={touched.fullname && errors.fullname}
                            >
                            </TextField>
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
                                disabled={!edit}
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
                                                    // backgroundColor: 'white',
                                                },
                                                '& .MuiInputBase-input.Mui-disabled': {
                                                    WebkitTextFillColor: 'black',
                                                },
                                            }}
                                            label="Ngày sinh"
                                            disabled={!edit}
                                            value={field.value}
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
                                name="phone"
                                label="Số điện thoại"
                                disabled={!edit}
                                fullWidth
                                sx={{
                                    '& .MuiInputBase-input.Mui-disabled': {
                                        WebkitTextFillColor: 'black',
                                    },
                                }}     
                                value={values.phone} // Thêm dòng này
                                onChange={handleChange} // Thêm dòng này
                                error={touched.phone && Boolean(errors.phone)}
                                helperText={touched.phone && errors.phone}
                                
                            >
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="address"
                                disabled={!edit}
                                label="Địa chỉ"
                                fullWidth
                                sx={{
                                    '& .MuiInputBase-input.Mui-disabled': {
                                        WebkitTextFillColor: 'black',
                                    },
                                }}
                                value={values.address} // Thêm dòng này
                                onChange={handleChange} // Thêm dòng này
                                error={touched.address && Boolean(errors.address)}
                                helperText={touched.address && errors.address}
                            >
                            </TextField>
                        </Grid>
                    </Grid>
                    {!edit ? (
                        <Button type='button' title="Sửa" onClick={() => setEdit(true)} >Sửa</Button>
                    ) : (
                        <Grid item xs={12} sm={6}>

                            <Button title="Lưu" type="submit" >Lưu</Button>
                            <Button title="Hủy" onClick={() => setEdit(false)} >Hủy</Button>
                        </Grid>
                    )}
                </Form>
            )}
        </Formik>
    );
};

export default MyForm;
