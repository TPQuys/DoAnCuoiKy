import React, { useEffect } from 'react';
import { View, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useDispatch } from "react-redux";
import { deleteBookingUser, getBookingByUser } from '@/redux/actions/bookingRequest'
import { Card, Title, Paragraph } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useState } from 'react';

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

const getDecore = (Decore) => {
    const lobby = Decore?.LobbyDecore ? "sảnh" : "";
    const stage = Decore?.StageDecore ? "sân khấu" : "";
    const table = Decore?.TableDecore ? "bàn" : "";

    // Tạo một mảng chỉ chứa các phần tử không rỗng
    const decoreArray = [lobby, stage, table]?.filter(item => item !== "");

    // Chỉ viết hoa chữ cái đầu tiên của phần tử đầu tiên
    if (decoreArray?.length > 0) {
        decoreArray[0] = decoreArray[0].charAt(0).toUpperCase() + decoreArray[0].slice(1);
    }

    return decoreArray.join(", ");
};

const Bookings = ({ bookings, user }) => {
    const [bookingData, setBookingData] = useState(bookings);
    const router = useRouter()
    const dispatch = useDispatch()

    const handlePaymentClick = (booking) => {
        router.push(`../(booking)/payment?bookingId=${booking.BookingID}`)
    };

    useEffect(() => {
        if (bookings?.length != bookingData?.length) {
            setBookingData(bookings)
        }
    }, [bookings])
    const handleDelete = async (booking) => {
        Alert.alert(
            "Xác nhận xóa booking",  // Tiêu đề của Alert
            "Bạn có chắc chắn muốn xóa booking này?",  // Nội dung của Alert
            [
                {
                    text: "Hủy",  // Nút Hủy
                    onPress: () => console.log("Đã hủy xóa booking"),
                    style: "cancel"  // Nút Hủy
                },
                {
                    text: "Xóa",  // Nút Xóa
                    onPress: async () => {
                        await deleteBookingUser(dispatch, booking.BookingID, user);
                        setBookingData(bookingData.filter((item) => item.BookingID !== booking.BookingID))
                    }
                }
            ],
            { cancelable: false }  // Thiết lập không thể thoát bằng cách nhấn ra ngoài Alert
        );
    };

    return (
        <View style={styles.container}>
            <Title>Lịch sử đặt</Title>
            <ScrollView>
                {bookingData?.filter(booking => booking != null).map((booking) => (
                    <Card style={styles.card} key={booking.BookingID.toString()}>
                        <Card.Content>
                            <Title>{getEventType(booking.Event?.EventType)}</Title>
                            <Paragraph>Tổng số bàn: {booking.Event?.TotalTable}</Paragraph>
                            <Paragraph>Ngày tổ chức: {formatDate(new Date(booking.Event?.EventDate))}</Paragraph>
                            <Paragraph>Thời gian: {getTime(booking.Event?.Time)}</Paragraph>
                            <Paragraph>Ghi chú: {booking.Event?.Note || 'Không có'}</Paragraph>
                            <Paragraph>Nhà hàng: {booking.Event?.RoomEvent?.RoomName}</Paragraph>
                            <Paragraph>Trang trí: {getDecore(booking?.Event?.Decore)}</Paragraph>
                            <Paragraph>
                                Thanh toán: {booking.Payment ? booking.Payment.PaymentMethod : 'Chưa thanh toán'}
                            </Paragraph>
                        </Card.Content>
                        {!booking.Payment && (
                            <View>
                                <Card.Actions style={styles.buttonContainer}>
                                    <Button title="Thanh toán ngay" onPress={() => handlePaymentClick(booking)} />
                                    <Button title="xóa" color={"red"} onPress={() => handleDelete(booking)} />
                                </Card.Actions>
                            </View>
                        )}
                    </Card>
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
        gap: 20
    }
});

export default Bookings;
