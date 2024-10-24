import "./register.css";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/actions/apiRequest";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Email không hợp lệ").required("Hãy nhập email"),
        password: Yup.string()
            .required("Hãy nhập mật khẩu")
            .min(6, "Mật khẩu phải ít nhất 6 kí tự"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], "Mật khẩu không khớp")
            .required("Hãy nhập xác nhận mật khẩu"),
    });

    const handleRegister = (values) => {
        const newUser = {
            email: values.email,
            password: values.password,
        };
        registerUser(newUser, dispatch, navigate);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <section className="wrap-register-container">
            <div className="register-container">
                <div className="register-title text-center mb-4">Đăng kí</div>
                <div className="container">
                    <Formik
                        initialValues={{ email: "", password: "", confirmPassword: "" }}
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

                                <div className="input-wrap">
                                    <FormControl
                                        variant="outlined"
                                        fullWidth
                                        error={touched.password && Boolean(errors.password)}
                                    >
                                        <InputLabel htmlFor="outlined-adornment-password">Mật khẩu</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            type={showPassword ? 'text' : 'password'}
                                            onChange={(e) => setFieldValue("password", e.target.value)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Password"
                                        />
                                        {touched.password && errors.password && (
                                            <div className="text-danger">{errors.password}</div>
                                        )}
                                    </FormControl>
                                </div>

                                <div className="input-wrap">
                                    <FormControl
                                        variant="outlined"
                                        fullWidth
                                        error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                                    >
                                        <InputLabel htmlFor="outlined-adornment-confirm-password">Xác nhận mật khẩu</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-confirm-password"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            onChange={(e) => setFieldValue("confirmPassword", e.target.value)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle confirm password visibility"
                                                        onClick={handleClickShowConfirmPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Confirm Password"
                                        />
                                        {touched.confirmPassword && errors.confirmPassword && (
                                            <div className="text-danger">{errors.confirmPassword}</div>
                                        )}
                                    </FormControl>
                                </div>

                                <Button variant="contained" type="submit" fullWidth sx={{background:"#81695e"}}>
                                    Tạo tài khoản
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </section>
    );
};

export default Register;
