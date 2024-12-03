import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, ScrollView, Alert, TouchableOpacity, Text } from 'react-native';
import { useDispatch } from "react-redux";
import { deleteBookingUser } from '@/redux/actions/bookingRequest';
import { Card, Title, Paragraph } from 'react-native-paper';
import { useRouter } from 'expo-router';

const formatDate = (date) => {
    if (date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
};

const getEventType = (type) => {
    switch (type) {
        case 'WEDDING': return 'Đám cưới';
        case 'CONFERENCE': return 'Hội nghị';
        case 'BIRTHDAY': return 'Sinh nhật';
        case 'ORTHER': return 'Khác';
        default: return '';
    }
};

const getTime = (time) => {
    switch (time) {
        case 'MORNING': return 'Buổi sáng';
        case 'AFTERNOON': return 'Buổi chiều';
        case 'ALLDAY': return 'Cả ngày';
        default: return '';
    }
};
const getDecoreType = (decore) => {
    if (decore) {
        if (decore?.DecorePrice?.Type === 'BASIC') {
            return "Cơ bản"
        } else if (decore?.DecorePrice?.Type === 'ADVANCED') {
            return "Nâng cao"
        } else if (decore?.DecorePrice?.Type === 'PREMIUM') {
            return "Cao cấp"
        }
    }
}
const getDecore = (Decore) => {
    const lobby = Decore?.LobbyDecore ? "sảnh" : "";
    const stage = Decore?.StageDecore ? "sân khấu" : "";
    const table = Decore?.TableDecore ? "bàn" : "";

    // Tạo một mảng chỉ chứa các phần tử không rỗng
    const decoreArray = [lobby, stage, table]?.filter(item => item !== "");

    // Chỉ viết hoa chữ cái đầu tiên của phần tử đầu tiên
    if (decoreArray.length > 0) {
        decoreArray[0] = decoreArray[0].charAt(0).toUpperCase() + decoreArray[0].slice(1);
    }

    return decoreArray.join(", ") + " ("+getDecoreType(Decore)+")";
};

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

const isExpiry = (LinkExpiry) => {
    const experi = new Date(LinkExpiry)
    const curent = new Date()
    if (experi < curent) {
        return true;
    } else {
        return false;
    }
}

const Bookings = ({ bookings, user }) => {
    const [bookingData, setBookingData] = useState(bookings);
    const [expandedBooking, setExpandedBooking] = useState(null); // State để quản lý booking đang mở rộng
    const router = useRouter();
    const dispatch = useDispatch();
    const handlePaymentClick = (booking) => {
        router.push(`../(booking)/payment?bookingId=${booking.BookingID}`);
    };

    useEffect(() => {
        if (bookings?.length !== bookingData?.length) {
            setBookingData(bookings);
        }
    }, [bookings]);

    const handleDelete = async (booking) => {
        Alert.alert(
            "Xác nhận xóa booking",
            "Bạn có chắc chắn muốn xóa booking này?",
            [
                {
                    text: "Hủy",
                    onPress: () => console.log("Đã hủy xóa booking"),
                    style: "cancel"
                },
                {
                    text: "Xóa",
                    onPress: async () => {
                        await deleteBookingUser(dispatch, booking.BookingID, user);
                        setBookingData(bookingData.filter((item) => item.BookingID !== booking.BookingID));
                    }
                }
            ],
            { cancelable: false }
        );
    };

    // Hàm để mở/đóng chi tiết của booking
    const toggleBookingDetail = (bookingId) => {
        if (expandedBooking === bookingId) {
            setExpandedBooking(null); // Nếu booking đã mở, đóng lại
        } else {
            setExpandedBooking(bookingId); // Mở chi tiết của booking
        }
    };
    const menuPrice = (menu) => {
        const foodTotalPrice = menu?.Food?.reduce((total, food) => {
            return total + (food.UnitPrice * food.MenuFoods.Quantity);
        }, 0);

        const drinksTotalPrice = menu?.Drinks?.reduce((total, drink) => {
            return total + (drink.UnitPrice * drink.MenuDrinks.Quantity);
        }, 0);

        const totalMenuPrice = foodTotalPrice + drinksTotalPrice;
        return totalMenuPrice
    }

    const showMenu = (menu) => (
        <View style={styles.dishesContainer}>
            <Text style={styles.menuTitle}>{menu?.Name}</Text>
            <Text style={styles.menuPrice}>{`Giá: ${menuPrice(menu).toLocaleString()} VND/bàn`}</Text>
            <Text style={styles.dishesTitle}>Danh sách món ăn:</Text>
            {menu?.Food.map((food, i) => (
                <Text key={i} style={styles.dishText}>{`${food?.Name} - ${food?.UnitPrice.toLocaleString()} VND (${food?.MenuFoods.Quantity} phần)`}</Text>
            ))}
            <Text style={styles.dishesTitle}>Danh sách thức uống:</Text>
            {menu?.Drinks.map((drink, i) => (
                <Text key={i} style={styles.dishText}>{`${drink?.Name} - ${drink?.UnitPrice.toLocaleString()} VND (${drink?.MenuDrinks.Quantity} phần)`}</Text>
            ))}
        </View>
    )

    const showPayment = (paymentData) => (
        <View style={styles.dishesContainer}>
            <Text style={styles.dishText} >Số tiền: {paymentData?.Amount?.toLocaleString()} VND</Text>
            <Text style={styles.dishText} >Ngày thanh toán: {formatDateTime(paymentData?.PaymentDate)}</Text>
            <Text style={styles.dishText} >Phương thức thanh toán: {paymentData?.PaymentMethod}</Text>
        </View>
    )

    return (
        <View style={styles.container}>
            <Title>Lịch sử đặt</Title>
            <ScrollView>
                {bookingData
                    ?.filter(booking => booking != null)
                    .sort((a, b) => new Date(b.BookingTime) - new Date(a.BookingTime)) // Sắp xếp theo BookingTime
                    .map((booking) => (
                        <TouchableOpacity
                            onPress={() => toggleBookingDetail(booking.BookingID)}
                            key={booking.BookingID.toString()}
                        >
                            <Card style={styles.card}>
                                <Card.Content>
                                    <Title>{getEventType(booking.Event?.EventType)}</Title>
                                    <Paragraph>Đặt lúc: {formatDateTime(new Date(booking?.BookingTime))}</Paragraph>
                                    <Paragraph>Nhà hàng: {booking.Event?.RoomEvent?.RoomName}</Paragraph>
                                    <Paragraph>Tổng số bàn: {booking.Event?.TotalTable}</Paragraph>
                                    <Paragraph>Ngày tổ chức: {formatDate(new Date(booking.Event?.EventDate))}</Paragraph>
                                    <Paragraph>Thời gian: {getTime(booking.Event?.Time)}</Paragraph>
                                    <Paragraph>Trang trí: {getDecore(booking?.Event?.Decore)}</Paragraph>
                                    <Paragraph>Ghi chú: {booking.Event?.Note || 'Không có'}</Paragraph>
                                    <Paragraph>
                                        Thanh toán: {booking?.Payment ? booking?.Payment.PaymentMethod : 'Chưa thanh toán'}
                                    </Paragraph>
                                </Card.Content>

                                {expandedBooking === booking?.BookingID && (
                                    <Card.Content>
                                        <Title>Chi tiết menu</Title>
                                        {showMenu(booking?.Event?.Menu) || 'Không có menu'}

                                        <Title>Chi tiết thanh toán</Title>
                                        {showPayment(booking?.Payment) || 'Chưa thanh toán'}
                                    </Card.Content>
                                )}

                                <Card.Actions style={styles.buttonContainer}>
                                    {!booking.Payment && (
                                        <>
                                            {isExpiry(booking.LinkExpiry) ? (
                                                <Button color="grey" title="Đã hết hạn" />
                                            ) : (
                                                <Button title="Thanh toán ngay" onPress={() => handlePaymentClick(booking)} />
                                            )}
                                            <Button title="Xóa" color="red" onPress={() => handleDelete(booking)} />
                                        </>
                                    )}
                                </Card.Actions>
                            </Card>
                        </TouchableOpacity>
                    ))}

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        marginVertical: 40,
    },
    card: {
        marginBottom: 10,
    },
    buttonContainer: {
        gap: 20,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    menuPrice: {
        fontSize: 12,
        color: "#555",
    },
    dishesContainer: {
    },
    dishesTitle: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
    },
    dishText: {
        fontSize: 12,
        color: "#333",
    },
});

export default Bookings;
