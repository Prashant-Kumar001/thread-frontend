import { createTheme } from "@mui/material";

export const getTheme = (mode = "dark") =>
  createTheme({
    palette: {
      mode,
      ...(mode === "dark"
        ? {
            background: {
              default: "#121212",
              paper: "#1e1e1e",
            },
            text: {
              primary: "#ffffff",
              secondary: "#b0b0b0",
            },
            primary: {
              main: "#bb86fc",
              dark: "#6200ee",
            },
            secondary: {
              main: "#03dac6",
            },
            divider: "#2e2e2e",
            menuBackground: "#000000",
          }
        : {
            background: {
              default: "#f4f4f4",
              paper: "#ffffff",
            },
            text: {
              primary: "#000000",
              secondary: "#4f4f4f",
            },
            primary: {
              main: "#6200ee",
              dark: "#3700b3",
            },
            secondary: {
              main: "#018786",
            },
            divider: "#e0e0e0",
          }),
    },
    shape: {
      borderRadius: 10,
    },
  });
