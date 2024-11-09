import React, { useState, forwardRef } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Formik, Field } from 'formik';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Yup from 'yup';
import dayjs from 'dayjs';

const EventForm = forwardRef(({ handleSubmit, maxTable }, ref) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const initialValues = {
        EventType: '',
        TotalTable: '',
        EventDate: null,
        Time: '',
        Note: '',
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
            .min(dayjs().add(1, 'day').toDate(), 'Ngày sự kiện phải từ ngày mai trở đi'),
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
                        <Picker.Item label="Đám Cưới" value="WEDDING" />
                        <Picker.Item label="Hội Nghị" value="CONFERENCE" />
                        <Picker.Item label="Sinh nhật" value="BIRTHDAY" />
                        <Picker.Item label="Khác" value="OTHER" />
                    </Picker>
                    {touched.EventType && errors.EventType && (
                        <Text style={styles.errorText}>{errors.EventType}</Text>
                    )}

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
                                    setFieldValue('EventDate', date);
                                }
                            }}
                        />
                    )}
                    {touched.EventDate && errors.EventDate && (
                        <Text style={styles.errorText}>{errors.EventDate}</Text>
                    )}

                    {/* Time Field */}
                    <Text style={styles.label}>Thời gian</Text>
                    <Picker
                        selectedValue={values.Time}
                        onValueChange={handleChange('Time')}
                        style={styles.input}
                    >
                        <Picker.Item label="Chọn thời gian" value="" />
                        <Picker.Item label="Buổi sáng" value="MORNING" />
                        <Picker.Item label="Buổi chiều" value="AFTERNOON" />
                        <Picker.Item label="Cả ngày" value="ALLDAY" />
                    </Picker>
                    {touched.Time && errors.Time && (
                        <Text style={styles.errorText}>{errors.Time}</Text>
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
});

export default EventForm;
