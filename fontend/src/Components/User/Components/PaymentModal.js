import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const PaymentModal = ({ open, onClose, paymentData }) => {
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        if (date) {
            return date.toLocaleString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
        }
    };
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Thông tin thanh toán</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body1"><strong>Số tiền:</strong> {paymentData?.Amount?.toLocaleString()} VND</Typography>
                <Typography variant="body1"><strong>Ngày thanh toán:</strong> {formatDateTime(paymentData?.PaymentDate)}</Typography>
                <Typography variant="body1"><strong>Phương thức thanh toán:</strong> {paymentData?.PaymentMethod}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Đóng</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PaymentModal;
