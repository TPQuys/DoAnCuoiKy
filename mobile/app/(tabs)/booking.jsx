import React, { useRef, useState } from "react";
import { Text, View, Image, ScrollView, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { getAvailableRooms } from "@/redux/actions/roomRequest";
import { useRouter } from "expo-router";
import EventFrom from '@/components/EventFrom'
import { getAllDrink, getAllFood, getAllMenus } from "@/redux/actions/menuRequest";
import { useDispatch } from "react-redux";
import { getDecorePrice } from "@/redux/actions/decoreRequest";
const HomePage = () => {
    const dispatch = useDispatch()
    const router = useRouter();
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const [availableRooms, setAvailableRooms] = useState(null);
    const [formData, setFormData] = useState({});
    getAllMenus(dispatch);
    getAllFood(dispatch);
    getAllDrink(dispatch);
    getDecorePrice(dispatch)
    const handleSubmit = async (values) => {
        if (values?.Time === "CUSTOM" && from === null) {
            return;
        }
        const finalData = { ...values, From: from, To: to };
        setFormData(finalData);
        const res = await getAvailableRooms(finalData);
        setAvailableRooms(res);
    };

    const handleBooking = (room) => {
        router.push({
            pathname: '/(booking)/detail',
            params: { formData: JSON.stringify(formData), room: JSON.stringify(room) }
          });
      };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.body}>
                <Text style={styles.roomName}>Nhập Thông Tin Sự Kiện</Text>

                <EventFrom RoomEventID={null} setFrom={setFrom} setTo={setTo} handleSubmit={handleSubmit} maxTable={50} />

                <View style={styles.roomListContainer}>
                    {availableRooms?.length > 0 ? (
                        availableRooms.map((item) =>
                            item.Status === "OPEN" ? (
                                <View key={item.RoomEventID} style={styles.roomCard}>
                                    <View style={styles.roomCardContent}>
                                        {/* Image */}
                                        <View style={styles.roomImageContainer}>
                                            <Image
                                                source={{ uri: item.RoomImage }}
                                                style={styles.roomImage}
                                            />
                                        </View>
                                        {/* Room Details */}
                                        <View style={styles.roomDetails}>
                                            <Text style={styles.roomTitle}>{item.RoomName}</Text>
                                            <Text style={styles.roomInfo}>
                                                <Text style={styles.bold}>Kích thước:</Text> Chiều dài: {item.HeightRoom}m, Chiều rộng: {item.WidthRoom}m
                                            </Text>
                                            <Text style={styles.roomInfo}>
                                                <Text style={styles.bold}>Sức chứa:</Text> Số người: {item.Capacity}, Số bàn tối đa: {item.MaxTable}
                                            </Text>
                                            <Text style={styles.roomDescription}>
                                                <Text style={styles.bold}>Mô tả:</Text> {item.Description}
                                            </Text>
                                        </View>
                                        {/* Price and Booking Button */}
                                        <View style={styles.roomPriceContainer}>
                                            <Text style={styles.roomPrice}>Giá {item.Price.toLocaleString()} VND</Text>
                                            <TouchableOpacity
                                                style={styles.bookButton}
                                                onPress={() => handleBooking(item)}
                                            >
                                                <Text style={styles.bookButtonText}>Đặt ngay</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            ) : null
                        )
                    ) : (
                        <View style={styles.noRoomContainer}>
                            <Image
                                source={{ uri: "https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/public/Event/home_decor.jpg" }}
                                style={styles.noRoomImage}
                            />
                            <Text style={styles.noRoomText}>
                                {availableRooms === null
                                    ? "Hãy nhập thông tin để tìm kiếm phòng phù hợp"
                                    : "Rất tiếc hiện không có địa điểm phù hợp với bạn"}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    body: {
        padding: 16,
    },
    roomName: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    roomListContainer: {
        maxHeight: 700,
        overflowY: "auto",
        minHeight: 600,
    },
    roomCard: {
        marginBottom: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    roomCardContent: {
        flexDirection: "row",
    },
    roomImageContainer: {
        width: "30%",
    },
    roomImage: {
        width: "100%",
        height: 120,
        borderRadius: 8,
    },
    roomDetails: {
        paddingLeft: 16,
        flex: 1,
    },
    roomTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    roomInfo: {
        fontSize: 14,
        marginBottom: 4,
    },
    bold: {
        fontWeight: "bold",
    },
    roomDescription: {
        fontSize: 14,
    },
    roomPriceContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
    },
    roomPrice: {
        fontSize: 18,
        fontWeight: "bold",
    },
    bookButton: {
        backgroundColor: "#64463c",
        padding: 12,
        marginTop: 8,
        borderRadius: 4,
    },
    bookButtonText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
    },
    noRoomContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
    },
    noRoomImage: {
        width: "100%",
        height: 250,
        borderRadius: 16,
    },
    noRoomText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        position: "absolute",
        bottom: "20%",
    },
});

export default HomePage;
