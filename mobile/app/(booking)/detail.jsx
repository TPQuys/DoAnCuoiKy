import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useLocalSearchParams, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { addDecore } from '@/redux/actions/decoreRequest';
import { PostZaloApi } from '@/redux/actions/paymentRequest';
import { addEvent } from '@/redux/actions/eventRequest';
import { addBooking } from '@/redux/actions/bookingRequest';
import CreateMenuModal from '@/components/CreateMenuModal'
import DecoreSelection from '@/components/DecoreSelection'
import MenuSelect from '@/components/MenuSelect';
const EventDetails = () => {
    const { formData: formDataString, room: roomString } = useLocalSearchParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const menus = useSelector((state) => state.menus?.menus);
    const user = useSelector((state) => state.auth.login.currentUser);
    const deocrePrice = useSelector((state) => state.roomPrices?.roomPrices);
    const [selectedPrice, setSelectedPrice] = useState();
    const [selected, setSelected] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [note, setNote] = useState('');
    const [Decore, setDecore] = useState({
        LobbyDecore: true,
        StageDecore: true,
        TableDecore: true,
    });
    const [formData, setFormData] = useState({});
    const [room, setRoom] = useState({});

    useEffect(() => {
        if (formDataString && roomString) {
            try {
                setFormData(JSON.parse(formDataString));
                setRoom(JSON.parse(roomString));
            } catch (error) {
                console.error("Error parsing params:", error);
            }
        }
    }, [formDataString, roomString]);

    const caution = [
        "- Các thông tin về loại sự kiện, ngày tổ chức, thời gian tổ chức và tổng số bàn sẽ không thể thay đổi sau khi đặt",
        "- Hãy thanh toán trong vòng 24 giờ trước khi đơn đặt hết hạn"
    ];

    const { EventType, From, To, EventDate, Time, TotalTable, SelectedTimes } = formData || {};

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    useEffect(() => {
        setSelectedPrice(deocrePrice[0]);
    }, [deocrePrice]);

    const handleSelect = (value) => {
        setSelected((prevSelected) => (prevSelected === value ? null : value));
    };

    const handleBooking = async () => {
        setIsDisabled(true);
        if (formData) {
            const decore = await addDecore(dispatch, { ...Decore, DecorePriceID: selectedPrice.DecorePriceID }, user);
            const selectedMenu = menus.find(menu => menu.MenuID === selected);
            const foodTotalPrice = selectedMenu?.Food.reduce((total, food) => total + (food.UnitPrice * food.MenuFoods.Quantity), 0);
            const drinksTotalPrice = selectedMenu?.Drinks.reduce((total, drink) => total + (drink.UnitPrice * drink.MenuDrinks.Quantity), 0);
            const totalMenuPrice = foodTotalPrice + drinksTotalPrice;
            const eventData = {
                ...formData,
                RoomEventID: room.RoomEventID,
                MenuID: selected,
                DecoreID: decore.DecoreID,
                EventType: formData.EventType,
                TotalPrice: totalMenuPrice,
                EventDate: new Date(EventDate),
                Note: note,
                From: From !== null ? new Date(From) : null,
                To: To !== "Invalid Date" ? new Date(To) : null
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
                        const zaloApi = await PostZaloApi(dispatch, newBooking, user);
                        router.push(`./payment?bookingId=${newBooking.BookingID}`)
                    }
                } else {
                    console.log("Invalid user");
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        setIsDisabled(false);
    };

    if (!formData || !room) {
        return <Text>Không có sự kiện nào được đặt.</Text>;
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.header}>
                <Text style={styles.title}>ĐẶT CHỖ</Text>
            </View>

            {/* Room Details Section */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Chi tiết sự kiện</Text>
                <View style={styles.roomImageContainer}>
                    <Image source={{ uri: room?.RoomImage }} style={styles.roomImage} />
                    <View style={styles.roomInfo}>
                        <Text style={styles.roomTitle}>{room?.RoomName}</Text>
                        <Text>{`Kích thước: ${room?.HeightRoom}m x ${room?.WidthRoom}m`}</Text>
                        <Text>{`Sức chứa: ${room?.Capacity} người, ${room?.MaxTable} bàn`}</Text>
                        <Text style={styles.price}>{room?.Price?.toLocaleString()} VND</Text>
                    </View>
                </View>
            </View>

            {/* Menu Section */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Menu</Text>
                <MenuSelect handleSelect={handleSelect} selected={selected} menus={menus}></MenuSelect>
                <TouchableOpacity style={styles.button} onPress={handleOpenModal}>
                    <Text style={styles.buttonText}>Tự chọn menu</Text>
                </TouchableOpacity>
            </View>

            {/* Decoration Section */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Trang trí</Text>
                <Text>Chọn các phần trang trí cho sự kiện của bạn.</Text>
                <DecoreSelection
                    price={deocrePrice}
                    Decore={Decore}
                    onDecoreChange={(name, value) => setDecore({ ...Decore, [name]: value })}
                    setSelectedPrice={setSelectedPrice}
                    selectedPrice={selectedPrice}
                />
            </View>

            {/* Event Summary Section */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Thông tin sự kiện</Text>
                <Text>Loại sự kiện: {EventType}</Text>
                <Text>Ngày: {EventDate ? new Date(EventDate?.$d).toLocaleDateString() : 'N/A'}</Text>
                <Text>Thời gian: {Time === 'CUSTOM' ? SelectedTimes?.join(', ') : `${Time === 'MORNING' ? 'Buổi sáng' : 'Buổi chiều'}`}</Text>
                <Text>Tổng số bàn: {TotalTable}</Text>
                <TextInput
                    value={note}
                    onChangeText={setNote}
                    placeholder="Ghi chú"
                    multiline
                    numberOfLines={4}
                    style={styles.textInput}
                />
            </View>

            {/* Caution Section */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Lưu ý</Text>
                {caution.map((item, index) => (
                    <Text key={index}>{item}</Text>
                ))}
            </View>

            {/* Booking Button */}
            <View style={styles.card}>
                <Button title="Đặt ngay" onPress={handleBooking} disabled={isDisabled} />
            </View>
            <CreateMenuModal open={openModal} handleClose={handleCloseModal} setSelected={setSelected} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    header: { backgroundColor: '#f5f5f5', padding: 16, alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold' },
    card: { backgroundColor: '#fff', borderRadius: 8, marginBottom: 16, padding: 16 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    roomImageContainer: { flexDirection: 'row', alignItems: 'center' },
    roomImage: { width: 120, height: 120, borderRadius: 8 },
    roomInfo: { marginLeft: 16 },
    roomTitle: { fontSize: 18, fontWeight: 'bold' },
    price: { fontSize: 16, color: '#e91e63' },
    button: { backgroundColor: '#e91e63', padding: 12, borderRadius: 8, marginTop: 8 },
    buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
    textInput: { borderWidth: 1, padding: 8, borderRadius: 8, marginTop: 8, height: 80, textAlignVertical: 'top' },
});

export default EventDetails;
