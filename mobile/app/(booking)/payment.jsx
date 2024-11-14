import React, { useEffect, useState } from "react";
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, ScrollView, Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getBookingById } from "../../redux/actions/bookingRequest";
import { PostZaloApi } from '../../redux/actions/paymentRequest';
import { Link, useGlobalSearchParams } from "expo-router";
import { AppState } from 'react-native';

const getMenuPrice = (menu) => {
    if (menu) {
        let totalMenuPrice = 0;
        const foodTotalPrice = menu?.Food.reduce((total, food) => {
            return total + food.UnitPrice * food.MenuFoods.Quantity;
        }, 0);
        const drinksTotalPrice = menu?.Drinks.reduce((total, drink) => {
            return total + drink.UnitPrice * drink.MenuDrinks.Quantity;
        }, 0);
        totalMenuPrice = foodTotalPrice + drinksTotalPrice;
        return totalMenuPrice;
    }
    return 0;
};

const formatDate = (date) => {
    if (date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
};

const getEventType = (type) => {
    if (type) {
        if (type === "WEDDING") {
            return "Đám cưới";
        } else if (type === "CONFERENCE") {
            return "Hội nghị";
        } else if (type === "BIRTHDAY") {
            return "Sinh nhật";
        } else if (type === "ORTHER") {
            return "Khác";
        }
    }
};

const getTime = (time) => {
    if (time) {
        if (time === "MORNING") {
            return "Buổi sáng";
        }
        if (time === "AFTERNOON") {
            return "Buổi chiều";
        }
        if (time === "ALLDAY") {
            return "Cả ngày";
        }
    }
};
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

    return decoreArray.join(", ");
};
const roomPriceByEvent = (event, roomPrice) => {
    if (event?.Time === "ALLDAY") {
        return roomPrice * 1.5;
    } else {
        return roomPrice;
    }
};

