import React, { forwardRef, useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
    Button,
    Grid,
    MenuItem,
    Paper,
    TextField,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { getRoomBooked } from '../../../redux/actions/eventRequest';
import { useDispatch, useSelector } from 'react-redux';

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


const EventForm = forwardRef(({ handleSubmit, setFrom, setTo }, ref) => {
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const requireDay = useSelector((state) => state.requireDay.numberDay)
    const [numberDay, setNumberDay] = useState(1)
    useEffect(() => {
        mergeTimeSlots(selectedTimes);
    }, [selectedTimes, selectedDate]);

    useEffect(() => {
        if(requireDay){
        setNumberDay(requireDay?.NumberDay)
    }
    }, requireDay)

    const handleChangeDate = (setFieldValue, name, value) => {
        setSelectedDate(value);
        setFieldValue(name, value);
        setSelectedTimes([]);
    }
    const mergeTimeSlots = (slots) => {
        const first = slots[0];
        const last = slots[slots.length - 1];

        const newDate = selectedDate // Tạo một đối tượng Date với thời gian hiện tại

        // Lấy giờ từ khoảng thời gian đầu và cuối
        const fromTime = first?.split(':')[0];  // Tách giờ từ phần đầu tiên
        const toTime = last?.split(' - ')[1]?.split(':')[0];  // Tách giờ từ phần cuối cùng

        // Thiết lập giờ cho đối tượng Date mới, không thay đổi đối tượng ban đầu
        const newDateFrom = new Date(newDate);  // Tạo một bản sao của newDate
        newDateFrom.setHours(parseInt(fromTime));
        newDateFrom.setMinutes(0)
        newDateFrom.setSeconds(0)
        console.log(newDateFrom)
        setFrom(newDateFrom)

        const newDateTo = new Date(newDate);  // Tạo bản sao khác để thay đổi giờ
        newDateTo.setHours(parseInt(toTime));
        newDateTo.setMinutes(0)
        newDateTo.setSeconds(0)
        setTo(newDateTo)
    };


    const generateTimeSlots = (startHour, endHour, interval) => {
        const slots = [];
        for (let hour = startHour; hour < endHour; hour++) {
            const start = `${String(hour).padStart(2, "0")}:00`;
            const end = `${String(hour + interval).padStart(2, "0")}:00`;
            slots.push({ start, end });
        }
        return slots;
    };


    const timeSlots = generateTimeSlots(8, 23, 1); // Khoảng 1 giờ, từ 8h sáng đến 11h tối

    const toggleTimeSelection = (time) => {
        const [start] = time.split(" - ");
        const selectedStartTimes = selectedTimes.map((t) => t.split(" - ")[0]);

        // Kiểm tra xem thời gian mới có liền kề với các thời gian đã chọn không
        const isAdjacent = selectedStartTimes.some((selectedStart) =>
            dayjs(selectedStart, "HH:mm").add(1, "hour").format("HH:mm") === start ||
            dayjs(selectedStart, "HH:mm").subtract(1, "hour").format("HH:mm") === start
        );

        // Nếu thời gian đã được chọn, bỏ chọn và loại bỏ các button phía sau
        if (selectedTimes.includes(time)) {
            const index = selectedTimes.indexOf(time);
            const newSelectedTimes = selectedTimes.slice(0, index);
            setSelectedTimes(newSelectedTimes);
        } else {
            // Nếu chưa được chọn, kiểm tra nếu thời gian này không liền kề với thời gian đã chọn
            if (selectedTimes.length === 0 || isAdjacent) {
                setSelectedTimes((prevSelectedTimes) => {
                    // Thêm vào nếu không có thời gian nào được chọn hoặc là thời gian liền kề
                    return [...prevSelectedTimes, time].sort();
                });
            } else {
                // Nếu chọn 2 button không liền kề, chọn tất cả button nằm giữa
                const [firstStart] = selectedTimes[0].split(" - ");
                const selectedStart = dayjs(firstStart, "HH:mm");
                const newStart = dayjs(start, "HH:mm");
                const rangeStart = selectedStart.isBefore(newStart) ? selectedStart : newStart;
                const rangeEnd = selectedStart.isBefore(newStart) ? newStart : selectedStart;
                const newSelectedTimes = [];

                // Chọn tất cả các thời gian nằm giữa
                timeSlots.forEach((slot) => {
                    const slotStart = dayjs(slot.start, "HH:mm");
                    if (slotStart.isBetween(rangeStart, rangeEnd, null, "[]")) {
                        newSelectedTimes.push(`${slot.start} - ${slot.end}`);
                    }
                });

                setSelectedTimes((prevSelectedTimes) => {
                    // Thêm các thời gian mới vào và sắp xếp lại
                    return [...prevSelectedTimes, ...newSelectedTimes].sort();
                });
            }
        }
    };

    const initialValues = {
        EventType: '',
        TotalTable: '',
        EventDate: null,
        Time: '',
    };
    console.log(requireDay)
    // Định nghĩa schema cho validation
    const validationSchema = Yup.object().shape({
        EventType: Yup.string().required('Vui lòng chọn loại sự kiện'),
        TotalTable: Yup.number()
            .required('Vui lòng nhập tổng số bàn')
            .positive('Số bàn phải là số dương')
            .integer('Số bàn phải là số nguyên'),
        EventDate: Yup.date()
            .required('Vui lòng chọn ngày')
            .min(dayjs().add(numberDay, 'day'), `Ngày sự kiện phải đặt trước ${numberDay} ngày} `),
        Time: Yup.string().required('Vui lòng chọn thời gian'),
        Note: Yup.string(),
    });


    return (
        <TransparentPaper>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    handleSubmit(values);
                }}
                innerRef={ref} // Nhận ref từ HomePage
            >
                {({ errors, touched, setFieldValue, values }) => (
                    <Form>
                        <Grid container spacing={2} justifyItems='center' justifyContent={'center'}>
                            <Grid item xs={2.5}>
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
                                    <MenuItem value="OTHER">Khác</MenuItem>
                                </WhiteTextField>
                            </Grid>
                            <Grid item xs={2.5}>
                                <WhiteTextField
                                    name="TotalTable"
                                    label="Tổng Số Bàn"
                                    type="number"
                                    fullWidth
                                    error={touched.TotalTable && Boolean(errors.TotalTable)}
                                    helperText={touched.TotalTable && errors.TotalTable}
                                />
                            </Grid>
                            <Grid item xs={2.5}>

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
                                                onChange={(value) => handleChangeDate(setFieldValue, field.name, value)}
                                                format='DD/MM/YYYY'
                                            />
                                        )}
                                    </Field>
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={2.5}>
                                <WhiteTextField
                                    name="Time"
                                    select
                                    label="Thời gian"
                                    fullWidth
                                    disabled={selectedDate === null}
                                    error={touched.Time && Boolean(errors.Time)}
                                    helperText={touched.Time && errors.Time}
                                >
                                    <MenuItem value="MORNING" >Buổi sáng (8:00-14:00)</MenuItem>
                                    <MenuItem value="AFTERNOON" >Buổi chiều (16:00-23:00)</MenuItem>
                                    <MenuItem value="ALLDAY" >Cả ngày</MenuItem>
                                    <MenuItem value="CUSTOM">Tùy chỉnh</MenuItem>                                    </WhiteTextField>
                            </Grid>
                            <Grid item xs={1} alignContent='center'>
                                <Button variant='contained' type='submit'>Tìm</Button>
                            </Grid>

                        </Grid>
                        {(selectedDate && values.Time === "CUSTOM") &&
                            <Grid item xs={12}>
                                <Grid container spacing={1}>
                                    {timeSlots.map((slot, index) => (
                                        <Grid item key={index}>
                                            <Button
                                                variant={selectedTimes.includes(`${slot.start} - ${slot.end}`) ? "contained" : "outlined"}
                                                onClick={() => toggleTimeSelection(`${slot.start} - ${slot.end}`)}
                                            >
                                                {`${slot.start} - ${slot.end}`}
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        }

                    </Form>
                )}
            </Formik>
        </TransparentPaper>
    );
});

export default EventForm;