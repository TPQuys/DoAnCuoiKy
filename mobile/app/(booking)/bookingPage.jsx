import React, { useEffect, useRef, useState } from "react";
import { View, Text, ImageBackground, TouchableOpacity, ScrollView, StyleSheet, Button } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addEvent } from "@/redux/actions/eventRequest";
import { addBooking } from "@/redux/actions/bookingRequest";
import Form from "@/components/BookingForm";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { addDecore } from "../../redux/actions/decoreRequest";
import { ToastAndroid } from 'react-native';
import { PostZaloApi } from "../../redux/actions/paymentRequest";
import MenuModal from "@/components/MenuModal"
import { Picker } from "@react-native-picker/picker";
const HomePage = () => {
    const deocrePrice = useSelector((state) => state.roomPrices?.roomPrices)
    const [selected, setSelected] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState();
    const [decore, setDecore] = useState({
        LobbyDecore: true,
        StageDecore: true,
        TableDecore: true,
    });
    const [selectedType, setSelectedType] = useState(deocrePrice[0]);
    const [openModal, setOpenModal] = useState(false);
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    const formikRef = useRef(null);
    const router = useRouter();
    const { roomId } = useGlobalSearchParams();
    const dispatch = useDispatch();

    const menus = useSelector((state) => state.menus?.menus);
    const rooms = useSelector((state) => state.rooms?.rooms);
    const room = rooms.find(item => item.RoomEventID === roomId);
    const user = useSelector((state) => state.auth.login.currentUser);


    useEffect(() => {
        if(room?.MaxTable<5){
            setDecore({
                LobbyDecore: false,
                StageDecore: false,
                TableDecore: false,
            })
        }
    }, [from])

    const handleDecoreSelect = (type) => {
        setDecore(prev => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    const handleSelectType = (value) => {
        const type = deocrePrice.find((item) => item.Type === value)
        if (type) {
            setSelectedType(type)

        }
    }

    const handleSubmitHomePage = async () => {
        setIsDisabled(true);
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

            const newDecore = await addDecore(dispatch, { ...decore, DecorePriceID: selectedType.DecorePriceID }, user)
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
                    DecoreID: newDecore.DecoreID,
                    EventType: formValues.EventType,
                    TotalTable: formValues.TotalTable,
                    EventDate: new Date(formValues.EventDate).toLocaleDateString(),
                    Time: formValues.Time,
                    TotalPrice: totalMenuPrice,
                    Note: formValues.Note,
                    From: from,
                    To: to,
                };

                try {
                    const newEvent = await addEvent(dispatch, eventData, user);
                    if (newEvent && user) {
                        const newBooking = await addBooking(dispatch, {
                            EventID: newEvent.EventID,
                            UserID: user.user.id,
                            BookingTime: new Date()
                        }, user);
                        if (newBooking) {
                            await PostZaloApi(dispatch, newBooking, user);
                            setBookingSuccess(newBooking.BookingID);
                        }
                    } else {
                        console.log("User không hợp lệ");
                    }
                } catch (error) {
                    console.log(error.message);
                }
            }
            else {
                ToastAndroid.show("Form chưa hợp lệ", ToastAndroid.SHORT)
            }
        }
        setIsDisabled(false);
    };


    const decoreOptions = [
        { name: "LobbyDecore", price: selectedType?.LobbyDecorePrice?.toLocaleString() + " VND", label: "Sảnh" },
        { name: "StageDecore", price: selectedType?.StageDecorePrice?.toLocaleString() + " VND", label: "Sân khấu" },
        { name: "TableDecore", price: selectedType?.TableDecorePrice?.toLocaleString() + " VND/bàn", label: "Bàn" },
    ];

    return (
        <>
            <ScrollView nestedScrollEnabled contentContainerStyle={styles.container}>
                <View style={styles.roomInfo}>
                    <Text style={styles.roomName}>{room?.RoomName}</Text>
                    <ImageBackground source={{ uri: room?.RoomImage }} style={styles.roomImage}>
                        <View style={styles.roomDetails}>
                            <View>
                                <Text style={styles.roomDetail}>Chiều dài: {room?.HeightRoom}</Text>
                                <Text style={styles.roomDetail}>Số bàn: {room?.MaxTable}</Text>
                            </View>
                            <View>
                                <Text style={styles.roomDetail}>Chiều rộng: {room?.WidthRoom}</Text>
                                <Text style={styles.roomDetail}>Giá: {room?.Price}</Text>
                            </View>
                        </View>
                    </ImageBackground>
                </View>

                <Text style={styles.sectionTitle}>Nhập Thông Tin Sự Kiện</Text>
                <Form setFrom={setFrom} setTo={setTo} user={user} RoomEventID={roomId} ref={formikRef} handleSubmit={() => { }} maxTable={room?.MaxTable} />

                {room?.MaxTable >= 5 && <>
                    <Text style={styles.sectionTitle}>Chọn Menu</Text>
                    <View style={styles.menuContainer}>
                        {menus?.filter((item) => item.Name != null)
                            .map((menu, index) => {
                                const foodTotalPrice = menu.Food.reduce((total, food) => {
                                    return total + (food.UnitPrice * 1);
                                }, 0);
                                const drinksTotalPrice = menu.Drinks.reduce((total, drink) => {
                                    return total + (drink.UnitPrice * 1);
                                }, 0);
                                const totalMenuPrice = foodTotalPrice + drinksTotalPrice;

                                return (
                                    <View key={index}>
                                        <TouchableOpacity
                                            style={[styles.menuItem, selected === menu?.MenuID && styles.selectedMenu]}
                                            onPress={() => setSelected(menu?.MenuID)}
                                        >
                                            <Text style={styles.menuTitle}>{menu.Name}</Text>
                                            <Text style={styles.menuPrice}>{`Giá: ${totalMenuPrice.toLocaleString()} VND/bàn`}</Text>
                                        </TouchableOpacity>
                                        {selected === menu?.MenuID && (
                                            <View style={styles.dishesContainer}>
                                                <Text style={styles.dishesTitle}>Danh sách món ăn:</Text>
                                                {menu.Food.map((food, i) => (
                                                    <Text key={i} style={styles.dishText}>{`${food.Name} - ${food.UnitPrice.toLocaleString()} VND `}</Text>
                                                ))}
                                                <Text style={styles.dishesTitle}>Danh sách thức uống:</Text>
                                                {menu.Drinks.map((drink, i) => (
                                                    <Text key={i} style={styles.dishText}>{`${drink.Name} - ${drink.UnitPrice.toLocaleString()} VND`}</Text>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                    </View>
                    <Button
                        title="Tự chọn menu"
                        onPress={handleOpenModal}
                    />
                    <Text style={styles.sectionTitle}>Chọn Trang Trí</Text>
                    <View>
                        <Text style={styles.label}>Loại trang trí</Text>
                        <Picker
                            selectedValue={selectedType.Type}
                            onValueChange={(itemValue) => handleSelectType(itemValue)}
                            style={styles.input}
                        >
                            <Picker.Item label="Cơ bản" value="BASIC" />
                            <Picker.Item label="Nâng cao" value="ADVANCED" />
                            <Picker.Item label="Cao cấp" value="PREMIUM" />
                        </Picker>
                    </View>

                    <View style={styles.decoreContainer}>

                        {decoreOptions.map((type) => (
                            <TouchableOpacity
                                key={type.label}
                                style={[
                                    styles.decoreItem,
                                    decore[type.name] && styles.selectedDecore
                                ]}
                                onPress={() => handleDecoreSelect(type.name)}
                            >
                                <View style={styles.decoreText}>{type.name === 'LobbyDecore'
                                    ? <View>
                                        <Text>Sảnh</Text>
                                        <Text>{type.price}</Text>
                                    </View>
                                    : type.name === 'StageDecore'
                                        ? <View>
                                            <Text>Sân khấu</Text>
                                            <Text>{type.price}</Text>
                                        </View>
                                        : <View>
                                            <Text>Bàn</Text>
                                            <Text>{type.price}</Text>
                                        </View>
                                }</View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>}

                {bookingSuccess ? (
                    <Button
                        title="Đặt thành công, đến trang thanh toán"
                        onPress={() => router.push(`./payment?bookingId=${bookingSuccess}`)}
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
            <MenuModal open={openModal} handleClose={handleCloseModal} setSelected={setSelected} />
        </>
    );
};

export default HomePage;

const styles = StyleSheet.create({

    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
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
        // justifyContent: "center",
        // alignItems: "center",
    },
    roomDetails: {
        backgroundColor: "rgba(0,0,0,0.3)",
        paddingHorizontal: 50,
        padding: 10,
        justifyContent: 'space-between',
        flexDirection: 'row',
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
    dishesContainer: {
        padding: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        marginTop: 10,
    },
    dishesTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    dishText: {
        fontSize: 14,
        color: "#333",
    },
    decoreContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 20,
    },
    decoreItem: {
        padding: 10,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
    },
    selectedDecore: {
        borderColor: "#64463c",
        backgroundColor: "#f0e6e6",
    },
    decoreText: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 4,
        marginBottom: 16,
    },
});
