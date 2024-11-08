import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import {
    TextField,
    MenuItem,
    Grid,
    Button,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { sendResetPassword, updateUser, uploadAvatar } from '../../../../redux/actions/userRequest';
import { useDispatch } from 'react-redux';
import { FaEdit } from 'react-icons/fa';
import DropzoneImagePicker from './DropzoneImagePicker';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
    fullname: Yup.string(),
    gender: Yup.string(),
    dayofbirth: Yup.date().nullable().max(new Date(), "Ngày sinh không hợp lệ"),
    address: Yup.string(),
    phone: Yup.string()
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(10, 'Must be exactly 10 digits')
        .max(10, 'Must be exactly 10 digits'),
});

const MyForm = () => {
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user"))?.user || null);
    const dispatch = useDispatch();
    const [edit, setEdit] = useState(false);
    const [open, setOpen] = useState(false); // State to control modal
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDisable, setIsDisable] = useState(false);

    console.log(user)

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleUploadAvatar = async () => {
        if (selectedFile) {
            if (selectedFile?.type.startsWith("image/")) {
                setIsDisable(true)
                const newUser = await uploadAvatar(dispatch, selectedFile, user); // Gọi hàm uploadAvatar
                setUser(newUser); // Cập nhật avatar mới cho user
                setIsDisable(false)
                handleClose(); // Đóng modal
            } else {
                toast.error("Vui lòng chọn một tệp hình ảnh.");
                setIsDisable(false)
            }
        }
        else {
            toast.error("Vui lòng chọn một tệp hình ảnh.");
        }
    };


    const handleResetPassword = async (user) => {
        const confirmReset = window.confirm("Bạn có chắc chắn muốn đổi mật khẩu?");
        if (confirmReset) {
            await sendResetPassword(user, console.log);
        }
    };

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
            onSubmit={async (values) => {
                const res = await updateUser(dispatch, values);
                setUser(res.user);
                setEdit(false);
            }}
        >
            {({ errors, touched, handleChange, values, setFieldValue, resetForm }) => (
                <Form>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4} alignItems="center">
                            <Grid>
                                <Avatar sx={{ width: "200px", height: "200px", margin: "auto" }} src={user.avatar} />
                                <Button
                                    sx={{
                                        position: "relative",
                                        bottom: "40px",
                                        left: "60px",
                                        color: "black",
                                        fontSize: "30px",
                                        padding: 0,
                                    }}
                                    onClick={handleOpen} // Open modal on click
                                >
                                    <FaEdit />
                                </Button>
                            </Grid>

                            <Button
                                sx={{ color: 'red' }}
                                onClick={() => handleResetPassword(user)}
                            >
                                Đổi mật khẩu
                            </Button>
                        </Grid>

                        <Grid item xs={12} sm={8} container spacing={5}>
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
                                    value={values.fullname}
                                    onChange={handleChange}
                                    error={touched.fullname && Boolean(errors.fullname)}
                                    helperText={touched.fullname && errors.fullname}
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
                                    value={values.phone}
                                    onChange={handleChange}
                                    error={touched.phone && Boolean(errors.phone)}
                                    helperText={touched.phone && errors.phone}
                                />
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
                                    value={values.address}
                                    onChange={handleChange}
                                    error={touched.address && Boolean(errors.address)}
                                    helperText={touched.address && errors.address}
                                />
                            </Grid>
                            <Grid xs={12} sm={12} sx={{ marginTop: "20px" }}>
                                {!edit ? (
                                    <Button
                                        variant='contained'
                                        type='button'
                                        title="Sửa"
                                        sx={{ background: "#81695e" }}
                                        onClick={() => setEdit(true)}
                                    >
                                        Sửa
                                    </Button>
                                ) : (
                                    <Grid item>
                                        <Button
                                            title="Lưu"
                                            type="submit"
                                            sx={{ background: "#81695e", marginRight: "10px" }}
                                            variant='contained'
                                        >
                                            Lưu
                                        </Button>
                                        <Button
                                            title="Hủy"
                                            sx={{ background: "lightgrey", color: "black" }}
                                            variant='contained'
                                            onClick={() => {
                                                setEdit(false);
                                                resetForm({ values: { ...user, dayofbirth: dayjs(user.dayofbirth) } });
                                            }}
                                        >
                                            Hủy
                                        </Button>

                                    </Grid>
                                )}
                            </Grid>
                        </Grid>

                    </Grid>

                    {/* Modal for Image Picker */}
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Chọn ảnh mới</DialogTitle>
                        <DialogContent sx={{ justifyItems: "center" }}>
                            <DropzoneImagePicker setSelectedFile={setSelectedFile} />
                            <Button
                                variant='contained'
                                disabled={isDisable}
                                type='button'
                                title="Sửa"
                                sx={{ background: "#81695e", marginTop: "20px" }}
                                onClick={handleUploadAvatar} // Tải lên ảnh khi nhấn nút xác nhận
                            >
                                Xác nhận
                            </Button>
                        </DialogContent>
                    </Dialog>


                </Form>
            )}
        </Formik>
    );
};

export default MyForm;
