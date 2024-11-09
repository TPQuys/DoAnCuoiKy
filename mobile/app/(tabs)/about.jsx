import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, Modal, TouchableOpacity, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { sendResetPassword, updateUser, uploadAvatar } from '@/redux/actions/userRequest';
import { logOut } from '@/redux/actions/apiRequest';
import { Picker } from '@react-native-picker/picker';
import UserBooking from '@/components/UserBooking'
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getBookingByUser } from '@/redux/actions/bookingRequest';

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
    const curentUser = useSelector((state) => state.auth.login.currentUser);
    const [bookings, setBookings] = useState(useSelector((state) => state.bookings.bookings));
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter()
    const [user, setUser] = useState(curentUser?.user)
    const [edit, setEdit] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDisable, setIsDisable] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleOpen = () => {
        setOpen(true);
        setSelectedFile(null)
    }

    const fetchBookings = async () => {
        const newBookings = await getBookingByUser(dispatch, curentUser);
        setBookings(newBookings);
    };

    const handleClose = () => setOpen(false);

    useEffect(() => {
        setUser(curentUser?.user)
        fetchBookings();
    }, [curentUser,])

    const handleChoosePhoto = async () => {
        // Yêu cầu quyền truy cập ảnh
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Bạn cần cấp quyền truy cập ảnh để thay đổi ảnh đại diện.");
            return;
        }

        // Mở thư viện ảnh để chọn ảnh
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        // Kiểm tra kết quả và lưu ảnh nếu người dùng không huỷ
        if (!result.canceled) {
            setSelectedFile({
                uri: result.assets[0].uri,
                type: 'image/jpeg',
                name: 'avatar.jpg'
            });
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchBookings();
        setRefreshing(false);
    };

    const handleUploadAvatar = async () => {
        if (selectedFile) {
            setIsDisable(true);
            const res = await uploadAvatar(dispatch, selectedFile, curentUser);
            setIsDisable(false);
            setUser(res)
            handleClose();
        } else {
            Alert.alert("Vui lòng chọn một tệp hình ảnh.");
        }
    };

    const handleResetPassword = async () => {
        await sendResetPassword(user, console.log);
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Formik
                initialValues={{
                    fullname: user?.fullname,
                    gender: user?.gender || '',
                    dayofbirth: user?.dayofbirth ? dayjs(user?.dayofbirth) : null,
                    address: user?.address || '',
                    phone: user?.phone || '',
                }}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                    const res = await updateUser(dispatch, values, user, curentUser);
                    if (res) {
                        setEdit(false);
                    } else {
                        Alert.alert("Cập nhập thất bại")
                    }
                }}
            >
                {({ errors, touched, handleChange, values, setFieldValue, resetForm, handleSubmit }) => (
                    <View>
                        <View style={styles.avatarContainer}>
                            <Image source={{ uri: user?.avatar }} style={styles.avatar} />
                            <TouchableOpacity onPress={handleOpen} style={styles.editButton}>
                                <Ionicons style={styles.icon} name='create' />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.password} onPress={handleResetPassword}>
                            <Text style={styles.passwordText}>Đổi mật khẩu</Text>
                        </TouchableOpacity>

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
                                <TouchableOpacity style={styles.button} onPress={() => setEdit(true)}>
                                    <Text style={styles.buttonText}>Sửa</Text>
                                </TouchableOpacity>
                            ) : (
                                <>
                                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                        <Text style={styles.buttonText}>Lưu</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.button, { backgroundColor: 'lightgray' }]}
                                        onPress={() => {
                                            setEdit(false);
                                            resetForm({ values: { ...user, dayofbirth: dayjs(user?.dayofbirth) } });
                                        }}
                                    >
                                        <Text style={[styles.buttonText, { color: "black" }]}>Hủy</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                        <View style={styles.logOut}>
                            <Button color={'red'} title='Đăng xuất' onPress={() => logOut(dispatch, curentUser, router)} />
                        </View>
                        <View>
                            <UserBooking bookings={bookings} user={curentUser} />
                        </View>
                        <Modal visible={open} onRequestClose={handleClose}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Chọn ảnh mới</Text>
                                <Button title="Chọn ảnh" onPress={handleChoosePhoto} color="#81695e" />

                                <View style={styles.ImageWarp}>
                                    {/* Hiển thị ảnh được chọn nếu có */}
                                    {selectedFile && (
                                        <Image
                                            source={{ uri: selectedFile.uri }}
                                            style={styles.previewImage}
                                        />
                                    )}
                                </View>

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        onPress={handleUploadAvatar}
                                        disabled={isDisable}
                                        style={styles.button}
                                    >
                                        <Text style={styles.buttonText}>Xác nhận</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.button, { backgroundColor: "lightgrey" }]} onPress={handleClose}>
                                        <Text style={styles.buttonText}>Huỷ</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>
                        </Modal>
                    </View>
                )}
            </Formik>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingVertical: 40,
        backgroundColor: '#fff3d1',
        height: "100%"
    },
    icon: {
        position: 'relative',
        right: 80,
        fontSize: 30
    },
    password: {
        alignItems: 'center',
    },
    passwordText: {
        alignItems: 'center',
        color: "red",
        fontWeight: "600"
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
        gap: 20,
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
        width: "45%"
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
    },
    logOut: {
        marginTop: 40
    },
    previewImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginVertical: 20, // Khoảng cách giữa ảnh và các nút
    },
    ImageWarp: {
        height: 300
    }

});
export default MyForm;
