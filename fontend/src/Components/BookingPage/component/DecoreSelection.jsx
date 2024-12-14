import { Card, CardContent, Typography, Grid, ToggleButton, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { TheaterComedy, EventSeat, TableRestaurant, Check } from "@mui/icons-material"; // Biểu tượng
import { useState } from "react";

const DecoreSelection = ({ Decore, onDecoreChange,price,selectedPrice,setSelectedPrice }) => {
    console.log(price)
    const [selectedType,setSelectedType] = useState('BASIC')

    const decoreOptions = [
        { name: "LobbyDecore",price: selectedPrice?.LobbyDecorePrice.toLocaleString()+" VND", label: "Sảnh", icon: <img src="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/public/Event/decore/lobby.png?t=2024-11-26T17%3A57%3A36.749Z" width={50} height={50} />, selected: Decore.LobbyDecore },
        { name: "StageDecore",price: selectedPrice?.StageDecorePrice.toLocaleString()+" VND", label: "Sân khấu", icon: <img src="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/public/Event/decore/pngegg.png?t=2024-11-26T17%3A58%3A35.592Z" width={50} height={50} />, selected: Decore.StageDecore },
        { name: "TableDecore",price: selectedPrice?.TableDecorePrice.toLocaleString()+" VND/bàn", label: "Bàn", icon: <TableRestaurant sx={{ fontSize: 50 }} />, selected: Decore.TableDecore },
    ];

    const handleToggle = (name) => {
        onDecoreChange(name, !Decore[name]);
    };
    const handlePriceTypeChange = (event) => {
        const type = event.target.value
        setSelectedType(type);
        const priceSelected = price.find((item)=>item.Type===type)
        setSelectedPrice(priceSelected)
    };

    return (
        <Grid container spacing={2} justifyContent="center" marginTop={2} >
                    <Grid item xs={12}>
                <FormControl fullWidth>
                    {/* <InputLabel>Chọn loại giá</InputLabel> */}
                    <Select
                        sx={{backgroundColor:"white"}}
                        value={selectedType}
                        onChange={handlePriceTypeChange}
                    >
                            <MenuItem  value={"BASIC"}>Cơ bản</MenuItem>
                            <MenuItem  value={'ADVANCED'}>Nầng cao</MenuItem>
                            <MenuItem  value={'PREMIUM'}>Cao cấp</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            {decoreOptions.map((option) => (
                <Grid item xs={12} sm={6} md={4} key={option.name}>
                    <Card
                        sx={{
                            maxWidth: 300,
                            transition: "0.3s",
                            textAlign: "center",
                            margin:"auto",
                        }}
                    >
                        <CardContent>
                            <div>{option.icon}</div>
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
    );
};

export default DecoreSelection;
