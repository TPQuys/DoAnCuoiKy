import React, { useRef, useState } from "react";
import { View, Text, ImageBackground, TouchableOpacity, ScrollView, StyleSheet, Button } from "react-native";
// import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { addEvent } from "@/redux/actions/eventRequest";
import { addBooking } from "@/redux/actions/bookingRequest";
import Form from "@/components/BookingForm"; // Component của form cần tuỳ chỉnh cho React Native
import { useGlobalSearchParams, useRouter } from "expo-router";

const HomePage = () => {
    const [selected, setSelected] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState();
    const formikRef = useRef(null);
    // const navigation = useNavigation();
    const router = useRouter();
    const { roomId } = useGlobalSearchParams();
    const dispatch = useDispatch();

    const menus = useSelector((state) => state.menus?.menus);
    const rooms = useSelector((state) => state.rooms?.rooms);
    const room = rooms.find(item => item.RoomEventID === roomId);
    const user = useSelector((state) => state.auth.login.currentUser);

    const handleSubmitHomePage = async () => {
        if (formikRef.current) {
            const formik = formikRef.current;
            const isValid = await formik.validateForm();
            formik.setTouched({
                EventType: true,
                TotalTable: true,
                EventDate: true,
                Time: true,
                Note: true,
            });

            if (isValid && Object.keys(isValid).length === 0) {
                const formValues = formik.values;
                const selectedMenu = menus.find(menu => menu.MenuID === selected);
                const foodTotalPrice = selectedMenu?.Food.reduce((total, food) => {
                    return total + (food.UnitPrice * food.MenuFoods.Quantity);
                }, 0);
                const drinksTotalPrice = selectedMenu?.Drinks.reduce((total, drink) => {
                    return total + (drink.UnitPrice * drink.MenuDrinks.Quantity);
                }, 0);
                const totalMenuPrice = foodTotalPrice + drinksTotalPrice;

                const eventData = {
                    RoomEventID: roomId,
                    MenuID: selected,
                    EventType: formValues.EventType,
                    TotalTable: formValues.TotalTable,
                    EventDate: formValues.EventDate,
                    Time: formValues.Time,
                    TotalPrice: totalMenuPrice,
                    Note: formValues.Note,
                };

                try {
                    setIsDisabled(true);
                    const newEvent = await addEvent(dispatch, eventData,user);
                    if (newEvent && user) {
                        const newBooking = await addBooking(dispatch, {
                            EventID: newEvent.EventID,
                            UserID: user.user.id
                        },user);
                        if (newBooking) {
                            setBookingSuccess(newBooking.BookingID);
                        }
                    } else {
                        console.log("User không hợp lệ");
                    }
                } catch (error) {
                    console.log(error.message);
                }
            }
        }
        setIsDisabled(false);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <ImageBackground
                source={{ uri: "https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/room-header.jpg?token=..." }}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>ĐẶT CHỖ</Text>
            </ImageBackground>

            <View style={styles.roomInfo}>
                <Text style={styles.roomName}>{room?.RoomName}</Text>
                <ImageBackground source={{ uri: room?.RoomImage }} style={styles.roomImage}>
                    <View style={styles.roomDetails}>
                        <Text style={styles.roomDetail}>Chiều dài: {room?.HeightRoom}</Text>
                        <Text style={styles.roomDetail}>Chiều rộng: {room?.WidthRoom}</Text>
                        <Text style={styles.roomDetail}>Số bàn: {room?.MaxTable}</Text>
                        <Text style={styles.roomDetail}>Giá: {room?.Price}</Text>
                    </View>
                </ImageBackground>
            </View>

            <Text style={styles.sectionTitle}>Nhập Thông Tin Sự Kiện</Text>
            <Form ref={formikRef} handleSubmit={() => {}} maxTable={room?.MaxTable} />

            <Text style={styles.sectionTitle}>Chọn Menu</Text>
            <View style={styles.menuContainer}>
                {menus?.map((menu, index) => {
                    const foodTotalPrice = menu.Food.reduce((total, food) => {
                        return total + (food.UnitPrice * food.MenuFoods.Quantity);
                    }, 0);
                    const drinksTotalPrice = menu.Drinks.reduce((total, drink) => {
                        return total + (drink.UnitPrice * drink.MenuDrinks.Quantity);
                    }, 0);
                    const totalMenuPrice = foodTotalPrice + drinksTotalPrice;

                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.menuItem, selected === menu?.MenuID && styles.selectedMenu]}
                            onPress={() => setSelected(menu?.MenuID)}
                        >
                            <Text style={styles.menuTitle}>{menu.Name}</Text>
                            <Text style={styles.menuPrice}>{`Giá: ${totalMenuPrice.toLocaleString()} VND/bàn`}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {bookingSuccess ? (
                <Button
                    title="Đặt thành công, đến trang thanh toán"
                    onPress={() => router.push(`../(tabs)/payment?bookingId=${bookingSuccess}`)}
                />
            ) : (
                <Button
                    title="Đặt ngay"
                    onPress={handleSubmitHomePage}
                    disabled={isDisabled}
                    color="#64463c"
                />
            )}
        </ScrollView>
    );
};

export default HomePage;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    header: {
        height: 200,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
    },
    roomInfo: {
        marginBottom: 20,
    },
    roomName: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    roomImage: {
        height: 200,
        justifyContent: "center",
        alignItems: "center",
    },
    roomDetails: {
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 10,
    },
    roomDetail: {
        color: "#fff",
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
    },
    menuContainer: {
        marginBottom: 20,
    },
    menuItem: {
        padding: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 10,
    },
    selectedMenu: {
        borderColor: "#64463c",
        backgroundColor: "#f0e6e6",
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    menuPrice: {
        fontSize: 14,
        color: "#555",
    },
});
