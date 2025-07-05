import React from "react";
import { Avatar, Box, Button, InputBase, Paper } from "@mui/material";
import { FaUserCircle } from "react-icons/fa";

const ThreadInput = ({
  value,
  onChange,
  onPost,
  disabled = false,
  placeholder = "Start a thread...",
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        borderRadius: "999px",
        px: 2,
        py: 1,
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
        <FaUserCircle size={28} color="#bbb" />
      </Box>
      <InputBase
        id="post-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        fullWidth
        sx={{
          fontSize: "0.95rem",
          ml: 1,
        }}
      />
      <Button
        onClick={onPost}
        disabled={disabled || value.trim() === ""}
        variant="contained"
        sx={{
          textTransform: "none",
          borderRadius: "999px",
          backgroundColor: "#ccc",
          color: "#fff",
          ml: 1,
          "&:hover": {
            backgroundColor: "#aaa",
          },
        }}
      >
        Post
      </Button>
    </Paper>
  );
};

export default ThreadInput;
