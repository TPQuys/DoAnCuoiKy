import React, { useEffect, useState } from 'react';
import { Modal, View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox } from 'react-native-paper';  // Import Checkbox from react-native-paper
import { addMenu } from "@/redux/actions/menuRequest";

const CreateMenuModal = ({ open, handleClose, setSelected }) => {
    const [selectedFood, setSelectedFood] = useState([]);
    const [selectedDrinks, setSelectedDrinks] = useState([]);
    const [totalPrice, setTotolPrice] = useState(0);
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
            const food = foods.find(item => item.FoodID === foodId);
            return total + (food?.UnitPrice || 0);
        }, 0);

        const totalDrink = selectedDrinks.reduce((total, drinkId) => {
            const drink = drinks.find(item => item.DrinkID === drinkId);
            return total + (drink?.UnitPrice || 0);
        }, 0);

        setTotolPrice(totalFood + totalDrink);
    }, [selectedDrinks, selectedFood, foods, drinks]);

    const handleSubmit = async () => {
        const menuData = {
            Food: selectedFood,
            Drinks: selectedDrinks,
        };
        if (selectedFood.length >= 1 || selectedDrinks.length >= 1) {
            try {
                const newMenu = await addMenu(dispatch, menuData);
                setSelected(newMenu.MenuID);
                handleClose(); // Close the modal
            } catch (error) {
                console.error('Error creating menu:', error);
            }
        } else {
            alert("Hãy chọn ít nhất 1 loại ");
        }
    };

    return (
        <Modal visible={open} onRequestClose={handleClose} transparent animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.card}>
                    <Text style={styles.title}>Menu tự chọn</Text>

                    <ScrollView style={styles.scrollContainer}>
                        <View style={styles.grid}>
                            <View style={styles.selectedSection}>
                                <Text style={styles.sectionTitle}>Món ăn đã chọn</Text>
                                {selectedFood.map((foodId) => {
                                    const food = foods.find(item => item.FoodID === foodId);
                                    return (
                                        <Text key={foodId} style={styles.selectedItem}>{food?.Name}</Text>
                                    );
                                })}
                            </View>

                            <View style={styles.listSection}>
                                <Text style={styles.sectionTitle}>Danh sách món ăn</Text>
                                <ScrollView style={styles.listWrapper}>
                                    {foods.map((food) => (
                                        <View key={food.FoodID} style={styles.listItem}>
                                            <Checkbox
                                                status={selectedFood.includes(food.FoodID) ? 'checked' : 'unchecked'}
                                                onPress={() => handleFoodChange(food.FoodID)}
                                            />
                                            <Text style={styles.itemText}>{`${food.Name} / ${food.UnitPrice} VND`}</Text>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>

                        <View style={styles.grid}>
                            <View style={styles.selectedSection}>
                                <Text style={styles.sectionTitle}>Đồ uống đã chọn</Text>
                                {selectedDrinks.map((drinkId) => {
                                    const drink = drinks.find(item => item.DrinkID === drinkId);
                                    return (
                                        <Text key={drinkId} style={styles.selectedItem}>{drink?.Name}</Text>
                                    );
                                })}
                            </View>

                            <View style={styles.listSection}>
                                <Text style={styles.sectionTitle}>Danh sách đồ uống</Text>
                                <ScrollView style={styles.listWrapper}>
                                    {drinks.map((drink) => (
                                        <View key={drink.DrinkID} style={styles.listItem}>
                                            <Checkbox
                                                status={selectedDrinks.includes(drink.DrinkID) ? 'checked' : 'unchecked'}
                                                onPress={() => handleDrinkChange(drink.DrinkID)}
                                            />
                                            <Text style={styles.itemText}>{`${drink.Name} / ${drink.UnitPrice} VND`}</Text>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.totalPriceContainer}>
                        <Text style={styles.totalPrice}>Tổng giá: {totalPrice.toLocaleString()} VND/bàn</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Xác nhận</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleClose}>
                            <Text style={styles.buttonText}>Hủy</Text>
                        </TouchableOpacity>
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
    card: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        width: '90%',
        maxHeight: '80%',
        marginHorizontal: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    scrollContainer: {
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    selectedSection: {
        width: '45%',
        padding: 8,
        backgroundColor: '#fafaeb',
        borderRadius: 4,
        marginRight: 10,
        marginBottom: 10,
    },
    listSection: {
        width: '45%',
        padding: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 4,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    listWrapper: {
        maxHeight: 150,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    itemText: {
        marginLeft: 10,
        fontSize: 12,
    },
    selectedItem: {
        paddingVertical: 5,
        fontSize: 12,
    },
    totalPriceContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        width: '40%',
        margin: 5,
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default CreateMenuModal;
