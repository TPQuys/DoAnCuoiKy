import React from 'react';
import { View, Text, Image, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

const RoomPage = () => {
    const rooms = useSelector((state) => state.rooms?.rooms);
    return (
        <ScrollView contentContainerStyle={styles.roomContainer}>

            <View style={styles.roomBody}>
                {rooms.map((item) => {
                    if (item.Status === "OPEN") {
                        return (
                            <View key={item.RoomEventID} style={styles.roomContentCenter}>
                                <Image
                                    source={{ uri: item.RoomImage }}
                                    style={styles.roomContentImg}
                                    alt="img1"
                                />
                                <Text style={styles.roomContentTitle}>{item.RoomName}</Text>
                                <View style={styles.roomContentTable}>
                                    <View style={styles.roomContentRow}>
                                        <Text style={styles.roomContentText}>Chiều dài: {item.HeightRoom}</Text>
                                        <Text style={styles.roomContentText}>Chiều rộng: {item.WidthRoom}</Text>
                                    </View>
                                    <View style={styles.roomContentRow}>
                                        <Text style={styles.roomContentText}>Số người: {item.Capacity}</Text>
                                        <Text style={styles.roomContentText}>Số bàn tối đa: {item.MaxTable}</Text>
                                    </View>
                                </View>
                                <Text style={styles.roomContentText}>{item.Description}</Text>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => {
                                        // Xử lý đặt phòng ở đây, ví dụ: điều hướng đến trang booking
                                        console.log(`Đặt phòng ID: ${item.RoomEventID}`);
                                    }}
                                >
                                    <Text style={styles.buttonText}>Đặt ngay</Text>
                                </TouchableOpacity>

                            </View>
                        );
                    }
                    return null;
                })}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({

    roomBody: {
        margin: 0,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff3d1',
        padding: 20,
    },

    roomContentCenter: {
        borderBottomWidth:3,
        borderBottomColor:"#e5cc5f",
        borderRadius:10,
        marginVertical:10,
        paddingBottom:10
    },
    roomContentTitle: {
        fontSize: 40,
        color: '#81695e',
        fontWeight: '600',
        margin: 'auto',
    },
    roomContentImg: {
        width: '100%',
        height: '50vw',
    },
    roomContentTable: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    roomContentRow: {
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    roomContentText: {
        fontSize: 14, // nhỏ hơn để phù hợp với thiết kế
        color: '#81695e',
    },
    button: {
        backgroundColor: '#64463c',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default RoomPage;
