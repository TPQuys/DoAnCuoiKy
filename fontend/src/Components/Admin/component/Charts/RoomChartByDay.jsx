import React, { useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { Card, Grid as Grid2, MenuItem, Select, ToggleButton, ToggleButtonGroup } from '@mui/material';

const RoomEventCombinedChart = ({ bookings }) => {
  const [viewMode, setViewMode] = useState('month'); // Chế độ hiển thị: month (tháng) hoặc day (ngày)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Năm hiện tại
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Tháng hiện tại

  const handleViewModeChange = (event, newView) => {
    if (newView) setViewMode(newView);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const getMonthlyData = () => {
    const filteredBookings = bookings.filter((item) => {
      const date = new Date(item.Event?.EventDate);
      return date.getFullYear() === selectedYear;
    });

    let roomData = [];
    filteredBookings.forEach((item) => {
      const date = new Date(item.Event?.EventDate);
      if (item.Payment !== null) {
        const month = date.getMonth() + 1;
        roomData.push({ month, RoomName: item.Event?.RoomEvent?.RoomName });
      }
    });

    const result = roomData.reduce((acc, curr) => {
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

    return result.sort((a, b) => a.month - b.month);
  };

  const getDailyData = () => {
    const filteredBookings = bookings.filter((item) => {
      const date = new Date(item.Event?.EventDate);
      return (
        date.getFullYear() === selectedYear && date.getMonth() + 1 === selectedMonth
      );
    });

    let dailyData = [];
    filteredBookings.forEach((item) => {
      const date = new Date(item.Event?.EventDate);
      if (item.Payment !== null) {
        const day = date.getDate();
        dailyData.push({ day });
      }
    });

    const result = dailyData.reduce((acc, curr) => {
      const existingItem = acc.find((item) => item.day === curr.day);
      if (existingItem) {
        existingItem.Count = (existingItem.Count || 0) + 1;
      } else {
        acc.push({ day: curr.day, Count: 1 });
      }
      return acc;
    }, []);

    return result.sort((a, b) => a.day - b.day);
  };

  const monthlyData = getMonthlyData();
  const dailyData = getDailyData();

  const months = [...new Set(monthlyData.map((item) => item.month))];
  const days = dailyData.map((item) => item.day);

  const rooms = [...new Set(monthlyData.map((item) => item.RoomName))];

  const monthlySeries = rooms.map((room) => ({
    data: months.map(
      (month) =>
        monthlyData.find((item) => item.RoomName === room && item.month === month)?.Count || 0
    ),
    label: room,
  }));

  const dailyCounts = dailyData.map((item) => item.Count);

  const years = [...new Set(bookings.map((item) => new Date(item.Event?.EventDate).getFullYear()))];
  const allMonths = [...Array(12)].map((_, index) => index + 1);

  return (
    <Card style={{ flex: 1, height: "600px", padding: "20px" }}>
      <Grid2 container justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
        <h2 style={{ textAlign: 'center' }}>
          {viewMode === 'month' ? 'Số lượng phòng được đặt theo tháng trong năm' : 'Số lượng phòng được đặt theo ngày trong tháng'}
        </h2>
        <div>
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            size="small"
            style={{ width: 100, marginRight: 10 }}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
          {viewMode === 'day' && (
            <Select
              value={selectedMonth}
              onChange={handleMonthChange}
              size="small"
              style={{ width: 140 }}
            >
              {allMonths.map((month) => (
                <MenuItem key={month} value={month}>
                  Tháng {month}
                </MenuItem>
              ))}
            </Select>
          )}
        </div>
      </Grid2>
      <Grid2 container justifyContent="center" sx={{ marginBottom: 2 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="View mode"
          size="small"
        >
          <ToggleButton value="month" aria-label="Month View">
            Theo tháng
          </ToggleButton>
          <ToggleButton value="day" aria-label="Day View">
            Theo ngày
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid2>
      {viewMode === 'month' ? (
        <BarChart
          series={monthlySeries}
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
          height={400}
          margin={{ top: 40, bottom: 50, left: 70, right: 40 }}
        />
      ) : (
        <LineChart
          series={[
            {
              data: dailyCounts,
              label: 'Số lần được đặt',
            },
          ]}
          xAxis={[
            {
              data: days,
              label: 'Ngày',
            },
          ]}
          yAxis={[
            {
              label: 'Số lượng đặt phòng',
            },
          ]}
          height={400}
          margin={{ top: 40, bottom: 50, left: 70, right: 40 }}
        />
      )}
    </Card>
  );
};

export default RoomEventCombinedChart;
