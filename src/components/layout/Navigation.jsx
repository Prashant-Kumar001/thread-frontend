import { ArrowLeft } from "lucide-react";
import { GoHomeFill } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { CiUser } from "react-icons/ci";
import { IoIosAdd } from "react-icons/io";

import { IconButton, Tooltip, Box, useTheme } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setInput } from "../../redux/features/threadSlice";

const Navigation = ({ iconColor }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);

  const isHome = location.pathname === "/";
  const color = iconColor || theme.palette.text.primary;

  const navItems = [
    {
      label: "Home",
      icon: <GoHomeFill size={26} />,
      onClick: () => navigate("/"),
      active: location.pathname === "/",
    },
    {
      label: "Search",
      icon: <FiSearch size={26} />,
      onClick: () => navigate("/search"),
      active: location.pathname === "/search",
    },
    {
      label: "New Thread",
      icon: <IoIosAdd size={26} />,
      onClick: () => dispatch(setInput(true)),
      active: false,
    },
    {
      label: "Profile",
      icon: <CiUser size={26} />,
      onClick: () => {
        if (user?.username) navigate(`/${user.username}`);
      },
      active: location.pathname === `/${user?.username}`,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        // bgcolor: theme.palette.background.paper,
        // boxShadow: theme.shadows[3],
        borderRadius: 3,
        padding: "8px 16px",
        width: "100%",
        maxWidth: 480,
        mx: "auto",
      }}
    >
      {!isHome && (
        <Tooltip title="Back">
          <IconButton
            onClick={() => navigate(-1)}
            aria-label="Back"
            sx={{
              bgcolor: theme.palette.action.hover,
              "&:hover": {
                bgcolor: theme.palette.action.selected,
              },
              borderRadius: "50%",
              p: 1,
            }}
          >
            <ArrowLeft size={26} color={color} />
          </IconButton>
        </Tooltip>
      )}

      {navItems.map(({ label, icon, onClick, active }, idx) => (
        <Tooltip title={label} key={idx}>
          <IconButton
            onClick={onClick}
            aria-label={label}
            sx={{
              bgcolor: active ? theme.palette.primary.main : "transparent",
              color: active ? theme.palette.primary.contrastText : color,
              borderRadius: "50%",
              p: 1,
              transition: "background-color 0.3s, color 0.3s",
              "&:hover": {
                bgcolor: active
                  ? theme.palette.primary.dark
                  : theme.palette.action.hover,
              },
            }}
          >
            {icon}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
};

export default Navigation;
