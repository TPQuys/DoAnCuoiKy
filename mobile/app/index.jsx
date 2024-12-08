import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useRouter } from 'expo-router';

import { loginUser } from '@/redux/actions/apiRequest'
import { useDispatch } from 'react-redux';

const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email không hợp lệ").required("Hãy nhập email"),
    password: Yup.string().required("Hãy nhập mật khẩu"),
});

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isDisable, setIsDisable] = useState(false)
    const dispatch = useDispatch();
    const router = useRouter();
    const handleLogin = async (values) => {
        setIsDisable(true)
        const newUser = {
            email: values.email,
            password: values.password,
        };
        const success = await loginUser(newUser, dispatch, router)
        .then(()=> setIsDisable(false))
        .catch((e)=>{
            setIsDisable(false)
            console.log(e)
        })
    };

    return (
        <View style={styles.loginContainer}>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleLogin}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View style={styles.form}>
                        <Text style={styles.loginTitle}>Đăng nhập</Text>

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
                                disabled={isDisable}
                                title="Đăng nhập"
                                onPress={handleSubmit}
                            />
                        </View>
                        <Text style={styles.loginRegister}>
                            Chưa có tài khoản? <Link href="/register" style={styles.loginRegisterLink}>Đăng kí miễn phí ngay</Link>
                        </Text>
                        <Link href="/resetPasswordEmail" style={styles.loginResetPasswordLink}>Quên mật khẩu?</Link>

                    </View>
                )}
            </Formik>
        </View>
    );
};

const styles = StyleSheet.create({
    loginContainer: {
        height: "100%",
        display: 'flex',
        borderRadius: 5,
        backgroundColor: 'rgba(255, 251, 243, 0.9)',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 100
    },
    loginTitle: {
        fontWeight: '700',
        fontSize: 40,
        marginBottom: 10,
        textAlign: 'center',
        color: '#81695e',
    },
    form: {
        display: 'flex',
        margin: 'auto',
        fontSize: 10,
        fontWeight: '600',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        padding: 20
    },
    inputWrap: {
        width: 270,
        height: 60,
    },
    input: {
        borderRadius: 5,
        fontSize: 18
    },
    buttonWrap: {
        margin: 10,
        backgroundColor: "red",
        width: 200,
        borderRadius: 10,
    },
    loginRegister: {
        margin: '2rem 1rem 0 1rem',
        fontSize: 14,
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
        fontSize: 14,
        textAlign: 'left',
        marginLeft: 10,
        marginTop: 0.5,
    },
});

export default Login;
