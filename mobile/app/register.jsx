import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Link, useRouter } from 'expo-router';
import { registerUser } from '@/redux/actions/apiRequest';

const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email không hợp lệ").required("Hãy nhập email"),
    password: Yup.string()
        .required("Hãy nhập mật khẩu")
        .min(6, "Mật khẩu phải ít nhất 6 kí tự"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], "Mật khẩu không khớp")
        .required("Hãy nhập xác nhận mật khẩu"),
});

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleRegister = async (values) => {
        const newUser = {
            email: values.email,
            password: values.password,
        };
        const success = await registerUser(newUser, dispatch, router);
    };

    return (
        <View style={styles.registerContainer}>
            <Formik
                initialValues={{ email: '', password: '', confirmPassword: '' }}
                validationSchema={validationSchema}
                onSubmit={handleRegister}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View style={styles.form}>
                        <Text style={styles.registerTitle}>Đăng ký</Text>

                        <View style={styles.inputWrap}>
                            <TextInput
                                label="Email"
                                value={values.email}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                mode="outlined"
                                style={styles.input}
                            />
                            {touched.email && errors.email && (
                                <Text style={styles.textDanger}>{errors.email}</Text>
                            )}
                        </View>

                        <View style={styles.inputWrap}>
                            <TextInput
                                label="Mật khẩu"
                                value={values.password}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                mode="outlined"
                                secureTextEntry={!showPassword}
                                style={styles.input}
                                right={
                                    <TextInput.Icon
                                        icon={showPassword ? 'eye-off' : 'eye'}
                                        onPress={() => setShowPassword(!showPassword)}
                                    />
                                }
                            />
                            {touched.password && errors.password && (
                                <Text style={styles.textDanger}>{errors.password}</Text>
                            )}
                        </View>

                        <View style={styles.inputWrap}>
                            <TextInput
                                label="Xác nhận mật khẩu"
                                value={values.confirmPassword}
                                onChangeText={handleChange('confirmPassword')}
                                onBlur={handleBlur('confirmPassword')}
                                mode="outlined"
                                secureTextEntry={!showConfirmPassword}
                                style={styles.input}
                                right={
                                    <TextInput.Icon
                                        icon={showConfirmPassword ? 'eye-off' : 'eye'}
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    />
                                }
                            />
                            {touched.confirmPassword && errors.confirmPassword && (
                                <Text style={styles.textDanger}>{errors.confirmPassword}</Text>
                            )}
                        </View>

                        <View style={styles.buttonWrap}>
                            <Button title="Tạo tài khoản" onPress={handleSubmit} color="#81695e" />
                        </View>
                        <Text style={styles.registerLogin}>
                                Đã có tài khoản? {" "}
                                <Link href={"/"} style={styles.registerLoginLink}>Đăng nhập ngay!</Link>

                        </Text>
                    </View>
                )}
            </Formik>
        </View>
    );
};

const styles = StyleSheet.create({
    registerContainer: {
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 251, 243, 0.9)',
        paddingVertical: 100,
    },
    registerTitle: {
        fontWeight: '700',
        fontSize: 40,
        marginBottom: 10,
        textAlign: 'center',
        color: '#81695e',
    },
    form: {
        alignItems: 'center',
        gap: 20,
        padding: 20,
    },
    inputWrap: {
        width: 270,
        height: 60,
        marginBottom: 10,
    },
    input: {
        borderRadius: 5,
        fontSize: 18,
    },
    buttonWrap: {
        margin: 10,
        width: 200,
        borderRadius: 10,
        overflow: 'hidden',
    },
    registerLogin: {
        margin: 10,
        fontSize:14,
        textAlign: 'center',
    },
    registerLoginLink: {
        color: 'rgb(189, 0, 189)',
        fontWeight: '700',
        fontSize:14
    },
    textDanger: {
        color: 'red',
        fontSize: 14,
        textAlign: 'left',
        marginTop: 5,
    },
});

export default Register;
