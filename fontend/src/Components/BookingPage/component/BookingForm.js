import React, { forwardRef } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
    MenuItem,
    Grid,
    Paper,
    TextField,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';


// Tạo một component Paper có nền trong suốt
const TransparentPaper = styled(Paper)({
    padding: 16,
    backgroundColor: 'transparent',
    boxShadow: 'none'
});

// Tạo một TextField tùy chỉnh có nền trắng
const WhiteTextField = styled(({ ...props }) => <Field as={TextField} {...props} />)({
    '& .MuiInputBase-root': {
        color: 'black',
        backgroundColor: 'white',
        borderRadius: 4,
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.23)',
    }
});

const EventForm = forwardRef(({ handleSubmit, maxTable }, ref) => {
    const initialValues = {
        EventType: '',
        TotalTable: '',
        EventDate: null,
        Time: '',
        Note: '',
    };

    // Định nghĩa schema cho validation
const validationSchema = Yup.object().shape({
    EventType: Yup.string().required('Vui lòng chọn loại sự kiện'),
    TotalTable: Yup.number()
        .required('Vui lòng nhập tổng số bàn')
        .positive('Số bàn phải là số dương')
        .integer('Số bàn phải là số nguyên')
        .min(maxTable * 0.7, `Số bàn tối thiểu là ${Math.round(maxTable * 0.7)}`)
        .max(maxTable,`Số bàn tối ta là ${maxTable}`),
    EventDate: Yup.date()
        .required('Vui lòng chọn ngày')
        .min(dayjs().add(1, 'day'), 'Ngày sự kiện phải từ ngày mai trở đi'),
    Time: Yup.string().required('Vui lòng chọn thời gian'),
    Note: Yup.string()
});

    return (
        <TransparentPaper>
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
                                <WhiteTextField
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
                                    <MenuItem value="ORTHER">Khác</MenuItem>
                                </WhiteTextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <WhiteTextField
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
                                    <Field name="EventDate">
                                        {({ field }) => (
                                            <DatePicker
                                                sx={{
                                                    width: "100%",
                                                    '& .MuiInputBase-input': {
                                                        color: 'black',
                                                        backgroundColor: 'white',
                                                    }
                                                }}
                                                label="Ngày"
                                                value={field.value}
                                                slotProps={{
                                                    textField: {
                                                        error: touched.EventDate && Boolean(errors.EventDate),
                                                        helperText: touched.EventDate && errors.EventDate,
                                                    },
                                                }}
                                                onChange={(value) => setFieldValue(field.name, value)}
                                                format='DD/MM/YYYY'
                                            />
                                        )}
                                    </Field>
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <WhiteTextField
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
                                </WhiteTextField>
                            </Grid>
                            <Grid item xs={12}>
                                <WhiteTextField
                                    name="Note"
                                    label="Ghi chú"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    error={touched.Note && Boolean(errors.Note)}
                                    helperText={touched.Note && errors.Note}
                                />
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </TransparentPaper>
    );
});

export default EventForm;