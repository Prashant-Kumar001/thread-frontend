import React from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const ReplyModal = ({
  open,
  onClose,
  onSubmit,
  value,
  setValue,
  replyingTo,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => setValue(e.target.value);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="reply-modal-title"
      aria-describedby="reply-modal-description"
      sx={{
        backdropFilter: "blur(2px)",
        backgroundColor: "rgba(0,0,0,0.3)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "90%" : 420,
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: theme.shadows[6],
          p: 3,
        }}
      >
        <Typography
          id="reply-modal-title"
          variant="h6"
          fontWeight={600}
          gutterBottom
        >
          Reply to @{replyingTo?.author?.username || "user"}
        </Typography>

        <TextField
          id="reply-modal-description"
          fullWidth
          multiline
          minRows={3}
          maxRows={6}
          autoFocus
          placeholder="Write your reply..."
          value={value}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            sx: {
              borderRadius: 2,
              fontSize: 14,
            },
          }}
        />

        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
          }}
        >
          <Button onClick={onClose} variant="text" color="secondary">
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            variant="contained"
            disabled={!value.trim()}
            color="primary"
          >
            Reply
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReplyModal;
