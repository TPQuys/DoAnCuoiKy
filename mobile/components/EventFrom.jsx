import React, { forwardRef, useEffect, useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
    HelperText,
    Button
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { Picker } from '@react-native-picker/picker';

const EventForm = ({ handleSubmit, setFrom, setTo }) => {
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [requireDay, setRequireDay] = useState(1); // Default days before booking
    const [timeSlots, setTimeSlots] = useState([]);

    useEffect(() => {
        setTimeSlots(generateTimeSlots(8, 23, 1)); // Generate time slots from 8:00 to 23:00
    }, []);

    useEffect(() => {
        mergeTimeSlots(selectedTimes);
        if (selectedTimes.length < 1) {
            setFrom(null);
            setTo(null);
        }
    }, [selectedTimes, selectedDate]);

    const handleChangeDate = (setFieldValue, fieldName, date) => {
        setSelectedDate(date);
        setFieldValue(fieldName, date);
        setSelectedTimes([]); // Reset selected times when date changes
    };

    const mergeTimeSlots = (slots) => {
        if (!slots.length) return;
        const first = slots[0];
        const last = slots[slots.length - 1];

        const newDate = selectedDate;
        const fromTime = first?.split(':')[0];
        const toTime = last?.split(' - ')[1]?.split(':')[0];

        const newDateFrom = new Date(newDate);
        newDateFrom.setHours(parseInt(fromTime));
        newDateFrom.setMinutes(0);
        newDateFrom.setSeconds(0);
        setFrom(newDateFrom);

        const newDateTo = new Date(newDate);
        newDateTo.setHours(parseInt(toTime));
        newDateTo.setMinutes(0);
        newDateTo.setSeconds(0);
        setTo(newDateTo);
    };

    const generateTimeSlots = (startHour, endHour, interval) => {
        const slots = [];
        for (let hour = startHour; hour < endHour; hour++) {
            const start = `${String(hour).padStart(2, "0")}:00`;
            const end = `${String(hour + interval).padStart(2, "0")}:00`;
            slots.push(`${start} - ${end}`);
        }
        return slots;
    };

    const toggleTimeSelection = (time) => {
        const selectedStartTimes = selectedTimes.map((t) => t.split(" - ")[0]);
        const isAdjacent = selectedStartTimes.some((selectedStart) =>
            dayjs(selectedStart, "HH:mm").add(1, "hour").format("HH:mm") === time.split(" - ")[0] ||
            dayjs(selectedStart, "HH:mm").subtract(1, "hour").format("HH:mm") === time.split(" - ")[0]
        );

        if (selectedTimes.includes(time)) {
            const newSelectedTimes = selectedTimes.filter((t) => t !== time);
            setSelectedTimes(newSelectedTimes);
        } else if (selectedTimes.length === 0 || isAdjacent) {
            setSelectedTimes((prevSelectedTimes) => [...prevSelectedTimes, time].sort());
        }
    };

    const initialValues = {
        EventType: '',
        TotalTable: '',
        EventDate: '',
        Time: '',
    };

    const validationSchema = Yup.object().shape({
        EventType: Yup.string().required('Vui lòng chọn loại sự kiện'),
        TotalTable: Yup.number()
            .required('Vui lòng nhập tổng số bàn')
            .positive('Số bàn phải là số dương')
            .integer('Số bàn phải là số nguyên'),
        EventDate: Yup.date()
            .required('Vui lòng chọn ngày')
            .min(dayjs().add(requireDay, 'day'), `Ngày sự kiện phải đặt trước ${requireDay} ngày`),
        Time: Yup.string().required('Vui lòng chọn thời gian'),
    });

    return (
        <ScrollView style={{ padding: 16 }}>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    handleSubmit(values);
                }}
            >
                {({ handleChange, handleBlur, setFieldValue, values, errors, touched, handleSubmit }) => (
                    <>
                        <Text style={styles.label}>Ngày</Text>
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            style={styles.input}
                        >
                            <Text>{values.EventDate ? dayjs(values.EventDate).format('DD/MM/YYYY') : 'Chọn ngày'}</Text>
                        </TouchableOpacity>
                        {errors.EventDate && touched.EventDate && (
                            <HelperText type="error">{errors.EventDate}</HelperText>
                        )}
                        {showDatePicker && (
                            <DateTimePicker
                                mode="date"
                                value={values.EventDate || new Date()}
                                minimumDate={dayjs().add(1, 'day').toDate()}
                                onChange={(event, date) => {
                                    setShowDatePicker(false);
                                    if (date) {
                                        handleChangeDate(setFieldValue, 'EventDate', date);
                                    }
                                }}

                            />

                        )}
                        <Text style={styles.label}>Tổng số bàn</Text>
                        <TextInput
                            label="Tổng Số Bàn"
                            keyboardType="number-pad"
                            value={values.TotalTable}
                            onChangeText={handleChange('TotalTable')}
                            onBlur={handleBlur('TotalTable')}
                            style={styles.input}
                        />
                        {errors.TotalTable && touched.TotalTable && (
                            <HelperText type="error">{errors.TotalTable}</HelperText>
                        )}

                        <Text style={styles.label}>Loại Sự Kiện</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={values.EventType}
                                onValueChange={handleChange('EventType')}
                                style={styles.picker} // Chỉ áp dụng cho style bên trong picker
                            >
                                <Picker.Item label="Chọn loại sự kiện" value="" />
                                <Picker.Item label="Đám Cưới" value="WEDDING" />
                                <Picker.Item label="Hội Nghị" value="CONFERENCE" />
                                <Picker.Item label="Sinh nhật" value="BIRTHDAY" />
                                <Picker.Item label="Khác" value="ORTHER" />
                            </Picker>
                        </View>
                        {errors.EventType && touched.EventType && (
                            <HelperText type="error">{errors.EventType}</HelperText>
                        )}
                        <Text style={styles.label}>Thời gian</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={values.Time}
                                onValueChange={handleChange('Time')}
                                style={styles.picker}
                            >
                                <Picker.Item label="Chọn thời gian" value="" />
                                <Picker.Item
                                    label="Buổi sáng (8:00-14:00)"
                                    value="MORNING"
                                />
                                <Picker.Item
                                    label="Buổi chiều(16:00-23:00)"
                                    value="AFTERNOON"
                                />
                                <Picker.Item
                                    label="Cả ngày"
                                    value="ALLDAY"
                                />
                                <Picker.Item label="Tùy chỉnh" value="CUSTOM" />
                            </Picker>
                        </View>
                        {errors.Time && touched.Time && (
                            <HelperText type="error">{errors.Time}</HelperText>
                        )}
                        {values.Time === "CUSTOM" && <>
                            <Text style={{ marginBottom: 8 }}>Chọn Thời Gian:</Text>
                            {timeSlots.map((slot, index) => (
                                <Button
                                    key={index}
                                    mode={selectedTimes.includes(slot) ? "contained" : "outlined"}
                                    onPress={() => toggleTimeSelection(slot)}
                                    style={styles.timeButton}
                                >
                                    {slot}
                                </Button>
                            ))}
                        </>}
                        <Button mode="contained" style={styles.submitButton} onPress={handleSubmit}>
                            Tìm
                        </Button>
                    </>
                )}
            </Formik>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 4,
        marginBottom: 16,
        height: 40
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 16,
    },
    timeButton: {
        marginBottom: 8,
    },
    submitButton: {
        marginTop: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        backgroundColor: 'white',
        marginBottom: 16,
        height: 40,
        justifyContent: "center"
    },
    picker: {
        color: 'black', // Màu chữ bên trong picker
    },
});

export default EventForm;
