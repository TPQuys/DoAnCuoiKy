import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

const MenuModal = ({ open, onClose, menu }) => {
    // Tính tổng giá của foods và drinks
    const foodTotalPrice = menu?.Food?.reduce((total, food) => {
        return total + (food.UnitPrice * food.MenuFoods.Quantity);
    }, 0);

    const drinksTotalPrice = menu?.Drinks?.reduce((total, drink) => {
        return total + (drink.UnitPrice * drink.MenuDrinks.Quantity);
    }, 0);

    const totalMenuPrice = foodTotalPrice + drinksTotalPrice;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Chi tiết Menu</DialogTitle>
            <DialogContent>
                <div>
                    <h1>{menu.Name}</h1>
                    <h3>{`Giá: ${totalMenuPrice.toLocaleString()} VND/bàn`}</h3> {/* Hiển thị tổng giá của menu */}
                    
                    <div>
                        <strong>Foods:</strong>
                        {menu.Food?.map((food, idx) => (
                            <div key={idx} className='menu-item'>
                                <span>{food.Name}</span>
                            </div>
                        ))}
                    </div>

                    <div>
                        <strong>Drinks:</strong>
                        {menu.Drinks?.map((drink, idx) => (
                            <div key={idx} className='menu-item'>
                                <span>{drink.Name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Đóng</Button>
            </DialogActions>
        </Dialog>
    );
};

export default MenuModal;
