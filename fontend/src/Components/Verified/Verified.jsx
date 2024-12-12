// src/VerifySuccess.js
import React from 'react';
import { Container, Typography, Button } from '@mui/material'; // Sử dụng Material-UI cho giao diện đẹp

const VerifySuccess = () => {
    return (
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '200px' }}>
            <Typography variant="h4" gutterBottom>
                Xác minh thành công!
            </Typography>
            <Typography variant="body1" paragraph>
                Chúng tôi đã xác minh thông tin của bạn thành công. Bạn có thể bắt đầu sử dụng ứng dụng.
            </Typography>
            <Button variant="contained" color="primary" href="/">
                Quay lại trang chủ
            </Button>
        </Container>
    );
};

export default VerifySuccess;
