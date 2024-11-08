import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, Modal, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit } from 'react-icons/fa';
// import DropzoneImagePicker from './DropzoneImagePicker';
import dayjs from 'dayjs';
import { sendResetPassword, updateUser, uploadAvatar } from '@/redux/actions/userRequest';
import { Picker } from '@react-native-picker/picker';

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
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login.currentUser)?.user;
    const curentUser = useSelector((state) => state.auth.login.currentUser);
    const [edit, setEdit] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDisable, setIsDisable] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false); // Thêm trạng thái để hiển thị DatePicker

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleUploadAvatar = async () => {
        if (selectedFile) {
            if (selectedFile?.type.startsWith("image/")) {
                setIsDisable(true);
                const newUser = await uploadAvatar(dispatch, selectedFile, user);
                setIsDisable(false);
                handleClose();
            } else {
                alert("Vui lòng chọn một tệp hình ảnh.");
                setIsDisable(false);
            }
        } else {
            alert("Vui lòng chọn một tệp hình ảnh.");
        }
    };

    const handleResetPassword = async (user) => {
        const confirmReset = confirm("Bạn có chắc chắn muốn đổi mật khẩu?");
        if (confirmReset) {
            await sendResetPassword(user, console.log);
        }
    };

    return (
        <Formik
            initialValues={{
                fullname: user?.fullname,
                gender: user?.gender || '',
                dayofbirth: user?.dayofbirth ? dayjs(user?.dayofbirth) : null,
                address: user?.address || '',
                phone: user?.phone || '',
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
                const res = await updateUser(dispatch, values, user, curentUser);
                setEdit(false);
            }}
        >
            {({ errors, touched, handleChange, values, setFieldValue, resetForm, handleSubmit }) => (
                <View style={styles.container}>
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: user?.avatar }} style={styles.avatar} />
                        <TouchableOpacity onPress={handleOpen} style={styles.editButton}>
                            {/* <FaEdit size={20} color="black" /> */}
                        </TouchableOpacity>
                    </View>
                    <Button title="Đổi mật khẩu" color="red" onPress={() => handleResetPassword(user)} />

                    <View style={styles.formContainer}>
                        <TextInput
                            style={edit ? styles.input : styles.inputDisabled}
                            placeholder="Họ tên"
                            onChangeText={handleChange('fullname')}
                            value={values.fullname}
                            editable={edit}
                        />
                        {touched.fullname && errors.fullname && <Text style={styles.errorText}>{errors.fullname}</Text>}

                        <Picker
                            selectedValue={values.gender}
                            onValueChange={(itemValue) => handleChange('gender')(itemValue)}
                            enabled={edit}
                            style={edit ? styles.input : styles.inputDisabled}
                        >
                            <Picker.Item label="" value="" />
                            <Picker.Item label="Nam" value="male" />
                            <Picker.Item label="Nữ" value="female" />
                            <Picker.Item label="Khác" value="orther" />
                        </Picker>
                        {touched.gender && errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

                        <TouchableOpacity
                            style={edit ? styles.input : styles.inputDisabled}
                            onPress={() => edit && setShowDatePicker(true)}
                        >
                            <Text style={{ color: values.dayofbirth ? 'black' : 'grey' }}>
                                {values.dayofbirth ? dayjs(values.dayofbirth).format('DD/MM/YYYY') : 'Chọn ngày sinh'}
                            </Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={values.dayofbirth ? new Date(values.dayofbirth) : new Date()}
                                mode="date"
                                display="default"
                                maximumDate={new Date()}
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(false);
                                    if (selectedDate) {
                                        setFieldValue('dayofbirth', dayjs(selectedDate).format('YYYY-MM-DD'));
                                    }
                                }}
                            />
                        )}
                        {touched.dayofbirth && errors.dayofbirth && <Text style={styles.errorText}>{errors.dayofbirth}</Text>}

                        <TextInput
                            style={edit ? styles.input : styles.inputDisabled}
                            placeholder="Số điện thoại"
                            onChangeText={handleChange('phone')}
                            value={values.phone}
                            keyboardType="numeric"
                            editable={edit}
                        />
                        {touched.phone && errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

                        <TextInput
                            style={edit ? styles.input : styles.inputDisabled}
                            placeholder="Địa chỉ"
                            onChangeText={handleChange('address')}
                            value={values.address}
                            editable={edit}
                        />
                        {touched.address && errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
                    </View>

                    <View style={styles.buttonContainer}>
                        {!edit ? (
                            <TouchableOpacity style={styles.button} onPress={() => setEdit(true)} >
                                <Text style={styles.buttonText}>Sửa</Text>
                            </TouchableOpacity>
                        ) : (
                            <>
                                <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}  >
                                    <Text style={styles.buttonText}>Lưu</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button,{backgroundColor: 'lightgray'}]} onPress={() => {
                                        setEdit(false);
                                        resetForm({ values: { ...user, dayofbirth: dayjs(user?.dayofbirth) } });
                                    }}  >
                                    <Text style={[styles.buttonText,{color:"black"}]}>Hủy</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                    <Modal visible={open} onRequestClose={handleClose}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Chọn ảnh mới</Text>
                            {/* <DropzoneImagePicker setSelectedFile={setSerlectedFile} /> */}
                            <Button
                                title="Xác nhận"
                                onPress={handleUploadAvatar}
                                disabled={isDisable}
                                color="#81695e"
                            />
                        </View>
                    </Modal>
                </View>
            )}
        </Formik>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 40,
        backgroundColor: '#fff3d1',
        height: "100%"
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    editButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    formContainer: {
        marginBottom: 20,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 10,
        color: 'black',
    },
    inputDisabled: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 10,
        color: 'grey',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap:20,
    },
    modalContent: {
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#81695e',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        width:"45%"
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
    },
});

export default MyForm;
