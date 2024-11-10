import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { sendResetPassword } from '@/redux/actions/userRequest';
import { Link } from 'expo-router';

const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email không hợp lệ").required("Hãy nhập email"),
});

const ResetPasswordEmail = () => {
    const [isDisable, setIsDisable] = useState(false);

    const handleRegister = async (values) => {
        await sendResetPassword(values, setIsDisable);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hãy nhập email để cài lại mật khẩu</Text>
            <Formik
                initialValues={{ email: "" }}
                validationSchema={validationSchema}
                onSubmit={handleRegister}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View style={styles.form}>
                        <TextInput
                            label="Email"
                            value={values.email}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            mode="outlined"
                            style={styles.input}
                            error={touched.email && errors.email}
                        />
                        {touched.email && errors.email && (
                            <Text style={styles.textDanger}>{errors.email}</Text>
                        )}

                        <Button
                            mode="contained"
                            onPress={handleSubmit}
                            style={styles.button}
                            disabled={isDisable}
                            buttonColor="#81695e"
                            textColor="white"
                        >
                            Xác nhận
                        </Button>
                        <Link href="/" style={styles.loginResetPasswordLink}>Trở về trang đăng nhập</Link>
                    </View>
                )}
            </Formik>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(255, 251, 243, 0.9)',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#81695e',
    },
    form: {
        alignItems: 'center',
    },
    input: {
        width: '100%',
        marginBottom: 20,
        backgroundColor: 'white',
    },
    button: {
        width: '100%',
        paddingVertical: 10,
    },
    textDanger: {
        color: 'red',
        fontSize: 14,
        marginTop: 5,
        textAlign: 'left',
        width: '100%',
    },
    loginResetPasswordLink: {
        display: 'block',
        textDecoration: 'none',
        cursor: 'pointer',
        marginTop: 10,
        color: 'rgb(189, 154, 0)',
        fontWeight: '700',
        fontSize:14
    },
});

export default ResetPasswordEmail;
