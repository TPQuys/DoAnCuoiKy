import React, { useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Card, Grid as Grid2, MenuItem, Select } from '@mui/material';
import { axisClasses } from '@mui/x-charts';

const RoomEventBarChart = ({ bookings }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Năm hiện tại

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value); // Cập nhật năm được chọn
  };

  const getData = () => {
    const sortedBookings = [...bookings].sort((a, b) => {
      const dateA = new Date(a.Event?.EventDate);
      const dateB = new Date(b.Event?.EventDate);
      return dateA - dateB;
    });

    let roomData = [];
    sortedBookings.forEach((item) => {
      const date = new Date(item.Event?.EventDate);
      if (item.Payment !== null) {
        const row = { 
          month: date.getMonth() + 1, 
          year: date.getFullYear(), 
          RoomName: item?.Event?.RoomEvent?.RoomName 
        };
        roomData.push(row);
      }
    });

    const filteredData = roomData.filter((item) => item.year === selectedYear); // Lọc theo năm được chọn

    const result = filteredData.reduce((acc, curr) => {
      const existingItem = acc.find(
        (item) => item.RoomName === curr.RoomName && item.month === curr.month
      );
      if (existingItem) {
        existingItem.Count = (existingItem.Count || 0) + 1;
      } else {
        acc.push({ ...curr, Count: 1 });
      }
      return acc;
    }, []);

    return result;
  };

  const data = getData();

  const months = [...new Set(data.map((item) => item.month))]; // Danh sách tháng
  const rooms = [...new Set(data.map((item) => item.RoomName))]; // Danh sách phòng

  const seriesData = rooms.map((room) => {
    return {
      data: months.map(
        (month) =>
          data.find((item) => item.RoomName === room && item.month === month)?.Count || 0
      ),
      label: room,
    };
  });

  // Lấy danh sách năm có trong dữ liệu
  const years = [...new Set(bookings.map((item) => new Date(item.Event?.EventDate).getFullYear()))];

  return (
    <Card style={{ flex: 1, height: "500px", minWidth: "500px" }}>
      <Grid2 container justifyContent="space-between" alignItems="center" sx={{ padding: "10px" }}>
        <h2 style={{ textAlign: 'center' }}>Số lượng phòng được đặt theo tháng</h2>
        <Select 
          value={selectedYear} 
          onChange={handleYearChange}
          size="small"
          style={{ width: 120 }}
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </Grid2>
      <BarChart
        series={seriesData}
        xAxis={[
          {
            data: months.map((month) => `Tháng ${month}`),
            label: 'Tháng',
            scaleType: 'band',
          },
        ]}
        yAxis={[
          {
            label: 'Số lần được đặt',
          },
        ]}
        sx={{
          [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
            transform: 'translateX(-20px)',
          },
        }}
        height={400}
        margin={{ top: 40, bottom: 50, left: 70, right: 40 }}
      />
    </Card>
  );
};

export default RoomEventBarChart;
