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
import { useDispatch } from 'react-redux';

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

const EventForm = forwardRef(({ handleSubmit, maxTable, setFrom, setTo, RoomEventID }, ref) => {
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [bookedSlots, setBookedSlots] = useState([]);
    useEffect(() => {
        mergeTimeSlots(selectedTimes);
    }, [selectedTimes, selectedDate]);

    useEffect(() => {
        const fetchRoomBooked = async () => {
            if (selectedDate) {
                try {
                    const res = await getRoomBooked(RoomEventID, selectedDate);
                    console.log(res)
                    setBookedSlots(res)
                } catch (error) {
                    console.error("Error fetching room booked data:", error);
                }
            }
        };

        fetchRoomBooked();
    }, [selectedDate]);

    const isSlotDisabled = (slotStart, slotEnd, bookedSlots) => {
        const selectDate = new Date(selectedDate);

        const timezoneOffset = 7 * 60;
        const selectDateInICT = new Date(selectDate.getTime() + timezoneOffset * 60000);

        const slotStartTime = new Date(selectDateInICT.toISOString().split('T')[0] + `T${slotStart}:00.000+07:00`);
        const slotEndTime = new Date(selectDateInICT.toISOString().split('T')[0] + `T${slotEnd}:00.000+07:00`);

        return bookedSlots.some(({ From, To }) => {
            const fromTime = new Date(From);
            const toTime = new Date(To);
            return slotStartTime >= fromTime && slotEndTime <= toTime;
        });
    };

    const handleChangeDate = (setFieldValue, name, value) => {
        setSelectedDate(value);
        setFieldValue(name, value);
        if (maxTable >= 5) {
            setFieldValue('Time', '');
        }else{
            setFieldValue('Time', 'CUSTOM');
            setFieldValue('TotalTable', 1);
        }
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

    const bookedTimes = bookedSlots.map(item => item.Time);

    const disableAllDay = bookedTimes.includes('MORNING') || bookedTimes.includes('AFTERNOON');


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
        TotalTable: (maxTable <= 5) ? 1 : '',
        EventDate: null,
        Time: maxTable <= 5 ? "CUSTOM" : '',
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
            .max(maxTable, `Số bàn tối đa là ${maxTable}`),
        EventDate: Yup.date()
            .required('Vui lòng chọn ngày')
            .test(
                'check-date',
                'Ngày đặt phải trước 3 ngày với hơn 30 bàn, 4 ngày với hơn 50 bàn, và 6 ngày với hơn 90 bàn',
                function (value) {
                    const { TotalTable } = this.parent; // Lấy giá trị từ TotalTable
                    if (!value) return false;

                    // Tính số ngày tối thiểu
                    const today = dayjs();
                    const eventDate = dayjs(value);
                    let minDays = 1; // Mặc định tối thiểu là từ ngày mai

                    if (TotalTable > 30 && TotalTable <= 50) {
                        minDays = 3;
                    } else if (TotalTable > 50 && TotalTable <= 90) {
                        minDays = 4;
                    } else if (TotalTable > 90) {
                        minDays = 6;
                    }

                    return eventDate.isAfter(today.add(minDays, 'day'));
                }
            ),
        Time: Yup.string().required('Vui lòng chọn thời gian'),
        Note: Yup.string(),
    });



    return (
        <TransparentPaper>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    handleSubmit({ ...values, Time: selectedTimes });
                }}
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
                                     {maxTable >= 5 && <MenuItem value="WEDDING">Đám Cưới</MenuItem>}
                                    <MenuItem value="CONFERENCE">Hội Nghị</MenuItem>
                                    <MenuItem value="BIRTHDAY">Sinh nhật</MenuItem>
                                    <MenuItem value="OTHER">Khác</MenuItem>
                                </WhiteTextField>
                            </Grid>
                            {maxTable > 5 &&
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
                            }
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
                                                onChange={(value) => handleChangeDate(setFieldValue, field.name, value)}
                                                format='DD/MM/YYYY'
                                            />
                                        )}
                                    </Field>
                                </LocalizationProvider>
                            </Grid>
                            {maxTable > 5 &&
                                <Grid item xs={12} sm={6}>
                                    <WhiteTextField
                                        name="Time"
                                        select
                                        label="Thời gian"
                                        fullWidth
                                        disabled={selectedDate === null}
                                        error={touched.Time && Boolean(errors.Time)}
                                        helperText={touched.Time && errors.Time}
                                    >
                                        <MenuItem value="MORNING" disabled={bookedTimes?.includes('MORNING')||bookedTimes?.includes('ALLDAY')}>Buổi sáng</MenuItem>
                                        <MenuItem value="AFTERNOON" disabled={bookedTimes?.includes('AFTERNOON')||bookedTimes?.includes('ALLDAY')}>Buổi chiều</MenuItem>
                                        <MenuItem value="ALLDAY" disabled={disableAllDay}>Cả ngày</MenuItem>
                                        {maxTable < 5 && <MenuItem value="CUSTOM">Tùy chỉnh</MenuItem>}
                                    </WhiteTextField>
                                </Grid>
                            }
                            {(selectedDate && maxTable < 5) &&
                                <Grid item xs={12}>
                                    <Grid container spacing={1}>
                                        {timeSlots.map((slot, index) => (
                                            <Grid item key={index}>
                                                <Button
                                                    variant={selectedTimes.includes(`${slot.start} - ${slot.end}`) ? "contained" : "outlined"}
                                                    onClick={() => toggleTimeSelection(`${slot.start} - ${slot.end}`)}
                                                    disabled={isSlotDisabled(slot.start, slot.end, bookedSlots)} // Disable nếu slot bị trùng
                                                >
                                                    {`${slot.start} - ${slot.end}`}
                                                </Button>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                            }
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