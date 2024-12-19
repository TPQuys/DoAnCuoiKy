import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const DecoreSelection = ({ Decore, onDecoreChange, price, selectedPrice, setSelectedPrice }) => {
    const [selectedType, setSelectedType] = useState('BASIC');
    const [showDropdown, setShowDropdown] = useState(false);


    const decoreOptions = [
        {
            name: "LobbyDecore",
            price: selectedPrice?.LobbyDecorePrice?.toLocaleString() + " VND",
            label: "Sảnh",
            icon: <Image source={{ uri: "https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/public/Event/decore/lobby.png?t=2024-11-26T17%3A57%3A36.749Z" }} style={styles.icon} />,
            selected: Decore.LobbyDecore
        },
        {
            name: "StageDecore",
            price: selectedPrice?.StageDecorePrice?.toLocaleString() + " VND",
            label: "Sân khấu",
            icon: <Image source={{ uri: "https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/public/Event/decore/pngegg.png?t=2024-11-26T17%3A58%3A35.592Z" }} style={styles.icon} />,
            selected: Decore.StageDecore
        },
        {
            name: "TableDecore",
            price: selectedPrice?.TableDecorePrice?.toLocaleString() + " VND/bàn",
            label: "Bàn",
            icon: <Text style={{ fontSize: 50 }}>🍽️</Text>,
            selected: Decore.TableDecore
        }
    ];

    const handleToggle = (name) => {
        onDecoreChange(name, !Decore[name]);
    };

    const handlePriceTypeChange = (itemValue) => {
        setSelectedType(itemValue);
        const priceSelected = price.find((item) => item.Type === itemValue);
        setSelectedPrice(priceSelected);
        setShowDropdown(false); // Close dropdown after selection
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const priceOptions = [
        { label: "Cơ bản", value: "BASIC" },
        { label: "Nâng cao", value: "ADVANCED" },
        { label: "Cao cấp", value: "PREMIUM" }
    ];
    return (
        <View style={styles.container}>
            <View style={styles.pickerContainer}>
                <TouchableOpacity style={styles.customPicker} onPress={toggleDropdown}>
                    <Text style={styles.selectedText}>{priceOptions.find(option => option.value === selectedType)?.label || "Chọn loại"}</Text>
                    <Text style={styles.dropdownIcon}>▾</Text>
                </TouchableOpacity>
                {showDropdown && (
                    <View style={styles.dropdown}>
                        {priceOptions.map(option => (
                            <TouchableOpacity
                                key={option.value}
                                style={styles.dropdownItem}
                                onPress={() => handlePriceTypeChange(option.value)}
                            >
                                <Text>{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
            <View style={styles.decoreContainer}>

                {decoreOptions.map((type) => (
                    <TouchableOpacity
                        key={type.label}
                        style={[
                            styles.decoreItem,
                            Decore[type.name] && styles.selectedDecore
                        ]}
                        onPress={() => handleToggle(type.name)}
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 10,
    },
    pickerContainer: {
        marginBottom: 20,
    },
    customPicker: {
        backgroundColor: "white",
        borderRadius: 5,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    selectedText: {
        fontSize: 16,
    },
    dropdownIcon: {
        fontSize: 18,
    },
    dropdown: {
        backgroundColor: "white",
        borderRadius: 5,
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        zIndex: 10,
        elevation: 5,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    dropdownItem: {
        padding: 10,
    },
    decoreContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    cardContainer: {
        width: "45%",
        margin: 10,
    },
    card: {
        borderRadius: 10,
        elevation: 3,
    },
    cardContent: {
        alignItems: "center",
        padding: 10,
    },
    icon: {
        width: 50,
        height: 50,
        marginBottom: 10,
    },
    label: {
        fontWeight: "bold",
        fontSize: 16,
        marginVertical: 5,
    },
    price: {
        fontSize: 14,
        marginVertical: 5,
    },
    toggleButton: {
        width: "100%",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        backgroundColor: "#f5f5f5",
        alignItems: "center",
        marginTop: 15,
    },
    selectedButton: {
        backgroundColor: "#64463c",
    },
    checkIcon: {
        fontSize: 25,
        color: "#fff",
    },
    buttonText: {
        color: "#64463c",
        fontWeight: "bold",
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
});

export default DecoreSelection;