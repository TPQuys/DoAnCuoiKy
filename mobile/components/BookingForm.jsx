import React, { useState, forwardRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Formik, Field } from 'formik';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

import { getRoomBooked } from '../redux/actions/eventRequest';

const EventForm = forwardRef(({ handleSubmit, maxTable, setFrom, setTo, RoomEventID, user }, ref) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [bookedSlots, setBookedSlots] = useState([]);
    const initialValues = {
        EventType: '',
        TotalTable: '',
        EventDate: null,
        Time: '',
        Note: '',
    };

    useEffect(() => {
        mergeTimeSlots(selectedTimes);
    }, [selectedTimes, selectedDate]);

    useEffect(() => {
        const fetchRoomBooked = async () => {
            if (selectedDate) {
                console.log(new Date(selectedDate))
                try {
                    const res = await getRoomBooked(RoomEventID, selectedDate, user);
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
        value.setHours(0, 0, 0, 0)
        setSelectedDate(value);
        setFieldValue(name, value);
        if (maxTable >= 5) {
            setFieldValue('Time', '');
        } else {
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

    const bookedTimes = bookedSlots?.map(item => item.Time);

    const disableAllDay = bookedTimes.includes('MORNING') || bookedTimes.includes('AFTERNOON') || bookedTimes.includes('ALLDAY');


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
                console.log(newStart)
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
                'Ngày đặt phải trước 1 ngày với <= 30 bàn và trước 15 ngày với > 30 bàn',
                function (value) {
                    const { TotalTable } = this.parent; // Lấy giá trị từ TotalTable
                    if (!value) return false;

                    const today = dayjs();
                    const eventDate = dayjs(value);

                    if (TotalTable > 30) {
                        return eventDate.isAfter(today.add(15, 'day'));
                    } else {
                        return eventDate.isAfter(today.add(1, 'day'));
                    }
                }
            ),
        Time: Yup.string().required('Vui lòng chọn thời gian'),
        Note: Yup.string(),
    });


    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            innerRef={ref}
        >
            {({ handleChange, handleBlur, setFieldValue, values, errors, touched }) => (
                <View style={styles.container}>
                    {/* EventType Field */}
                    <Text style={styles.label}>Loại Sự Kiện</Text>
                    <Picker
                        selectedValue={values.EventType}
                        onValueChange={handleChange('EventType')}
                        style={styles.input}
                    >
                        <Picker.Item label="Chọn loại sự kiện" value="" />
                        {maxTable >= 5 && <Picker.Item label="Đám Cưới" value="WEDDING" />}
                        <Picker.Item label="Hội Nghị" value="CONFERENCE" />
                        <Picker.Item label="Sinh nhật" value="BIRTHDAY" />
                        <Picker.Item label="Khác" value="ORTHER" />
                    </Picker>
                    {touched.EventType && errors.EventType && (
                        <Text style={styles.errorText}>{errors.EventType}</Text>
                    )}

                    {maxTable >= 5 && <>

                        {/* TotalTable Field */}
                        <Text style={styles.label}>Tổng Số Bàn</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            onChangeText={handleChange('TotalTable')}
                            onBlur={handleBlur('TotalTable')}
                            value={values.TotalTable}
                        />
                        {touched.TotalTable && errors.TotalTable && (
                            <Text style={styles.errorText}>{errors.TotalTable}</Text>
                        )}
                    </>}
                    {/* EventDate Field */}
                    <Text style={styles.label}>Ngày</Text>
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={styles.input}
                    >
                        <Text>{values.EventDate ? dayjs(values.EventDate).format('DD/MM/YYYY') : 'Chọn ngày'}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            mode="date"
                            value={values.EventDate || new Date()}
                            minimumDate={dayjs().add(1, 'day').toDate()}
                            onChange={(event, date) => {
                                setShowDatePicker(false);
                                if (date) {
                                    handleChangeDate(setFieldValue, 'EventDate', date)
                                }
                            }}
                        />
                    )}
                    {touched.EventDate && errors.EventDate && (
                        <Text style={styles.errorText}>{errors.EventDate}</Text>
                    )}

                    {/* Time Field */}
                    {maxTable >= 5 && <>
                        <Text style={styles.label}>Thời gian</Text>
                        <Picker
                            selectedValue={values.Time}
                            onValueChange={handleChange('Time')}
                            style={styles.input}
                        >
                            <Picker.Item label="Chọn thời gian" value="" />
                            <Picker.Item
                                label="Buổi sáng (8:00-14:00)"
                                value="MORNING"
                                style={{
                                    color: !(bookedTimes?.includes('MORNING') || bookedTimes?.includes('ALLDAY')) ? 'black' : 'gray',
                                }}
                                enabled={!(bookedTimes?.includes('MORNING') || bookedTimes?.includes('ALLDAY'))}
                            />
                            <Picker.Item
                                label="Buổi chiều(16:00-23:00)"
                                value="AFTERNOON"
                                style={{
                                    color: !(bookedTimes?.includes('AFTERNOON') || bookedTimes?.includes('ALLDAY')) ? 'black' : 'gray',
                                }}
                                enabled={!(bookedTimes?.includes('AFTERNOON') || bookedTimes?.includes('ALLDAY'))}
                            />
                            <Picker.Item
                                label="Cả ngày"
                                value="ALLDAY"
                                style={{
                                    color: !disableAllDay ? 'black' : 'gray',
                                }}
                                enabled={!disableAllDay}
                            />
                            {maxTable < 5 && (
                                <Picker.Item label="Tùy chỉnh" value="CUSTOM" style={{ color: 'black' }} />
                            )}
                        </Picker>

                        {touched.Time && errors.Time && (
                            <Text style={styles.errorText}>{errors.Time}</Text>
                        )}
                    </>}

                    {selectedDate && maxTable < 5 && (
                        <View style={styles.container}>
                            <View style={styles.gridContainer}>
                                {timeSlots.map((item, index) => (
                                    <View style={styles.timeSlot} key={index}>
                                        <Button
                                            title={`${item.start} - ${item.end}`}
                                            onPress={() => toggleTimeSelection(`${item.start} - ${item.end}`)}
                                            color={selectedTimes.includes(`${item.start} - ${item.end}`) ? 'blue' : 'gray'}
                                            disabled={isSlotDisabled(item.start, item.end, bookedSlots)}
                                        />
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Note Field */}
                    <Text style={styles.label}>Ghi chú</Text>
                    <TextInput
                        style={[styles.input, { height: 100 }]}
                        multiline
                        onChangeText={handleChange('Note')}
                        onBlur={handleBlur('Note')}
                        value={values.Note}
                    />
                    {touched.Note && errors.Note && (
                        <Text style={styles.errorText}>{errors.Note}</Text>
                    )}

                </View>
            )}
        </Formik>
    );
});

const styles = StyleSheet.create({
    timeSlot: {
        margin: 5,
    },
    container: {
        padding: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 4,
        marginBottom: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 16,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Tạo lưới
        justifyContent: 'space-between',
    },
    timeSlot: {
        width: '30%', // Mỗi ô chiếm 30% chiều rộng
        marginVertical: 10,
        alignItems: 'center',
    },
});

export default EventForm;
