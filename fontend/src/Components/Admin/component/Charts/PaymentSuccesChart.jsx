import React, { useState, useMemo } from 'react';
import { PieChart } from '@mui/x-charts';
import { Card, Grid2, MenuItem, TextField } from '@mui/material';

const PaymentChart = ({ bookings }) => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    // Lấy danh sách các năm từ dữ liệu BookingTime
    const years = useMemo(() => {
        const yearsSet = new Set(
            bookings.map((item) => new Date(item.BookingTime).getFullYear())
        );
        const minYear = Math.min(...yearsSet);
        const maxYear = Math.max(...yearsSet);

        // Thêm -1 và +1 năm
        for (let y = minYear - 1; y <= maxYear + 1; y++) {
            yearsSet.add(y);
        }

        // Sắp xếp và chuyển thành mảng
        return Array.from(yearsSet).sort((a, b) => a - b).map((y) => ({
            value: y,
            label: `${y}`
        }));
    }, [bookings]);

    const getPaymentStats = (bookings) => {
        const bookingsByMonthAndYear = bookings.filter((item) => {
            const date = new Date(item.BookingTime);
            return date.getMonth() + 1 === month && date.getFullYear() === year;
        });

        const successfulCount = bookingsByMonthAndYear.filter(item => item.Payment != null).length;
        const totalCount = bookingsByMonthAndYear.length;
        const failedCount = totalCount - successfulCount;

        return [
            { id: 0, value: successfulCount, label: 'Đã thanh toán', totalCount },
            { id: 1, value: failedCount, label: 'Chưa thanh toán', totalCount }
        ];
    };

    const data = getPaymentStats(bookings);

    const handleMonthChange = (event) => {
        setMonth(event.target.value);
    };

    const handleYearChange = (event) => {
        setYear(event.target.value);
    };

    return (
        <Card sx={{ height: "600px", flex: 1 }}>
            <Grid2 sx={{ height: "90px", padding: "10px" }}>
                <h2 style={{ textAlign: 'center' }}>Tỉ lệ thanh toán thành công</h2>
            </Grid2>
            <Grid2 container sx={{ justifyContent: "flex-start" }}>
                <TextField
                    sx={{ margin: "20px", width: "150px" }}
                    label="Chọn Tháng"
                    value={month}
                    onChange={handleMonthChange}
                    select
                >
                    {Array.from({ length: 12 }, (_, i) => (
                        <MenuItem key={i + 1} value={i + 1}>
                            Tháng {i + 1}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    sx={{ margin: "20px", width: "150px" }}
                    label="Chọn Năm"
                    value={year}
                    onChange={handleYearChange}
                    select
                >
                    {years.map((y) => (
                        <MenuItem key={y.value} value={y.value}>
                            {y.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid2>
            <Grid2 sx={{ height: "100%" }}>
                {(data[0].value > 0 || data[1].value > 0) ? (
                    <PieChart
                        series={[
                            {
                                data: data,
                                arcLabel: (item) =>
                                    `${Math.round((item.value / item.totalCount) * 100)}%`,
                            },
                        ]}
                        width={500}
                        height={200}
                    />
                ) : (
                    "Chưa có số liệu"
                )}
            </Grid2>
        </Card>
    );
};

export default PaymentChart;
