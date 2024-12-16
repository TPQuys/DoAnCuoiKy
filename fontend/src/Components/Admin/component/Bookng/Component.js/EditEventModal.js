import React, { useEffect, useState } from "react";
import { Modal, Grid, Card, Typography, CardContent, Checkbox, ListItem, ListItemText, Button, FormControl, Select, MenuItem, ToggleButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addMenu, deleteMenu } from "../../../../../redux/actions/menuRequest";
import { toast } from "react-toastify";
import { updateEvent } from "../../../../../redux/actions/eventRequest";
import { getAllBooking } from "../../../../../redux/actions/bookingRequest";
import { Check, TableRestaurant } from "@mui/icons-material";
import { updateDecore } from "../../../../../redux/actions/decoreRequest";
import { PostZaloApi } from "../../../../../redux/actions/paymentRequest";

const EditEventModal = ({ open, onClose, eventData,booking }) => {
    const foods = useSelector((state) => state.foods?.foods);
    const drinks = useSelector((state) => state.drinks?.drinks);
    const price = useSelector((state) => state.roomPrices?.roomPrices)
    const dispatch = useDispatch()
    const [selectedFood, setSelectedFood] = useState([]);
    const [selectedDrinks, setSelectedDrinks] = useState([]);
    const [Decore, setDecore] = useState(eventData.Decore)
    const [selectedPrice, setSelectedPrice] = useState(eventData.Decore.DecorePrice)
    const [selectedType, setSelectedType] = useState(eventData.Decore.DecorePrice?.Type || "BASIC")

    const decoreOptions = [
        { name: "LobbyDecore", price: selectedPrice?.LobbyDecorePrice?.toLocaleString() + " VND", label: "Sảnh", icon: <img src="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/public/Event/decore/lobby.png?t=2024-11-26T17%3A57%3A36.749Z" width={50} height={50} />, selected: Decore.LobbyDecore },
        { name: "StageDecore", price: selectedPrice?.StageDecorePrice?.toLocaleString() + " VND", label: "Sân khấu", icon: <img src="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/public/Event/decore/pngegg.png?t=2024-11-26T17%3A58%3A35.592Z" width={50} height={50} />, selected: Decore.StageDecore },
        { name: "TableDecore", price: selectedPrice?.TableDecorePrice?.toLocaleString() + " VND/bàn", label: "Bàn", icon: <TableRestaurant sx={{ fontSize: 50 }} />, selected: Decore.TableDecore },
    ];

    const handleToggle = (name) => {
        setDecore(prevDecore => ({ ...prevDecore, [name]: !prevDecore[name] }))
    };
    const handlePriceTypeChange = (event) => {
        const type = event.target.value
        setSelectedType(type);
        const priceSelected = price.find((item) => item.Type === type)
        setSelectedPrice(priceSelected)
    };
    // Đồng bộ dữ liệu khi mở modal
    useEffect(() => {
        setDecore(eventData.Decore)
        setSelectedPrice(eventData.Decore.DecorePrice)
        setSelectedType(eventData.Decore.DecorePrice?.Type)
        if (eventData.Menu) {
            setSelectedFood(eventData?.Menu?.Food?.map((food) => food.FoodID));
            setSelectedDrinks(eventData?.Menu?.Drinks?.map((drink) => drink.DrinkID));
        }
    }, [eventData]);

    // Xử lý chọn món ăn
    const handleFoodChange = (food) => {
        setSelectedFood((prevSelected) =>
            prevSelected.includes(food.FoodID)
                ? prevSelected.filter((f) => f !== food.FoodID) // Remove food from selected
                : [...prevSelected, food.FoodID] // Add food to selected
        );
    };

    // Xử lý chọn đồ uống
    const handleDrinkChange = (drink) => {
        setSelectedDrinks((prevSelected) =>
            prevSelected.includes(drink.DrinkID)
                ? prevSelected.filter((d) => d !== drink.DrinkID) // Remove drink from selected
                : [...prevSelected, drink.DrinkID] // Add drink to selected
        );
    };

    // Tính tổng giá trị
    const foodTotalPrice = selectedFood?.reduce((total, foodId) => {
        const food = foods.find((item) => item.FoodID === foodId);
        return total + (food?.UnitPrice || 0);
    }, 0);

    const drinksTotalPrice = selectedDrinks?.reduce((total, drinkId) => {
        const drink = drinks.find((item) => item.DrinkID === drinkId);
        return total + (drink?.UnitPrice || 0);
    }, 0);

    const totalMenuPrice = foodTotalPrice + drinksTotalPrice;
    const isDecorePriceDifferent = (price1, price2) => {
        if (!price1 || !price2) return true; // Nếu một trong hai không tồn tại
        const priceKeys = ["LobbyDecorePrice", "StageDecorePrice", "TableDecorePrice", "Type"];
        return priceKeys.some((key) => price1[key] !== price2[key]);
    };

    const isDecoreDifferent = (newDecore, originalDecore) => {
        if (!newDecore || !originalDecore) return true;

        const decoreKeys = ["LobbyDecore", "StageDecore", "TableDecore"];
        const areBooleansDifferent = decoreKeys.some(
            (key) => newDecore[key] !== originalDecore[key]
        );

        const isDecorePriceIDDifferent = newDecore.DecorePriceID !== originalDecore.DecorePriceID;

        const isPriceDetailsDifferent = isDecorePriceDifferent(
            newDecore.DecorePrice,
            originalDecore.DecorePrice
        );

        return areBooleansDifferent || isDecorePriceIDDifferent || isPriceDetailsDifferent;
    };

    const handleSubmit = async () => {
        let isChange = false;
        const newDecore = { ...Decore, DecorePrice: selectedPrice, DecorePriceID: selectedPrice.DecorePriceID }
        if (isDecoreDifferent(newDecore, eventData.Decore)) {
            await updateDecore(dispatch, eventData.Decore.DecoreID, newDecore)
            isChange = true
        } else { console.log("Decore khoong co thay doi") }
        // Hàm so sánh hai mảng dựa trên ID
        const isDifferent = (selectedIDs, originalItems, idKey) => {
            const originalIDs = originalItems.map(item => item[idKey]); // Trích xuất danh sách ID từ dữ liệu ban đầu
            if (selectedIDs.length !== originalIDs.length) return true;
            return selectedIDs.some(id => !originalIDs.includes(id)) ||
                originalIDs.some(id => !selectedIDs.includes(id));
        };

        const foodChanged = isDifferent(selectedFood, eventData.Menu.Food || [], "FoodID");
        const drinksChanged = isDifferent(selectedDrinks, eventData.Menu.Drinks || [], "DrinkID");

        // Thực hiện các bước tiếp theo nếu có sự khác biệt
        if (foodChanged || drinksChanged) {
            const menuData = {
                Food: selectedFood, 
                Drinks: selectedDrinks,
            };

            if (selectedFood.length >= 1 || selectedDrinks.length >= 1) {
                try {
                    const newMenu = await addMenu(dispatch, menuData, true);
                    if (newMenu) {
                        await updateEvent(dispatch, eventData.EventID, {
                            ...eventData,
                            MenuID: newMenu.MenuID,
                            Menu: newMenu,
                        });
                        isChange = true
                        onClose();
                    }
                } catch (error) {
                    console.error("Error creating menu:", error);
                }
            } else {
                toast.error("Hãy chọn ít nhất 1 loại ");
            }
        } else {
            console.log("Không có thay đổi trong menu, không thực hiện thêm hành động nào.");
        }
        if (isChange) {
            await PostZaloApi(dispatch,booking)
            await getAllBooking(dispatch);
        }
        onClose();
    };


    return (
        <Modal open={open} onClose={onClose}>
            <Card sx={{ p: 3, maxWidth: "80%", maxHeight: "80%", mx: "auto", overflowY: "scroll" }}>
                <Grid container spacing={3} justifyContent='center'>
                    <Grid item xs={12} sm={4} md={4}>
                        <Card variant="outlined">
                            <CardContent>
                                <div>
                                    <Typography>
                                        <strong>Món ăn:</strong>
                                    </Typography>
                                    {selectedFood?.map((foodId, idx) => (
                                        <Typography variant="body2" key={idx} sx={{ textAlign: 'left', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>
                                            {foods.find((food) => food.FoodID === foodId)?.Name}
                                        </Typography>
                                    ))}
                                </div>
                                <div>
                                    <Typography>
                                        <strong>Đồ uống:</strong>
                                    </Typography>
                                    {selectedDrinks?.map((drinkId, idx) => (
                                        <Typography variant="body2" key={idx} sx={{ textAlign: 'left', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>
                                            {drinks.find((drink) => drink.DrinkID === drinkId)?.Name}
                                        </Typography>
                                    ))}
                                </div>
                            </CardContent>
                            <Typography variant="h6" color="textSecondary" sx={{ textAlign: 'left', paddingX: '10px' }}>
                                {`Giá: ${totalMenuPrice.toLocaleString()} VND/bàn`}
                            </Typography>

                            <Grid container spacing={2} justifyContent="center" marginTop={2} >
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        {/* <InputLabel>Chọn loại giá</InputLabel> */}
                                        <Select
                                            sx={{ backgroundColor: "white" }}
                                            value={selectedType}
                                            onChange={handlePriceTypeChange}
                                        >
                                            <MenuItem value={"BASIC"}>Cơ bản</MenuItem>
                                            <MenuItem value={'ADVANCED'}>Nầng cao</MenuItem>
                                            <MenuItem value={'PREMIUM'}>Cao cấp</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {decoreOptions.map((option) => (
                                    <Grid item xs={12} key={option.name}>
                                        <Card
                                            sx={{
                                                maxWidth: 300,
                                                transition: "0.3s",
                                                textAlign: "center",
                                                margin: "auto",
                                            }}
                                        >
                                            <CardContent>
                                                <Typography variant="h6" align="center" sx={{ fontWeight: "bold", mt: 1 }}>
                                                    {option.label}
                                                </Typography>
                                                <Typography variant="body1" align="center" sx={{ fontWeight: "bold", mt: 1 }}>
                                                    {option.price}
                                                </Typography>
                                                <ToggleButton
                                                    value={option.name}
                                                    selected={option.selected}
                                                    onChange={() => handleToggle(option.name)}
                                                    sx={{
                                                        width: "100%",
                                                        backgroundColor: option.selected ? "#64463c" : "#f5f5f5",
                                                        color: option.selected ? "#fff" : "#64463c",
                                                        borderRadius: "5px",
                                                        mt: 2,
                                                        "&:hover": {
                                                            backgroundColor: option.selected ? "#52382f" : "#ebebeb",
                                                        },
                                                    }}
                                                >
                                                    {option.selected ? <Check sx={{ fontSize: 25 }} /> : "Chọn"}
                                                </ToggleButton>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Card>
                        <Button onClick={handleSubmit}>Lưu</Button>
                    </Grid>
                    <Grid item xs={12} sm={8} md={8}>
                        <Card>
                            <Grid container>
                                {foods.map((food) => (
                                    <Grid item xs={4} key={food.FoodID}>
                                        <ListItem>
                                            <Checkbox
                                                checked={selectedFood?.includes(food.FoodID)}
                                                onChange={() => handleFoodChange(food)}
                                            />
                                            <ListItemText primary={`${food.Name} (${food.UnitPrice} VND)`} />
                                        </ListItem>
                                    </Grid>
                                ))}
                            </Grid>
                        </Card>

                        <Card>
                            <Grid container>
                                {drinks.map((drink) => (
                                    <Grid item xs={6} key={drink.DrinkID}>
                                        <ListItem>
                                            <Checkbox
                                                checked={selectedDrinks?.includes(drink.DrinkID)}
                                                onChange={() => handleDrinkChange(drink)}
                                            />
                                            <ListItemText primary={`${drink.Name} (${drink.UnitPrice} VND)`} />
                                        </ListItem>
                                    </Grid>
                                ))}
                            </Grid>
                        </Card>
                    </Grid>

                </Grid>
            </Card>
        </Modal>
    );
};

export default EditEventModal;
