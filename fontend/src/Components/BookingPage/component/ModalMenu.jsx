import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, Grid, Typography, Checkbox, List, ListItem, ListItemText, Card, Divider } from '@mui/material';
import { addMenu } from "../../../redux/actions/menuRequest";
import { useDispatch, useSelector } from 'react-redux';
import { Padding } from '@mui/icons-material';
import { toast } from 'react-toastify';

// Style for the modal
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vw',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const selectedStyle = {
    padding: 2,
    width:'30%',
    background: "#fafaeb",
    borderRadius: 4,
}

const listWrap = {
    padding: 2,
    background: "#f5f5f5",
    borderRadius: 4,
}

const listStyle = {
    height: 200,
    maxHeight: 200,
    overflowY: 'auto',
    padding: 1,
};

const CreateMenuModal = ({ open, handleClose, setSelected }) => {
    const [selectedFood, setSelectedFood] = useState([]);
    const [selectedDrinks, setSelectedDrinks] = useState([]);
    const [totalPrice, setTotolPrice] = useState(0)
    const foods = useSelector((state) => state.foods?.foods);
    const drinks = useSelector((state) => state.drinks?.drinks);
    const dispatch = useDispatch()
    // Handle change for food selection
    const handleFoodChange = (foodId) => {
        setSelectedFood((prevSelected) =>
            prevSelected.includes(foodId)
                ? prevSelected.filter((id) => id !== foodId) // Remove food from selected
                : [...prevSelected, foodId] // Add food to selected
        );
    };

    // Handle change for drink selection
    const handleDrinkChange = (drinkId) => {
        setSelectedDrinks((prevSelected) =>
            prevSelected.includes(drinkId)
                ? prevSelected.filter((id) => id !== drinkId) // Remove drink from selected
                : [...prevSelected, drinkId] // Add drink to selected
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
        if(selectedFood.length>=4 && selectedDrinks.length>=2){
            try {
                const newMenu = await addMenu(dispatch, menuData);
                console.log(newMenu)
                setSelected(newMenu.MenuID)
                handleClose(); // Close the modal
            } catch (error) {
                console.error('Error creating menu:', error);
            }
        }else{
            if(selectedFood.length<4){
                toast.info("Số lượng món ăn tối thiểu là 4")
            }else if(selectedDrinks.length<2){
                toast.info("Số lượng đồ uống tối thiểu là 2")
            }
        }
       
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Card sx={modalStyle}>
                <Typography variant="h5" gutterBottom>Menu tự chọn</Typography>

                <Grid  >
                    {/* Left side: Display selected food and drinks */}
                    <Grid container sx={{ marginBottom: 2 }}>
                        <Grid sx={selectedStyle} xs={4}>
                            <Typography variant="h6" gutterBottom>Món ăn đã chọn</Typography>
                            <List sx={listStyle}>
                                {selectedFood.map((foodId) => {
                                    const food = foods.find(item => item.FoodID === foodId);
                                    return (
                                        <ListItem key={foodId}>
                                            <ListItemText primary={food.Name} />
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Grid>
                        <Grid sx={listWrap} xs={8}>
                            <Typography variant="h6" gutterBottom>Danh sách món ăn</Typography>
                            <List sx={listStyle}>
                                <Grid container >
                                    {foods.map((food) => (
                                        <Grid item xs={6} key={food.FoodID}>
                                            <ListItem>
                                                <Checkbox
                                                    checked={selectedFood.includes(food.FoodID)}
                                                    onChange={() => handleFoodChange(food.FoodID)}
                                                />
                                                <ListItemText primary={`${food.Name}/${food.UnitPrice}`} />
                                            </ListItem>
                                        </Grid>
                                    ))}
                                </Grid>
                            </List>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid sx={selectedStyle} xs={4}>
                            <Typography variant="h6" gutterBottom>Đồ uống đã chọn</Typography>
                            <List sx={listStyle}>
                                {selectedDrinks.map((drinkId) => {
                                    const drink = drinks.find(item => item.DrinkID === drinkId);
                                    return (
                                        <ListItem key={drinkId}>
                                            <ListItemText primary={`${drink?.Name}`} />
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Grid>
                        <Grid sx={listWrap} xs={8}>
                            <Typography variant="h6" gutterBottom>Danh sách đồ uống</Typography>
                            <List sx={listStyle}>
                                <Grid container>
                                    {drinks.map((drink) => (
                                        <Grid item xs={6} key={drink.DrinkID}>
                                            <ListItem>
                                                <Checkbox
                                                    checked={selectedDrinks.includes(drink.DrinkID)}
                                                    onChange={() => handleDrinkChange(drink.DrinkID)}
                                                />
                                                <ListItemText primary={`${drink.Name}/${drink.UnitPrice}`} />
                                            </ListItem>
                                        </Grid>
                                    ))}
                                </Grid>
                            </List>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container justifyContent="center" marginTop={2}>
                    <Grid item>
                        <Typography variant="h5" gutterBottom>Tổng giá: {totalPrice.toLocaleString()} VND/bàn</Typography>

                    </Grid>
                </Grid>
                <Grid container spacing={2} justifyContent="center" marginTop={2}>
                    <Grid item>
                        <Button variant="contained" onClick={handleSubmit}>
                            Xác nhận
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" onClick={handleClose}>
                            Hủy
                        </Button>
                    </Grid>
                </Grid>
            </Card>
        </Modal >
    );
};

export default CreateMenuModal;
