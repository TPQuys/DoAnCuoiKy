import React, { useRef, useState } from "react";
import { Text, View, Image, ScrollView, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { getAvailableRooms } from "@/redux/actions/roomRequest";
import { useRouter } from "expo-router";
import EventFrom from '@/components/EventFrom'
import { useDispatch } from "react-redux";
const HomePage = () => {
    const dispatch = useDispatch()
    const router = useRouter();
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const [availableRooms, setAvailableRooms] = useState(null);
    const [formData, setFormData] = useState({});
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
        marginTop:20,
        backgroundColor: "#f9f9f9",
    },
    body: {
        marginTop: 20,
        paddingHorizontal: 12,
    },
    roomName: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
    },
    roomCard: {
        marginBottom: 20,
        borderRadius: 12,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
        overflow: "hidden",
    },
    roomImage: {
        width: "100%",
        height: 150, // Giảm chiều cao để phù hợp màn hình nhỏ
    },
    roomDetails: {
        padding: 12,
    },
    roomTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 6,
        color: "#64463c",
    },
    roomInfo: {
        fontSize: 14,
        color: "#555",
        marginBottom: 4,
    },
    bold: {
        fontWeight: "bold",
        color: "#333",
    },
    roomPriceContainer: {
        paddingHorizontal: 12,
        paddingBottom: 12,
        alignItems: "center",
    },
    roomPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#d65a31",
        marginBottom: 8,
    },
    bookButton: {
        backgroundColor: "#64463c",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
        alignItems: "center",
    },
    bookButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
    noRoomContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
    },
    noRoomImage: {
        width: "100%",
        height: 200,
        borderRadius: 12,
    },
    noRoomText: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        color: "#555",
        marginTop: 16,
    },
});


export default HomePage;
