import React, { useState } from 'react';
import { PieChart } from '@mui/x-charts';
import { Card, Grid2, MenuItem, TextField } from '@mui/material';

const PaymentChart = ({ bookings }) => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const months = [
        { value: 1, label: 'Tháng 1' },
        { value: 2, label: 'Tháng 2' },
        { value: 3, label: 'Tháng 3' },
        { value: 4, label: 'Tháng 4' },
        { value: 5, label: 'Tháng 5' },
        { value: 6, label: 'Tháng 6' },
        { value: 7, label: 'Tháng 7' },
        { value: 8, label: 'Tháng 8' },
        { value: 9, label: 'Tháng 9' },
        { value: 10, label: 'Tháng 10' },
        { value: 11, label: 'Tháng 11' },
        { value: 12, label: 'Tháng 12' },
    ];

    const getPaymentStats = (bookings) => {
        let bookingsByMonth = []
        bookings.map((item) => {
            const date = new Date(item.BookingTime)
            if (date.getMonth() + 1 === month) {
                bookingsByMonth.push(item)
            }
        })
        console.log(bookingsByMonth)
        // Đếm số lượng booking có Payment khác null (thanh toán thành công)
        const successfulCount = bookingsByMonth.filter(item => item.Payment != null).length;

        // Đếm tổng số booking
        const totalCount = bookingsByMonth.length;

        // Tính phần trăm thanh toán thành công và thất bại
        const failedCount = totalCount - successfulCount;

        // Dữ liệu cho biểu đồ
        return [
            { id: 0, value: successfulCount, label: 'Đã thanh toán', totalCount: totalCount },
            { id: 1, value: failedCount, label: 'Chưa thanh toán', totalCount: totalCount }
        ];
    };


    const data = getPaymentStats(bookings); // Dữ liệu từ hàm getPaymentStats
    console.log(data)

    const handleChange = (event) => {
        setMonth(event.target.value);
    };

    return (
        <Card sx={{ height: "500px", flex: 1, minWidth: "500px" }}>
            <Grid2 sx={{ height: "90px",padding:"10px" }}>
                <h2 style={{ textAlign: 'center' }}>Tỉ lệ thanh toán thành công</h2>
            </Grid2>
            <Grid2 container sx={{ justifyContent: "flex-start", }}>
                <TextField
                    sx={{ margin: "20px", width: "150px" }}
                    labelId="month-select-label"
                    id="month-select"
                    value={month}
                    onChange={handleChange}
                    label="Chọn Tháng"
                    select
                >
                    {months.map((m) => (
                        <MenuItem key={m.value} value={m.value}>
                            {m.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid2>
            <Grid2 sx={{ height: "100%" }}>
                {(data[0].value > 0 || data[1].value > 0) ?
                    <PieChart
                        series={[
                            {
                                data: data,
                                arcLabel: (item) => `${Math.round(item.value / item.totalCount * 100)}%`,
                            }
                        ]}
                        width={500}
                        height={200}
                    />
                    : "Chưa có số liệu"}
            </Grid2>
        </Card>
    );
};

export default PaymentChart