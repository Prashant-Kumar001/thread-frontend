import {
  AppBar,
  Box,
  IconButton,
  Paper,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FaThreads } from "react-icons/fa6";
import Navigation from "./Navigation";
import HeaderMenu from "../menu/HeaderMenu";
import { useLogoutMutation } from "../../redux/services/auth/auth";
import { useDispatch, useSelector } from "react-redux";
import { setThemeMode } from "../../redux/features/themeSlice";

export default function Header() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { accessToken } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  const [logout] = useLogoutMutation(undefined, {
    skip: !accessToken,
    fixedCacheKey: "logout",
  });

  const handleLogout = () => {
    logout()
      .unwrap()
      .then(() => console.log("Logout successful"))
      .catch((error) => console.error("Logout failed:", error));
  };

  const handleDashboard = () => {
    console.log("Navigating to Admin Dashboard...");
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backdropFilter: "blur(6px)",
          backgroundColor: theme.palette.mode === "dark" ? "rgba(18,18,18,0.7)" : "rgba(255,255,255,0.7)",
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
          transition: "background-color 0.3s ease",
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Toolbar
          sx={{
            maxWidth: 1200,
            mx: "auto",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 1, md: 3 },
            minHeight: 64,
          }}
        >
          <IconButton
            disableRipple
            sx={{
              color: theme.palette.primary.main,
              "&:hover": { backgroundColor: "transparent" },
            }}
            aria-label="App Logo"
          >
            <FaThreads size={28} />
          </IconButton>

          {isDesktop && (
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Navigation />
            </Box>
          )}

          <HeaderMenu
            onToggleTheme={(newMode) => dispatch(setThemeMode(newMode))}
            onLogout={handleLogout}
            onDashboard={handleDashboard}
          />
        </Toolbar>
      </AppBar>
      {!isDesktop && (
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: 56,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            zIndex: theme.zIndex.drawer + 1,
            borderRadius: 0,
            bgcolor:
              theme.palette.mode === "dark"
                ? theme.palette.background.default
                : theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            px: 1,
          }}
        >
          <Navigation
            iconColor={theme.palette.mode === "dark" ? "white" : "black"}
          />
        </Paper>
      )}
    </>
  );
}
