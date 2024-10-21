import React, { forwardRef } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
    TextField,
    Button,
    MenuItem,
    Grid,
    Typography,
    Paper,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Định nghĩa schema cho validation
const validationSchema = Yup.object().shape({
    // EventType: Yup.string().required('Vui lòng chọn loại sự kiện'),
    // TotalTable: Yup.number()
    //     .required('Vui lòng nhập tổng số bàn')
    //     .positive('Số bàn phải là số dương')
    //     .integer('Số bàn phải là số nguyên'),
    // EventDate: Yup.date().required('Vui lòng nhập thời gian '),
    // EventOrder: Yup.string().required('Vui lòng nhập thứ tự sự kiện'),
    // RoomEventID: Yup.string().required('Vui lòng nhập ID phòng sự kiện'),
});

const EventForm = forwardRef(({ handleSubmit }, ref) => {
    const initialValues = {
        EventType: '',
        TotalTable: '',
        EventDate: null,
        EventOrder: '',
        RoomEventID: '',
    };

    return (
        <Paper sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
                Nhập Thông Tin Sự Kiện
            </Typography>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                innerRef={ref} // Nhận ref từ HomePage
            >
                {({ errors, touched, setFieldValue }) => (
                    <Form>
                        <Grid container spacing={2}>
                        <Grid item xs={12}>
                                <Field
                                    as={TextField}
                                    name="EventType"
                                    select
                                    label="Loại Sự Kiện"
                                    fullWidth
                                    error={touched.EventType && Boolean(errors.EventType)}
                                    helperText={touched.EventType && errors.EventType}
                                >
                                    <MenuItem value="Wedding">Đám Cưới</MenuItem>
                                    <MenuItem value="Conference">Hội Nghị</MenuItem>
                                    <MenuItem value="Other">Khác</MenuItem>
                                </Field>
                            </Grid>

                            <Grid item xs={12}>
                                <Field
                                    as={TextField}
                                    name="TotalTable"
                                    label="Tổng Số Bàn"
                                    type="number"
                                    fullWidth
                                    error={touched.TotalTable && Boolean(errors.TotalTable)}
                                    helperText={touched.TotalTable && errors.TotalTable}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Field
                                        component={({ field, form }) => (
                                            <DatePicker
                                                label="Thời Gian Bắt Đầu"
                                                value={field.value}
                                                onChange={(value) => {
                                                    setFieldValue(field.name, value);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        error={touched.EventDate && Boolean(errors.EventDate)}
                                                        helperText={touched.EventDate && errors.EventDate}
                                                        fullWidth
                                                    />
                                                )}
                                            />
                                        )}
                                        name="EventDate"
                                    />
                                </LocalizationProvider>
                            </Grid>

                          
                            <Grid item xs={12}>
                                <Field
                                    as={TextField}
                                    name="EventOrder"
                                    label="Thứ Tự Sự Kiện"
                                    fullWidth
                                    error={touched.EventOrder && Boolean(errors.EventOrder)}
                                    helperText={touched.EventOrder && errors.EventOrder}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Field
                                    as={TextField}
                                    name="RoomEventID"
                                    label="ID Phòng Sự Kiện"
                                    fullWidth
                                    error={touched.RoomEventID && Boolean(errors.RoomEventID)}
                                    helperText={touched.RoomEventID && errors.RoomEventID}
                                />
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
});

export default EventForm;
