import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Header from '../Header/Header';
import { useSelector } from "react-redux";

const MenuPage = () => {
    const menus = useSelector((state) => state.menus?.menus);
    const foods = useSelector((state) => state.foods?.foods);
    const drinks = useSelector((state) => state.drinks?.drinks);

    console.log(foods);
    console.log(drinks);

    return (
        <main className="home-container">
            <Header
                background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/homeheader.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21laGVhZGVyLmpwZyIsImlhdCI6MTcyNzYxODE4OSwiZXhwIjoxNzU5MTU0MTg5fQ.QU5J1wJV043dbnA6WzcnrIvAVUFGtf3Xc7QCsdIPvR8&t=2024-09-29T13%3A56%3A29.431Z"
                title="THỰC ĐƠN"
            />
            <div className="menu-container">
                <Grid container spacing={3} justifyContent='center'>
                    {menus.map((menu, index) => {
                        const foodTotalPrice = menu.Food.reduce((total, food) => {
                            return total + (food.UnitPrice * food.MenuFoods.Quantity);
                        }, 0);

                        const drinksTotalPrice = menu.Drinks.reduce((total, drink) => {
                            return total + (drink.UnitPrice * drink.MenuDrinks.Quantity);
                        }, 0);

                        const totalMenuPrice = foodTotalPrice + drinksTotalPrice;

                        return (
                            <Grid item xs={8} sm={6} md={4} key={index} >
                                <Card variant="outlined" >
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            backgroundColor: '#fdeacd',
                                            fontSize: 25,
                                            fontWeight: 600,
                                            color: '#81695e',
                                            padding: '10px', // Đảm bảo có khoảng cách xung quanh
                                        }}
                                    >
                                        {menu.Name}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        color="textSecondary"
                                        sx={{
                                            fontSize: '1.2rem',
                                            textAlign: 'left', // Căn trái giá
                                            paddingX: '10px' // Khoảng cách từ hai bên
                                        }}
                                    >
                                        {`Giá: ${totalMenuPrice.toLocaleString()} VND/bàn`}
                                    </Typography>
                                    <CardContent>
                                        <img
                                            src={menu.Image}
                                            height={200}
                                            width={300}
                                        />
                                        <div>
                                            <Typography
                                     
                                            >
                                                <strong>Món ăn:</strong>
                                            </Typography>
                                            {menu.Food.map((food, idx) => (
                                                <Typography
                                                    key={idx}
                                                    variant="body2"
                                                    sx={{
                                                        fontSize: '1rem',
                                                        textAlign: 'left',
                                                        borderBottom: '1px solid #ddd', // Đường viền nhạt
                                                        paddingBottom: '5px' // Khoảng cách dưới dòng
                                                    }}
                                                >
                                                    {food.Name}
                                                </Typography>
                                            ))}
                                        </div>
                                        <div>
                                            <Typography
                                            >
                                                <strong>Đồ uống:</strong>
                                            </Typography>
                                            {menu.Drinks.map((drink, idx) => (
                                                <Typography
                                                    key={idx}
                                                    variant="body2"
                                                    sx={{
                                                        fontSize: '1rem',
                                                        textAlign: 'left',
                                                        borderBottom: '1px solid #ddd', // Đường viền nhạt
                                                        paddingBottom: '5px' // Khoảng cách dưới dòng
                                                    }}
                                                >
                                                    {drink.Name}
                                                </Typography>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                            </Grid>
                        );
                    })}
                </Grid>
            </div>
            <Grid container spacing={3} justifyContent='center' mb={3}>
                <Grid item xs={6} sm={6} md={3}>
                    <Card variant="outlined" >
                        <Typography variant="h6" sx={{ mb: 3, backgroundColor: '#fdeacd', fontSize: 25, fontWeight: 600, color: '#81695e' }}>Danh sách thực phẩm</Typography>
                        {foods.map((item, idx) => (
                            <Grid key={idx} container spacing={1} justifyalignItems="center" justifyContent="space-between" paddingX={3} >
                                <Grid item>
                                    <Typography variant="body1">{item.Name}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1">{item.UnitPrice} VND</Typography>
                                </Grid>
                            </Grid>
                        ))}
                    </Card>
                </Grid>

                <Grid item xs={6} sm={6} md={3}>
                    <Card variant="outlined" >
                        <Typography variant="h6" sx={{ mb: 3, backgroundColor: '#fdeacd', fontSize: 25, fontWeight: 600, color: '#81695e' }}>Danh sách đồ uống</Typography>
                        {drinks.map((item, idx) => (
                            <Grid key={idx} container spacing={1} alignItems="center" justifyContent="space-between" paddingX={3}>
                                <Grid item>
                                    <Typography variant="body1">{item.Name}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1">{item.UnitPrice} VND</Typography>
                                </Grid>
                            </Grid>
                        ))}
                    </Card>
                </Grid>
            </Grid>
            <div>

            </div>
        </main>
    );
};

export default MenuPage;
