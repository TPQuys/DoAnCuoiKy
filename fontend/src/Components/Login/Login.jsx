import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/apiRequest";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from "react";
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().required("Required"),
    });

    const handleLogin = (values) => {
        const newUser = {
            email: values.email,
            password: values.password,
        };
        loginUser(newUser, dispatch, navigate);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <section className="wrap-login-container">
            <div className="login-container">
            <div className="login-title text-center mb-4">Log in</div>
            <div className="container">
                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
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
                                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
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

                            <Button variant="contained" type="submit"  fullWidth>
                                Continue
                            </Button>
                        </Form>
                    )}
                </Formik>
                <div className="text-center mt-3">Don't have an account yet?</div>
                <Link className="link" to="/register">Register one for free</Link>
            </div>
            </div>
        </section>
    );
};

export default Login;
