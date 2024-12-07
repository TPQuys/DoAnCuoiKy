import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Card, Grid } from '@mui/material';
import { axisClasses } from '@mui/x-charts';

const PaymentChart = ({ bookings }) => {
  const [data, setData] = useState([]); // Lưu dữ liệu cho biểu đồ
  const [months, setMonths] = useState([]); // Lưu danh sách tháng

  // Hàm xử lý dữ liệu doanh thu
  const getPayment = () => {
    const sortedBookings = [...bookings].sort((a, b) => {
      const dateA = new Date(a.BookingTime);
      const dateB = new Date(b.BookingTime);
      return dateA - dateB; // Sắp xếp tăng dần
    });

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

  // Xử lý dữ liệu khi `bookings` thay đổi
  useEffect(() => {
    const result = getPayment();

    // Lấy danh sách tháng từ dữ liệu đã xử lý
    const uniqueMonths = result.map((item) => item.month);
    setData(result);
    setMonths(uniqueMonths);
  }, [bookings]);

  return (
    <Card style={{ flex: 1, height: '500px', marginBottom: '30px' }}>
      <Grid sx={{ height: '90px', padding: '10px' }}>
        <h2 style={{ textAlign: 'center' }}>Doanh thu theo tháng</h2>
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
