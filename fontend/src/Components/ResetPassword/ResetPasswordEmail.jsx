import { sendResetPassword } from "../../redux/actions/userRequest";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from '@mui/material/Button';
import { TextField } from "@mui/material";
import { useState } from "react";

const ResetPasswordEmail = () => {
    const [isDisable, setIsdisable] = useState(false)
    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Email không hợp lệ").required("Hãy nhập email"),
    });

    const handleRegister = async (values) => {
        await sendResetPassword(values,setIsdisable)
    };

    return (
        <section className="wrap-register-container">
            <div className="register-container">
                <div className="register-title text-center mb-4">Hãy nhập email để cài lại mật khẩu</div>
                <div className="container">
                    <Formik
                        initialValues={{ password: "", confirmPassword: "" }}
                        validationSchema={validationSchema}
                        onSubmit={handleRegister}
                    >
                        {({ handleSubmit, setFieldValue, errors, touched }) => (
                            <Form onSubmit={handleSubmit}>
                                <div className="input-wrap">
                                    <TextField
                                        type="text"
                                        name="email"
                                        onChange={(e) => setFieldValue("email", e.target.value)}
                                        error={touched.email && Boolean(errors.email)}
                                        fullWidth
                                        variant="outlined"
                                        label="Email"
                                    />
                                    {touched.email && errors.email && (
                                        <div className="text-danger">{errors.email}</div>
                                    )}
                                </div>

                                <Button variant="contained" type="submit" fullWidth sx={{ background: "#81695e" }} disabled={isDisable}>
                                    Xác nhận
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </section>
    );
};

export default ResetPasswordEmail;
