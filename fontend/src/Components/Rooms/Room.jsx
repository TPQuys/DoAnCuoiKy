import "./room.css";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Header from "../Header/Header";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Card, Grid, Typography, Box } from "@mui/material";

const RoomPage = () => {
    const rooms = useSelector((state) => state.rooms?.rooms);
    const navigate = useNavigate();
    const [sortOption, setSortOption] = useState(""); // Loại sắp xếp hiện tại
    const [sortDirection, setSortDirection] = useState("asc"); // Hướng sắp xếp (tăng hoặc giảm)

    // Hàm xử lý khi nhấn nút sắp xếp
    const handleSort = (option) => {
        if (sortOption === option) {
            // Nếu nhấn vào nút hiện tại, đổi hướng sắp xếp
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            // Nếu nhấn vào nút khác, đặt loại sắp xếp và mặc định hướng là "asc"
            setSortOption(option);
            setSortDirection("asc");
        }
    };

    // Hàm sắp xếp danh sách phòng
    const getSortedRooms = () => {
        if (!rooms) return [];
        let sortedRooms = [...rooms];

        if (sortOption === "name") {
            sortedRooms.sort((a, b) =>
                sortDirection === "asc"
                    ? a.RoomName.localeCompare(b.RoomName)
                    : b.RoomName.localeCompare(a.RoomName)
            );
        } else if (sortOption === "price") {
            sortedRooms.sort((a, b) =>
                sortDirection === "asc" ? a.Price - b.Price : b.Price - a.Price
            );
        } else if (sortOption === "maxTable") {
            sortedRooms.sort((a, b) =>
                sortDirection === "asc" ? a.MaxTable - b.MaxTable : b.MaxTable - a.MaxTable
            );
        }

        return sortedRooms;
    };

    return (
        <main className="room-container">
            <Header
                background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/room-header.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9yb29tLWhlYWRlci5qcGciLCJpYXQiOjE3Mjk4NjU2NDQsImV4cCI6MTc2MTQwMTY0NH0.X1m9vEDzQi-PR17kKxJDvoxcfBTjNmimrzGOFC_F6Eg&t=2024-10-25T14%3A14%3A02.614Z"
                title="PHÒNG SỰ KIỆN"
            />

            {/* Các nút sắp xếp */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "16px", width:"100%", mt:3 }}>
                    <Button
                        variant={sortOption === "name" ? "contained" : "outlined"}
                        onClick={() => handleSort("name")}
                        sx={{
                            backgroundColor: sortOption === "name" ? "#64463c" : "#fff",
                            color: sortOption === "name" ? "#fff" : "#000",
                        }}
                    >
                        Sắp xếp theo tên {sortOption === "name" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                    </Button>
                    <Button
                        variant={sortOption === "price" ? "contained" : "outlined"}
                        onClick={() => handleSort("price")}
                        sx={{
                            backgroundColor: sortOption === "price" ? "#64463c" : "#fff",
                            color: sortOption === "price" ? "#fff" : "#000",
                        }}
                    >
                        Sắp xếp theo giá {sortOption === "price" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                    </Button>
                    <Button
                        variant={sortOption === "maxTable" ? "contained" : "outlined"}
                        onClick={() => handleSort("maxTable")}
                        sx={{
                            backgroundColor: sortOption === "maxTable" ? "#64463c" : "#fff",
                            color: sortOption === "maxTable" ? "#fff" : "#000",
                        }}
                    >
                        Sắp xếp theo số bàn tối đa {sortOption === "maxTable" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                    </Button>
            </Box>
            <div className="room-body">
                <div className="booking-center">
                    {getSortedRooms().map((item) =>
                        item.Status === "OPEN" ? (
                            <Card sx={{ p: 3, width: "100%" }} key={item.RoomEventID}>
                                <Grid
                                    container
                                    style={{
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                        padding: "16px",
                                        marginBottom: "16px",
                                    }}
                                >
                                    {/* Hình ảnh bên trái */}
                                    <Grid item xs={3} alignContent="center">
                                        <img
                                            src={item.RoomImage}
                                            alt="room"
                                            style={{ width: "100%", borderRadius: "8px" }}
                                        />
                                    </Grid>
                                    {/* Thông tin bên phải */}
                                    <Grid item xs={7} justifyItems="left" pl={4}>
                                        <Typography variant="h6" gutterBottom>
                                            <Link
                                                to={`/`}
                                                className="room-content-title"
                                                style={{ textDecoration: "none", color: "#64463c" }}
                                            >
                                                {item.RoomName}
                                            </Link>
                                        </Typography>
                                        <Typography variant="body2" gutterBottom>
                                            <strong>Kích thước:</strong> Chiều dài: {item.HeightRoom}m, Chiều rộng: {item.WidthRoom}m
                                        </Typography>
                                        <Typography variant="body2" gutterBottom>
                                            <strong>Sức chứa:</strong> Số người: {item.Capacity}, Số bàn tối đa: {item.MaxTable}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            component="div"
                                            gutterBottom
                                            align="left"
                                            style={{ textAlign: "left" }}
                                        >
                                            <strong>Mô tả:</strong> {item.Description}
                                        </Typography>
                                        {item.Rates && item.Rates.length > 0 ? (
                                            <Typography variant="body2" color="textSecondary">
                                                <strong>Đánh giá trung bình:</strong>{" "}
                                                {(
                                                    item.Rates.reduce((sum, rate) => sum + parseInt(rate.Rate), 0) /
                                                    item.Rates.length
                                                ).toFixed(1)}{" "}
                                                / 5
                                            </Typography>
                                        ) : (
                                            ""
                                        )}
                                    </Grid>
                                    <Grid item xs={2} justifyItems="center" alignContent="center">
                                        <Typography variant="h5">Giá {item.Price.toLocaleString()} VND</Typography>
                                        <Button
                                            variant="contained"
                                            sx={{ backgroundColor: "#64463c", color: "#fff", marginTop: "8px" }}
                                            onClick={() =>
                                                navigate(`/room/${item.RoomEventID}`, {
                                                    state: { roomDetail: item }, // Truyền thông tin phòng qua state
                                                })
                                            }
                                        >
                                            Chi tiết
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Card>
                        ) : "")
                    }
                </div>
            </div>
        </main>
    );
};

export default RoomPage;
