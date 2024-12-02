import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    FlatList,
    StyleSheet,
    ScrollView,
    Button,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox } from 'react-native-paper';
import { addMenu } from '@/redux/actions/menuRequest';

const CreateMenuModal = ({ open, handleClose, setSelected }) => {
    const [selectedFood, setSelectedFood] = useState([]);
    const [selectedDrinks, setSelectedDrinks] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const foods = useSelector((state) => state.foods?.foods);
    const drinks = useSelector((state) => state.drinks?.drinks);
    const dispatch = useDispatch();

    const handleFoodChange = (foodId) => {
        setSelectedFood((prevSelected) =>
            prevSelected.includes(foodId)
                ? prevSelected.filter((id) => id !== foodId)
                : [...prevSelected, foodId]
        );
    };

    const handleDrinkChange = (drinkId) => {
        setSelectedDrinks((prevSelected) =>
            prevSelected.includes(drinkId)
                ? prevSelected.filter((id) => id !== drinkId)
                : [...prevSelected, drinkId]
        );
    };

    useEffect(() => {
        const totalFood = selectedFood.reduce((total, foodId) => {
            const food = foods.find((item) => item.FoodID === foodId);
            return total + (food?.UnitPrice || 0);
        }, 0);

        const totalDrink = selectedDrinks.reduce((total, drinkId) => {
            const drink = drinks.find((item) => item.DrinkID === drinkId);
            return total + (drink?.UnitPrice || 0);
        }, 0);

        setTotalPrice(totalFood + totalDrink);
    }, [selectedDrinks, selectedFood, foods, drinks]);

    const handleSubmit = async () => {
        const menuData = {
            Food: selectedFood,
            Drinks: selectedDrinks,
        };
        if (selectedFood.length >= 4 && selectedDrinks.length >= 2) {
            try {
                const newMenu = await addMenu(dispatch, menuData);
                setSelected(newMenu.MenuID);
                handleClose();
            } catch (error) {
                console.error('Error creating menu:', error);
                alert('Error creating menu');
            }
        } else {
            alert('Vui lòng chọn ít nhất 4 món ăn và 2 đồ uống.');
        }
    };

    return (
        <Modal visible={open} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Menu tự chọn</Text>
                    <FlatList
                        data={[]} // FlatList cha không cần dữ liệu, chỉ dùng để cuộn
                        keyExtractor={(_, index) => index.toString()} // Key cho các mục header
                        ListHeaderComponent={
                            <>
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Danh sách món ăn</Text>
                                    <FlatList
                                        data={foods}
                                        keyExtractor={(item) => item.FoodID.toString()}
                                        renderItem={({ item }) => (
                                            <View style={styles.checkboxContainer}>
                                                <Checkbox
                                                    status={
                                                        selectedFood.includes(item.FoodID)
                                                            ? 'checked'
                                                            : 'unchecked'
                                                    }
                                                    onPress={() => handleFoodChange(item.FoodID)}
                                                />
                                                <Text style={styles.checkboxLabel}>
                                                    {item.Name} - {item.UnitPrice.toLocaleString()} VND
                                                </Text>
                                            </View>
                                        )}
                                    />
                                </View>

                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Danh sách đồ uống</Text>
                                    <FlatList
                                        data={drinks}
                                        keyExtractor={(item) => item.DrinkID.toString()}
                                        renderItem={({ item }) => (
                                            <View style={styles.checkboxContainer}>
                                                <Checkbox
                                                    status={
                                                        selectedDrinks.includes(item.DrinkID)
                                                            ? 'checked'
                                                            : 'unchecked'
                                                    }
                                                    onPress={() => handleDrinkChange(item.DrinkID)}
                                                />
                                                <Text style={styles.checkboxLabel}>
                                                    {item.Name} - {item.UnitPrice.toLocaleString()} VND
                                                </Text>
                                            </View>
                                        )}
                                    />
                                </View>
                            </>
                        }
                    />

                    <Text style={styles.totalPrice}>
                        Tổng giá: {totalPrice.toLocaleString()} VND/bàn
                    </Text>
                    <View style={styles.buttonContainer}>
                        <Button title="Xác nhận" onPress={handleSubmit} />
                        <Button title="Hủy" onPress={handleClose} color="red" />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    scrollContainer: {
        marginBottom: 20,
    },
    section: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    checkboxLabel: {
        marginLeft: 10,
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

export default CreateMenuModal;
