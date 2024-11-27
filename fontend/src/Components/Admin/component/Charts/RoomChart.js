import React, { useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Card, Grid2 } from '@mui/material';
import { axisClasses } from '@mui/x-charts';



const RoomEventBarChart = ({ bookings }) => {

  const getData = () => {

    const sortedBookings = [...bookings].sort((a, b) => {
      const dateA = new Date(a.Event?.EventDate);
      const dateB = new Date(b.Event?.EventDate);
      return dateA - dateB; // Sắp xếp tăng dần (nhỏ -> lớn)
    });


    let roomData = []
    sortedBookings.map((item) => {
      const date = new Date(item.Event?.EventDate)
      if (item.Payment !== null) {
        const row = { month: date.getMonth() + 1 + '-' + date.getFullYear(), RoomName: item.Event.RoomEvent.RoomName }
        roomData.push(row)
      }
    })

    const result = roomData.reduce((acc, curr) => {
      const existingItem = acc.find(item => item.RoomName === curr.RoomName && item.month === curr.month);
      if (existingItem) {
        existingItem.Count = (existingItem.Count || 0) + 1
      } else {
        acc.push({ ...curr, Count: 1 })
      }
      return acc;
    }, [])

    console.log(result)
    return result
  }


  const data = getData()

  // Chuẩn bị dữ liệu cho biểu đồ
  const months = [...new Set(data.map((item) => item.month))]; // Danh sách tháng (1, 2,...)
  const rooms = [...new Set(data.map((item) => item.RoomName))]; // Danh sách phòng (RoomA, RoomB,...)

  const seriesData = rooms.map((room) => {
    return {
      data: months.map(
        (month) =>
          data.find((item) => item.RoomName === room && item.month === month)?.Count || 0
      ),
      label: room,
    };
  });

  return (
    <Card style={{ flex: 1, height: "500px", minWidth: "500px" }}>
      <Grid2 sx={{ height: "90px", padding: "10px" }}>
        <h2 style={{ textAlign: 'center' }}>Số lượng phòng được đặt theo tháng</h2>
      </Grid2>
      <BarChart
        series={seriesData} // Gán dữ liệu động vào series
        xAxis={[
          {
            data: months.map((month) => `Tháng ${month}`), // Trục X là các tháng
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
