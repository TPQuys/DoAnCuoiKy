import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const RoomDetailPage = () => {
    const router = useRouter();
    const { room } = useLocalSearchParams(); // Nhận params từ route

    const roomDetail = room ? JSON.parse(room) : null;

    if (!roomDetail) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Không tìm thấy thông tin phòng.</Text>
            </View>
        );
    }

    const averageRating =
        roomDetail.Rates && roomDetail.Rates.length > 0
            ? (roomDetail.Rates.reduce((sum, rate) => sum + parseInt(rate.Rate), 0) / roomDetail.Rates.length).toFixed(1)
            : "Chưa có";

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>PHÒNG SỰ KIỆN</Text>
            </View>

            {/* Room Image */}
            <Image source={{ uri: roomDetail.RoomImage }} style={styles.roomImage} />

            {/* Room Details */}
            <View style={styles.detailsContainer}>
                <Text style={styles.roomName}>{roomDetail.RoomName}</Text>
                <Text style={styles.infoText}>
                    <Text style={styles.bold}>Kích thước:</Text> {roomDetail.HeightRoom}m x {roomDetail.WidthRoom}m
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.bold}>Sức chứa:</Text> {roomDetail.Capacity} người |{" "}
                    <Text style={styles.bold}>Số bàn tối đa:</Text> {roomDetail.MaxTable}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.bold}>Đánh giá trung bình:</Text> {averageRating} / 5
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.bold}>Mô tả:</Text> {roomDetail.Description}
                </Text>
                <Text style={styles.price}>Giá: {roomDetail.Price.toLocaleString()} VND</Text>

                {/* Ratings */}
                <Text style={styles.sectionTitle}>Đánh giá</Text>
                {roomDetail.Rates && roomDetail.Rates.length > 0 ? (
                    roomDetail.Rates.map((rate, index) => (
                        <View key={index} style={styles.ratingCard}>
                            <Text style={styles.commentText}>
                                <Text style={styles.bold}>Khách hàng:</Text> {rate.Email}
                            </Text>
                            <Text style={styles.commentText}>
                                <Text style={styles.bold}>Đánh giá phòng:</Text> {rate.Rate} / 5
                            </Text>
                            <Text style={styles.commentText}>
                                <Text style={styles.bold}>Đánh giá dịch vụ:</Text> {rate.RateService} / 5
                            </Text>
                            <Text style={styles.commentText}>
                                <Text style={styles.bold}>Bình luận:</Text> {rate.Comment}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noRating}>Chưa có đánh giá cho phòng này.</Text>
                )}
            </View>

            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() =>
                router.push(`/(booking)/bookingPage?roomId=${roomDetail.RoomEventID}`)
                
            }>
            <Text style={styles.backButtonText}>Đặt ngay</Text>
        </TouchableOpacity>
        </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: { position: "relative" },
    headerTitle: { position: "absolute", bottom: 10, left: 20, color: "#fff", fontSize: 24, fontWeight: "bold" },
    roomImage: { width: "100%", height: 250, marginVertical: 16 },
    detailsContainer: { paddingHorizontal: 16 },
    roomName: { fontSize: 28, fontWeight: "bold", color: "#333", marginBottom: 12 },
    infoText: { fontSize: 16, color: "#555", marginBottom: 8 },
    bold: { fontWeight: "bold" },
    price: { fontSize: 20, fontWeight: "bold", color: "#64463c", marginVertical: 12 },
    sectionTitle: { fontSize: 22, fontWeight: "bold", color: "#333", marginTop: 20, marginBottom: 10 },
    ratingCard: { padding: 12, backgroundColor: "#f9f9f9", borderRadius: 8, marginBottom: 10, elevation: 2 },
    commentText: { fontSize: 14, color: "#555", marginBottom: 4 },
    noRating: { fontSize: 14, color: "#999", textAlign: "center" },
    backButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#64463c", padding: 12, borderRadius: 8, margin: 16 },
    backButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginLeft: 8 },
    errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    errorText: { fontSize: 18, color: "red" },
});

export default RoomDetailPage;
