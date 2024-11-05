import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useRouter } from 'expo-router';

import { loginUser } from '@/redux/actions/apiRequest'
import { useDispatch } from 'react-redux';

const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Hãy nhập email"),
    password: Yup.string().required("Hãy nhập mật khẩu"),
});

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    const handleLogin = async (values) => {
        const newUser = {
            email: values.email,
            password: values.password,
        };
        console.log('Logging in with:', values);
        const seccess = await loginUser(newUser, dispatch, router)
    };

    return (
        <View style={styles.wrapLoginContainer}>
            <View style={styles.loginContainer}>
                <Text style={styles.loginTitle}>Đăng nhập</Text>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <View style={styles.form}>
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
                                    style={styles.input}
                                    value={values.password}
                                    onChangeText={handleChange('password')}
                                    mode="outlined"
                                    onBlur={handleBlur('password')}
                                    secureTextEntry={!showPassword}
                                    right={
                                        <TextInput.Icon
                                            icon={showPassword ? 'eye-off' : 'eye'}
                                            onPress={() => setShowPassword(!showPassword)}
                                            forceTextInput={false}
                                        />
                                    }
                                />
                                {touched.password && errors.password && (
                                    <Text style={styles.textDanger}>{errors.password}</Text>
                                )}
                            </View>

                            <View style={styles.buttonWrap}>
                                <Button
                                    title="Đăng nhập"
                                    onPress={handleSubmit}
                                />
                            </View>
                        </View>
                    )}
                </Formik>
                <Text style={styles.loginRegister}>
                    Chưa có tài khoản? <Link href="/register" style={styles.loginRegisterLink}>Đăng kí miễn phí ngay</Link>
                </Text>
                <Link href="/reset_password_email" style={styles.loginResetPasswordLink}>Quên mật khẩu?</Link>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapLoginContainer: {
        height: '100vh',
        backgroundImage: 'url("https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/backgroud_login.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9iYWNrZ3JvdWRfbG9naW4uanBnIiwiaWF0IjoxNzI3NTU4NDEzLCJleHAiOjE3NTkwOTQ0MTN9.cGawVuVP13EJHCzH_FpxGD4M-k_Z-IpGvCv-US9oFWQ&t=2024-09-28T21%3A20%3A12.685Z")',
        backgroundSize: 'cover',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        boxShadow: '0px 0px 10px 0.1px grey',
        backgroundColor: 'rgba(255, 251, 243, 0.9)',
        padding: 20,
    },
    loginTitle: {
        fontWeight: '700',
        fontSize: 'xx-large',
        marginBottom: 10,
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        margin: 'auto',
        fontSize: '0.85rem',
        fontWeight: '600',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        width: '100%',
        padding: 20
    },
    inputWrap: {
        width: '100%',
        height: 70,
    },
    input: {
        // borderRadius: 5,
        // borderColor: '#ccc',
        // borderWidth: 1,
        // padding: 10,
    },
    buttonWrap: {
        width: '100%',
        alignContent: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    loginRegister: {
        margin: '2rem 1rem 0 1rem',
        fontSize: '1rem',
        textAlign: 'center',
    },
    loginRegisterLink: {
        textDecoration: 'none',
        cursor: 'pointer',
        marginTop: 1,
        color: 'rgb(189, 0, 189)',
        fontWeight: '700',
    },
    loginResetPasswordLink: {
        display: 'block',
        textDecoration: 'none',
        cursor: 'pointer',
        marginTop: 1,
        color: 'rgb(189, 154, 0)',
        fontWeight: '700',
    },
    textDanger: {
        color: 'red',
        fontSize: '0.875rem',
        textAlign: 'right',
        marginTop: 0.5,
    },
});

export default Login;
