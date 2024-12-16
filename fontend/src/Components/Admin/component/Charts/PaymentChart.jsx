import React, { useEffect, useState, useMemo } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Card, Grid, TextField, MenuItem } from '@mui/material';
import { axisClasses } from '@mui/x-charts';

const PaymentChart = ({ bookings }) => {
  const [data, setData] = useState([]); // Lưu dữ liệu cho biểu đồ
  const [months, setMonths] = useState([]); // Lưu danh sách tháng
  const [year, setYear] = useState(new Date().getFullYear()); // Năm được chọn

  // Tính danh sách các năm từ dữ liệu bookings
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

    return Array.from(yearsSet).sort((a, b) => a - b);
  }, [bookings]);

  // Hàm xử lý dữ liệu doanh thu
  const getPayment = (selectedYear) => {
    const sortedBookings = bookings.filter(
      (item) => new Date(item.BookingTime).getFullYear() === selectedYear
    );

    let paymentData = [];
    sortedBookings.forEach((item) => {
      const date = new Date(item.BookingTime);
      if (item.Payment !== null) {
        const row = {
          month: `${date.getMonth() + 1}-${date.getFullYear()}`,
          Amount: item.Payment.Amount,
        };
        paymentData.push(row);
      }
    });

    // Gộp doanh thu theo tháng
    const result = paymentData.reduce((acc, curr) => {
      const existingItem = acc.find((item) => item.month === curr.month);
      if (existingItem) {
        existingItem.Amount += curr.Amount;
      } else {
        acc.push({ ...curr });
      }
      return acc;
    }, []);

    return result;
  };

  // Xử lý dữ liệu khi `bookings` hoặc `year` thay đổi
  useEffect(() => {
    const result = getPayment(year);

    // Lấy danh sách tháng từ dữ liệu đã xử lý
    const uniqueMonths = result.map((item) => item.month);
    setData(result);
    setMonths(uniqueMonths);
  }, [bookings, year]);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  return (
    <Card style={{ flex: 1, height: '500px', marginBottom: '30px' }}>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ padding: '10px 20px' }}>
        <h2 style={{ textAlign: 'center' }}>Doanh thu theo tháng</h2>
        <TextField
          select
          label="Chọn Năm"
          value={year}
          onChange={handleYearChange}
          sx={{ width: '150px' }}
        >
          {years.map((y) => (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <LineChart
        series={[
          {
            data: data.map((item) => item.Amount), // Giá trị doanh thu
            label: 'Doanh thu (VND)',
          },
        ]}
        xAxis={[
          {
            data: months, // Danh sách tháng trên trục X
            label: 'Tháng',
            scaleType: 'band',
          },
        ]}
        yAxis={[
          {
            label: 'VND',
          },
        ]}
        height={400}
        sx={{
          [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
            transform: 'translateX(-40px)',
          },
        }}
        margin={{ top: 40, bottom: 50, left: 100, right: 40 }}
      />
    </Card>
  );
};

export default PaymentChart;
