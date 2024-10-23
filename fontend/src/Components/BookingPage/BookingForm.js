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
    EventType: Yup.string().required('Vui lòng chọn loại sự kiện'),
    TotalTable: Yup.number()
        .required('Vui lòng nhập tổng số bàn')
        .positive('Số bàn phải là số dương')
        .integer('Số bàn phải là số nguyên'),
    EventDate: Yup.date().required('Vui lòng nhập thời gian bắt đầu'),
    Time: Yup.string().required('Vui lòng chọn thời gian'),
});

const EventForm = forwardRef(({ handleSubmit }, ref) => {
    const initialValues = {
        EventType: '',
        TotalTable: '',
        EventDate: null,
        Time: '',
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
                            <Grid item xs={12} sm={6}>
                                <Field
                                    as={TextField}
                                    name="EventType"
                                    select
                                    label="Loại Sự Kiện"
                                    fullWidth
                                    error={touched.EventType && Boolean(errors.EventType)}
                                    helperText={touched.EventType && errors.EventType}
                                >
                                    <MenuItem value="WEDDING">Đám Cưới</MenuItem>
                                    <MenuItem value="CONFERENCE">Hội Nghị</MenuItem>
                                    <MenuItem value="BIRTHDAY">Sinh nhật</MenuItem>
                                    <MenuItem value="OTHER">Khác</MenuItem>
                                </Field>
                            </Grid>
                            <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12} sm={6}>
                                <Field
                                    as={TextField}
                                    name="Time"
                                    select
                                    label="Thời gian"
                                    fullWidth
                                    error={touched.Time && Boolean(errors.Time)}
                                    helperText={touched.Time && errors.Time}
                                >
                                    <MenuItem value="MORNING">Buổi sáng</MenuItem>
                                    <MenuItem value="AFTERNOON">Buổi chiều</MenuItem>
                                    <MenuItem value="ALLDAY">Cả ngày</MenuItem>
                                </Field>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
});

export default EventForm;