const PaymentPage = () => {
    const [event, setEvent] = useState({});
    const [newBooking, setNewBooking] = useState({});
    const [isDisable, setIsDisable] = useState(false);
    const [remainingTime, setRemainingTime] = useState(900);
    const { bookingId } = useGlobalSearchParams();
    const [appState, setAppState] = useState(AppState.currentState);
    const user = useSelector((state) => state.auth.login.currentUser);
    const dispatch = useDispatch();

    const getBooking = async () => {
        const responseBooking = await getBookingById(dispatch, bookingId, user);
        if (responseBooking) {
            // console.log(responseBooking)
            setNewBooking(responseBooking?.data);
            setEvent(responseBooking.data?.Event);
        }
    };

    useEffect(() => {
        // Tính toán thời điểm kết thúc (bookingTime + 15 phút)
        const endTime = new Date(newBooking.BookingTime).getTime() + 15 * 60 * 1000;

        // Cập nhật thời gian còn lại mỗi giây
        const interval = setInterval(() => {
            const currentTime = new Date().getTime();
            const timeLeft = Math.max(0, Math.floor((endTime - currentTime) / 1000));
            setRemainingTime(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(interval);
            }
        }, 1000);

        // Dọn dẹp interval khi component bị huỷ
        return () => clearInterval(interval);
    }, [newBooking.BookingTime]);

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;


    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
                getBooking();
            }
            setAppState(nextAppState);
        });
        return () => subscription.remove();
    }, []);

    useEffect(() => {
        getBooking();
        setIsDisable(false);
    }, []);

    const handlePayment = async () => {
        setIsDisable(true);
        if (newBooking) {
            if (newBooking.PaymentLink) {
                Linking.openURL(newBooking.PaymentLink);
                setIsDisable(false)
            }
        }
        setIsDisable(false);

    };



    return (
        <ScrollView style={styles.container}>
            <View style={styles.paymentBody}>
                <View style={styles.flex}>
                    <View style={styles.paymentRoom}>
                        <Text style={styles.roomTitle}>Nhà hàng: {event.RoomEvent?.RoomName}</Text>
                        <Text style={styles.roomPrice}>Giá: {(event.RoomEvent?.Price)?.toLocaleString()} VND</Text>
                        <Image source={{ uri: event.RoomEvent?.RoomImage }} style={styles.paymentImg} />
                    </View>

                    <View style={styles.paymentEvent}>
                        <Text style={styles.eventTitle}>Thông tin sự kiện:</Text>
                        <View style={styles.paymentContent}>
                            <Text>Ngày tổ chức: {formatDate(new Date(event?.EventDate))}</Text>
                            <Text>Loại sự kiện: {getEventType(event?.EventType)}</Text>
                            <Text>Thời gian: {getTime(event?.Time)}</Text>
                            <Text>Tổng số bàn: {event?.TotalTable}</Text>
                            <Text>Trang trí: {getDecore(event?.Decore)}</Text>
                            <Text>Ghi chú: {event?.Note}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.flex}>
                    <View style={styles.paymentMenu}>
                        <Text style={styles.menuTitle}>Menu</Text>
                        <Text style={styles.menuPrice}>Tổng giá:</Text>
                        <Text style={styles.menuPrice}>{getMenuPrice(event.Menu)?.toLocaleString()} VND/Bàn</Text>
                        <View>
                            <Text style={styles.itemTitle}>Món ăn</Text>
                            {event.Menu?.Food.map((food, idx) => (
                                <View key={idx} style={styles.menuItem}>
                                    <Text style={styles.textItem}>{food.Name}</Text>
                                </View>
                            ))}
                        </View>
                        <View>
                            <Text style={styles.itemTitle}>Đồ uống</Text>
                            {event.Menu?.Drinks.map((drink, idx) => (
                                <View key={idx} style={styles.menuItem}>
                                    <Text style={styles.textItem}>{drink.Name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.paymentMenu}>
                        <View style={styles.paymentPrice}>
                            <Text style={styles.totalPrice}>TỔNG GIÁ</Text>
                            <Text style={styles.totalAmount}>
                                {(getMenuPrice(event.Menu) * event.TotalTable + roomPriceByEvent(event, event.RoomEvent?.Price))?.toLocaleString()} VND
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.paymentButtonContainer}>
                    {newBooking.Payment ? <Text>Đã thanh toán</Text> : remainingTime >1 ? (
                        <TouchableOpacity
                            style={styles.paymentButton}
                            onPress={handlePayment}
                            disabled={isDisable}
                        >
                            <Text style={styles.paymentButtonText}>Thanh toán({minutes}:{seconds < 10 ? '0' : ''}{seconds})</Text>
                        </TouchableOpacity>
                    ) : <Text>Lịch đặt đã hết hạn</Text>
                    }
                    <Link style={styles.link} href={'../(tabs)/home'}>Về trang chủ</Link>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fafaeb",
    },
    paymentBody: {
        margin: 40,
        marginHorizontal: 20,
    },
    flex: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    paymentRoom: {
        width: '48%',
    },
    roomTitle: {
        fontWeight: '600',
        color: '#64463c',
    },
    roomPrice: {
        fontWeight: '600',
        color: '#64463c',
    },
    paymentImg: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    paymentEvent: {
        width: '48%',
    },
    eventTitle: {
        fontWeight: '600',
        color: '#64463c',
    },
    paymentContent: {
        marginTop: 20,
    },
    paymentMenu: {
        padding: 10,
        backgroundColor: '#64463c',
        borderRadius: 5,
        marginBottom: 10,
        justifyContent: 'flex-end',
        flex: 1
    },
    menuTitle: {
        color: 'white',
        fontWeight: '700',
        textAlign: "center",
        fontSize: 20
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        paddingVertical: 5,
    },
    itemTitle: {
        textAlign: 'center',
        fontWeight: "700",
        color: 'white'
    },
    textItem: {
        color: "white"
    },
    menuPrice: {
        color: 'white',
    },
    paymentPrice: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    totalPrice: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    totalAmount: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },
    paymentButtonContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    paymentButton: {
        backgroundColor: '#e5cc5f',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 5,
    },
    paymentButtonText: {
        color: 'white',
        fontSize: 18,
    },
    link: {
        margin: 20,
        fontSize: 14,
        fontWeight: "700"
    }
});

export default PaymentPage;
