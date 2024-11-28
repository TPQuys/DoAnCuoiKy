import { Card, CardContent, Typography, Grid, ToggleButton } from "@mui/material";
import { TheaterComedy, EventSeat, TableRestaurant, Check } from "@mui/icons-material"; // Biểu tượng

const DecoreSelection = ({ Decore, onDecoreChange }) => {
    const decoreOptions = [
        { name: "LobbyDecore", label: "Sảnh", icon: <img src="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/public/Event/decore/lobby.png?t=2024-11-26T17%3A57%3A36.749Z" width={50} height={50} />, selected: Decore.LobbyDecore },
        { name: "StageDecore", label: "Sân khấu", icon: <img src="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/public/Event/decore/pngegg.png?t=2024-11-26T17%3A58%3A35.592Z" width={50} height={50} />, selected: Decore.StageDecore },
        { name: "TableDecore", label: "Bàn", icon: <TableRestaurant sx={{ fontSize: 50 }} />, selected: Decore.TableDecore },
    ];

    const handleToggle = (name) => {
        onDecoreChange(name, !Decore[name]);
    };

    return (
        <Grid container spacing={2} justifyContent="center" marginTop={2} >
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
