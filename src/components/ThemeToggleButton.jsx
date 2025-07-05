import { IconButton, useTheme, Tooltip, SvgIcon } from "@mui/material";
import { FaRegSun, FaRegMoon } from "react-icons/fa";


const ThemeToggleButton = ({ onToggle }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Tooltip title={`Switch to ${isDark ? "Light" : "Dark"} Mode`} placement="top">
      <IconButton
        onClick={onToggle}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1300,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        {isDark ? (
          <SvgIcon component={FaRegSun} inheritViewBox />
        ) : (
          <SvgIcon component={FaRegMoon} inheritViewBox />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggleButton;