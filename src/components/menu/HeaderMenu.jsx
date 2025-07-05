import {
  Menu,
  MenuItem,
  IconButton,
  useTheme,
  ListItemIcon,
  Button,
  Grow,
  Box,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RiMenu3Fill, RiArrowRightSLine } from "react-icons/ri";
import {
  FaRegSun,
  FaRegMoon,
  FaDesktop,
} from "react-icons/fa";
import { BiArrowBack } from "react-icons/bi";

const HeaderMenu = ({ onLogout, onToggleTheme }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [appearanceMenuOpen, setAppearanceMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setAppearanceMenuOpen(false);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setAppearanceMenuOpen(false);
  };

  const handleAppearanceClick = () => {
    setAppearanceMenuOpen(true);
  };

  const handleBackToMainMenu = () => {
    setAppearanceMenuOpen(false);
  };

  const handleToggleTheme = (newMode) => {
    onToggleTheme?.(newMode);
    handleMenuClose();
  };

  return (
    <>
      <IconButton
        onClick={handleMenuClick}
        aria-label="Open menu"
        aria-controls={open ? "header-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{
          transition: "transform 0.2s ease",
          "&:hover": {
            transform: "scale(1.1)",
            backgroundColor: "background.paper",
            color: "text.primary",
          },
          color: "text.secondary",
          backgroundColor: "background.default",
          borderRadius: "50%",
          p: 1,
        }}
      >
        <RiMenu3Fill size={28} />
      </IconButton>

      <Menu
        id="header-menu"
        anchorEl={anchorEl}
        open={open && !appearanceMenuOpen}
        onClose={handleMenuClose}
        TransitionComponent={Grow}
        keepMounted
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          elevation: 2,
          sx: {
            mt: 2,
            borderRadius: 2,
            minWidth: 200,
            py: 1,
            backgroundColor: theme.palette.menuBackground || theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            color: "text.primary",
            boxShadow:
              theme.palette.mode === 'dark'
                ? '0 0 10px rgba(255,255,255,0.1)'
                : '0 px 10px rgba(0,0,0,0.1)',
          },
        }}
      >
        <MenuItem onClick={handleAppearanceClick}>
          Appearance
          <ListItemIcon sx={{ ml: "auto" }}>
            <RiArrowRightSLine style={{ fontSize: 18 }} />
          </ListItemIcon>
        </MenuItem>
        {/* <MenuItem component={Link} to="/report" onClick={handleMenuClose}>
          Report a problem
        </MenuItem> */}
        {
          user ? (
            <MenuItem onClick={onLogout}>Logout</MenuItem>
          ) : (
            <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
              Login
            </MenuItem>
          )
        }
      </Menu>

      <Menu
        id="appearance-menu"
        anchorEl={anchorEl}
        open={open && appearanceMenuOpen}
        onClose={handleMenuClose}
        TransitionComponent={Grow}
        keepMounted
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          elevation: 2,
          sx: {
            mt: 2,
            borderRadius: 2,
            backgroundColor: theme.palette.menuBackground || theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            color: "text.primary",
            px: 2,
            py: 1,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Tooltip title="Back" arrow>
            <IconButton
              onClick={handleBackToMainMenu}
              sx={{
                transition: "0.2s",
                "&:hover": {
                  color: theme.palette.primary.main,
                  boxShadow: `0 0 8px ${theme.palette.primary.main}`,
                },
              }}
            >
              <BiArrowBack style={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Light" arrow>
            <IconButton
              onClick={() => handleToggleTheme("light")}
              sx={{
                transition: "0.2s",
                "&:hover": {
                  color: "#fbc02d",
                  boxShadow: "0 0 8px #fbc02d",
                },
              }}
            >
              <FaRegSun style={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Dark" arrow>
            <IconButton
              onClick={() => handleToggleTheme("dark")}
              sx={{
                transition: "0.2s",
                "&:hover": {
                  color: "#90caf9",
                  boxShadow: "0 0 8px #90caf9",
                },
              }}
            >
              <FaRegMoon style={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="System" arrow>
            <IconButton
              onClick={() => handleToggleTheme("system")}
              sx={{
                transition: "0.2s",
                "&:hover": {
                  color: "#4caf50",
                  boxShadow: "0 0 8px #4caf50",
                },
              }}
            >
              <FaDesktop style={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Menu>
    </>
  );
};

export default HeaderMenu;
