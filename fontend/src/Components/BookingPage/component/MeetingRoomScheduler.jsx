import React, { useState } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";

const MeetingRoomScheduler = ({ slots, onSlotSelect }) => {
  const handleSlotClick = (slot) => {
    if (slot.status === "available") {
      onSlotSelect(slot);
    } else {
      alert("This slot is already booked.");
    }
  };

  return (
    <Box>
      <Typography variant="h5" marginBottom={2}>
        Room Schedule
      </Typography>
      <Grid container spacing={2}>
        {slots.map((slot, index) => (
          <Grid item xs={3} key={index}>
            <Button
              variant="contained"
              color={slot.status === "available" ? "primary" : "secondary"}
              onClick={() => handleSlotClick(slot)}
              disabled={slot.status === "booked"}
            >
              {slot.start} - {slot.end}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MeetingRoomScheduler;
