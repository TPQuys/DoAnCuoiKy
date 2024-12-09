import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Rating,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

const AddRatingModal = ({ open, onClose, onSubmit, booking }) => {
  const [formData, setFormData] = useState({
    Rate: 0,
    Comment: "",
    BookingID: booking
  });

  useEffect(()=>{
    setFormData({...formData,BookingID:booking})
  },[booking])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      Rate: newValue,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({ Rate: 0, Comment: "", BookingID: booking });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-rating-modal">
      <Box sx={style}>
        <Typography id="add-rating-modal" variant="h6" component="h2" gutterBottom>
          Add Rating
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Rating
            name="Rate"
            value={formData.Rate}
            onChange={handleRatingChange}
            size="large"
          />
        </Box>
        <Typography variant="body2" color="textSecondary" align="center" gutterBottom>
          {formData.Rate === 0
            ? "Please select a rating"
            : `You have selected ${formData.Rate} star${formData.Rate > 1 ? 's' : ''}`}
        </Typography>
        <TextField
          name="Comment"
          label="Comment"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={formData.Comment}
          onChange={handleChange}
        />
      
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={onClose} sx={{ mr: 1 }} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddRatingModal;