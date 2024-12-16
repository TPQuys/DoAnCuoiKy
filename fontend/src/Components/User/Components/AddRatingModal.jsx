import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, TextField, Button, Rating } from "@mui/material";

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

const AddRatingModal = ({ open, onClose, onSubmit, booking, user }) => {
  // State to hold form data
  const [formData, setFormData] = useState({
    Rate: 0,
    RateService: 0,
    Email: user?.user?.email || "", // Ensure user email is available
    Comment: "",
    BookingID: booking?.BookingID || "",
    RoomEventID: booking?.Event?.RoomEvent?.RoomEventID || "",
  });

  // Update form data when the booking or user changes
  useEffect(() => {
    if (booking) {
      setFormData((prev) => ({
        ...prev,
        BookingID: booking?.BookingID,
        RoomEventID: booking?.Event?.RoomEvent?.RoomEventID,
        Email:user?.user?.email
      }));
    }
  }, [booking,user]);

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

  const handleRatingServiceChange = (event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      RateService: newValue,
    }));
  };

  const handleSubmit = () => {
    // Check if necessary fields are filled before submitting
    if (formData.Rate === 0 || formData.RateService === 0) {
      alert("Please provide ratings for both overall experience and service.");
      return;
    }
    
    console.log(formData); // For debugging, you can log formData here
    onSubmit(formData); // Call the onSubmit prop with the form data
    setFormData({
      Rate: 0,
      RateService: 0,
      Comment: "",
      BookingID: "",
      RoomEventID: "",
    }); // Reset form data after submit
    onClose(); // Close the modal after submit
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-rating-modal">
      <Box sx={style}>
        <Typography id="add-rating-modal" variant="h6" component="h2" gutterBottom>
          Đánh giá
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        Phòng:
          <Rating
            name="Rate"
            value={formData.Rate}
            onChange={handleRatingChange}
            size="large"
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          Dịch vụ:
          <Rating
            name="RateService"
            value={formData.RateService}
            onChange={handleRatingServiceChange}
            size="large"
          />
        </Box>

        <TextField
          name="Comment"
          label="Bình luận"
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
            Hủy
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Gửi
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddRatingModal;
