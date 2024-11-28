import React, { useState } from 'react';
import { Modal, Box, Button, Grid, Typography, Checkbox, List, ListItem, ListItemText, Card, Divider } from '@mui/material';
import { addMenu } from "../../../redux/actions/menuRequest";
import { useDispatch, useSelector } from 'react-redux';
import { Padding } from '@mui/icons-material';

// Style for the modal
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const selectedStyle = {
    padding:2,
    background:"#fdeacd",
    borderRadius: 4,
}

const listWrap = {
    padding:2,
    background:"#fafaeb",
    borderRadius: 4,
}

const listStyle = {
    height: 300,
    maxHeight: 300,  
    overflowY: 'auto',  
    padding:1,
};

const CreateMenuModal = ({ open, handleClose, setNewMenu }) => {
    const [selectedFood, setSelectedFood] = useState([]);
    const [selectedDrinks, setSelectedDrinks] = useState([]);
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

    const handleSubmit = async () => {
        const menuData = {
            Food: selectedFood,
            Drinks: selectedDrinks,
        };

        try {
            const newMenu = await addMenu(dispatch, menuData);
            console.log(newMenu)
            setNewMenu(newMenu)
            handleClose(); // Close the modal
        } catch (error) {
            console.error('Error creating menu:', error);
            alert('Error creating menu');
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Card sx={modalStyle}>
                <Typography variant="h5" gutterBottom>Menu tự chọn</Typography>

                <Grid  >
                    {/* Left side: Display selected food and drinks */}
                    <Grid container sx={{marginBottom:2}}>
                        <Grid sx={selectedStyle} xs={5}>
                            <Typography variant="h6" gutterBottom>Món ăn đã chọn</Typography>
                            <List sx={listStyle}>
                                {selectedFood.map((foodId) => {
                                    const food = foods.find(item => item.FoodID === foodId);
                                    return (
                                        <ListItem key={foodId}>
                                            <ListItemText primary={food?.Name} />
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Grid>
                        <Grid sx={listWrap} xs={7}>
                            <Typography variant="h6" gutterBottom>Danh sách món ăn</Typography>
                            <List sx={listStyle}>
                                <Grid container spacing={1}>
                                    {foods.map((food) => (
                                        <Grid item xs={6} key={food.FoodID}>  {/* Set 2 items per row */}
                                            <ListItem>
                                                <Checkbox
                                                    checked={selectedFood.includes(food.FoodID)}
                                                    onChange={() => handleFoodChange(food.FoodID)}
                                                />
                                                <ListItemText primary={food.Name} />
                                            </ListItem>
                                        </Grid>
                                    ))}
                                </Grid>
                            </List>

                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid sx={selectedStyle} xs={5}>
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
                        <Grid sx={listWrap} xs={7}>
                            <Typography variant="h6" gutterBottom>Danh sách đồ uống</Typography>
                            <List sx={listStyle}>
                                <Grid container spacing={1}>
                                    {drinks.map((drink) => (
                                        <Grid item xs={6} key={drink.DrinkID}>  {/* Set 2 items per row */}
                                            <ListItem>
                                                <Checkbox
                                                    checked={selectedDrinks.includes(drink.DrinkID)}
                                                    onChange={() => handleDrinkChange(drink.DrinkID)}
                                                />
                                                <ListItemText primary={`${drink.Name}`} />
                                            </ListItem>
                                        </Grid>
                                    ))}
                                </Grid>
                            </List>
                        </Grid>
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
