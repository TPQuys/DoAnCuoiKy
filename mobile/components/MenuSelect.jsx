import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');  // Lấy chiều rộng màn hình thiết bị

const MenuSelect = ({ menus, handleSelect, selected }) => {
    const [expandedMenu, setExpandedMenu] = useState(null);  // State để lưu trữ menu được mở rộng

    const toggleMenuDetail = (menuID) => {
        setExpandedMenu(prev => (prev === menuID ? null : menuID));  // Toggle mở rộng thông tin menu
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.grid}>
                {menus
                    .filter((item) => item.Name !== null)
                    .map((menu, index) => {
                        const foodTotalPrice = menu.Food?.reduce((total, food) => total + (food.UnitPrice || 0), 0);
                        const drinksTotalPrice = menu.Drinks?.reduce((total, drink) => total + (drink.UnitPrice || 0), 0);
                        const totalMenuPrice = foodTotalPrice + drinksTotalPrice;

                        return (
                            <View style={styles.card} key={index}>
                                <TouchableOpacity
                                    style={[
                                        styles.cardContainer, 
                                        {
                                            backgroundColor: selected === menu?.MenuID ? '#fff4d0' : 'white',
                                            borderColor: selected === menu?.MenuID ? '#ffbf47' : 'transparent',
                                            borderWidth: selected === menu?.MenuID ? 2 : 0,
                                        }
                                    ]}
                                    onPress={() => {
                                        handleSelect(menu?.MenuID);
                                        toggleMenuDetail(menu?.MenuID);  // Mở rộng hoặc thu gọn thông tin menu
                                    }}
                                >
                                    <Text style={styles.cardTitle}>{menu.Name}</Text>
                                    <Text style={styles.cardPrice}>
                                        {`Giá: ${totalMenuPrice.toLocaleString()} VND`}
                                    </Text>
                                    <Image source={{ uri: menu.Image }} style={styles.image} />
                                </TouchableOpacity>
                            </View>
                        );
                    })}
            </View>

            {expandedMenu && (
                <View style={styles.detailContainer}>
                    {menus
                        .filter((item) => item.MenuID === expandedMenu)
                        .map((menu) => (
                            <View key={menu.MenuID}>
                                <Text style={styles.detailTitle}>Món ăn:</Text>
                                {menu?.Food?.map((food, idx) => (
                                    <Text key={idx} style={styles.foodItem}>{food.Name}</Text>
                                ))}
                                <Text style={styles.detailTitle}>Đồ uống:</Text>
                                {menu?.Drinks?.map((drink, idx) => (
                                    <Text key={idx} style={styles.foodItem}>{drink.Name}</Text>
                                ))}
                            </View>
                        ))}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingBottom: 20, 
    },
    grid: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    card: {
        width: width * 0.26, // Hiển thị 3 menu mỗi hàng
        margin: 8,
        borderRadius: 8,
        overflow: 'hidden',
    },
    cardContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
    },
    cardTitle: {
        backgroundColor: '#fdeacd',
        height: 50,
        fontSize: 14,
        fontWeight: '600',
        color: '#81695e',
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 5,
        marginBottom: 4,
    },
    cardPrice: {
        textAlign: 'left',
        paddingHorizontal: 8,
        color: 'gray',
        fontSize: 12,
        marginBottom: 4,
    },
    image: {
        width: '100%',
        height: 120,
        borderRadius: 8,
    },
    detailContainer: {
        flexDirection: 'column',
        padding: 8,
        backgroundColor: '#f7f7f7',
        borderRadius: 8,
        marginTop: 16,
        marginLeft: 16,
        width: width * 0.6, // Chiều rộng hiển thị chi tiết
    },
    detailTitle: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    foodItem: {
        textAlign: 'left',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 5,
        marginBottom: 3,
    },
});

export default MenuSelect;
