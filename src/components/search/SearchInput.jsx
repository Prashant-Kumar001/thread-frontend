import React from "react";
import { TextField, Box, InputAdornment, useTheme } from "@mui/material";
import { FaSearch } from "react-icons/fa";

const SearchInput = ({ value, onChange, placeholder = "Search..." }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box display="flex" justifyContent="center" px={2}>
      <TextField
        variant="outlined"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        fullWidth
        sx={{
          maxWidth: 750,
          my: 3,
          boxShadow: theme.shadows[2],
          borderRadius: "15px",
          backgroundColor: theme.palette.background.paper,
          "& .MuiOutlinedInput-root": {
            borderRadius: "15px",
            paddingRight: "8px",
            color: theme.palette.text.primary,
            "& fieldset": {
              border: "none",
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FaSearch color={theme.palette.text.secondary} />
            </InputAdornment>
          ),
          inputProps: {
            "aria-label": "Search",
          },
        }}
      />
    </Box>
  );
};

export default SearchInput;
