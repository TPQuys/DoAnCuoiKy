import React from "react";
import { Modal, Box, Typography, Button, Rating } from "@mui/material";

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

const RateDetailModal = ({ rate, open, onClose }) => {
  if (!rate) return null;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="rate-detail-modal">
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>Chi tiết đánh giá</Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", m: 3 }}>
          Phòng:
          <Rating
            name="Rate"
            disabled={true}
            value={rate.Rate}
            size="large"
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", m: 3 }}>
          Dịch vụ:
          <Rating
            name="RateService"
            disabled={true}
            value={rate.RateService}
            size="large"
          />
        </Box>
        <Typography><strong>Bình luận:</strong> {rate.Comment || "Không có"}</Typography>
        <Box sx={{ textAlign: "right", mt: 6 }}>
          <Button onClick={onClose} variant="contained">Đóng</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default RateDetailModal;
