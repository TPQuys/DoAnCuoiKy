import { Card, CardContent, Grid, Typography } from "@mui/material";

 const MeniSelect = ({ menus, handleSelect, selected }) => (
    <Grid container spacing={3} justifyContent='center'>
        {menus
            .filter((item) => item.Name !== null)
            .map((menu, index) => {
                const foodTotalPrice = menu.Food?.reduce((total, food) => {
                    return total + (food.UnitPrice * 1);
                    {/* return total + (food.UnitPrice * food.MenuFoods.Quantity); */ }
                }, 0);

                const drinksTotalPrice = menu.Drinks?.reduce((total, drink) => {
                    return total + (drink.UnitPrice * 1);
                    {/* return total + (drink.UnitPrice * drink.MenuDrinks.Quantity); */ }
                }, 0);

                const totalMenuPrice = foodTotalPrice + drinksTotalPrice;

                return (

                    <Grid item xs={12} sm={6}  md={3.5} key={index} >
                        <Card variant="outlined"
                            sx={{
                                backgroundColor: selected === menu?.MenuID ? '#fff4d0' : 'white',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleSelect(menu?.MenuID)}
                        >
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
                                    height={180}
                                    width={230}
                                />
                                <div>
                                    <Typography>
                                        <strong>Món ăn:</strong>
                                    </Typography>
                                    {menu?.Food?.map((food, idx) => (
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
                                    <Typography>
                                        <strong>Đồ uống:</strong>
                                    </Typography>
                                    {menu?.Drinks?.map((drink, idx) => (
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
)

export default MeniSelect;