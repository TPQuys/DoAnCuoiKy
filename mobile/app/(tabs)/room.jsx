import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, ImageBackground, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

const RoomPage = () => {
    const rooms = useSelector((state) => state.rooms?.rooms);
    const router = useRouter();
    
    return (
        <ScrollView contentContainerStyle={styles.roomContainer}>
            <View style={styles.roomBody}>
                {rooms.map((item) => {
                    if (item.Status === "OPEN") {
                        return (
                            <View key={item.RoomEventID} style={styles.roomContentCenter}>
                                <ImageBackground
                                    source={{ uri: item.RoomImage }}
                                    style={styles.roomContentImg}
                                >
                                </ImageBackground>
                                <View style={styles.overlayContent}>
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
                                            onPress={() => 
                                                router.push({
                                                    pathname: '/(booking)/roomDetail',
                                                    params: {  room: JSON.stringify(item) }
                                                })}
                                            >
                                            <Text style={styles.buttonText}>Chi tiết</Text>
                                        </TouchableOpacity>
                                    </View>
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
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff3d1',
        padding: 20,
        paddingTop:40
    },
    roomContentCenter: {
        borderBottomWidth: 3,
        borderBottomColor: "#e5cc5f",
        borderRadius: 10,
        marginVertical: 10,
        overflow: 'hidden', // Giúp làm tròn góc cho ImageBackground
    },
    roomContentImg: {
        width: '100%',
        height: 200, 
        justifyContent: 'flex-end', 
    },
    overlayContent: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Hiệu ứng nền mờ trên hình ảnh
        padding: 10,
    },
    roomContentTitle: {
        fontSize: 24,
        color: '#fff',
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 10,
    },
    roomContentTable: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    roomContentRow: {
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    roomContentText: {
        fontSize: 14,
        color: '#81695e',
    },
    button: {
        backgroundColor: '#64463c',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default RoomPage;
