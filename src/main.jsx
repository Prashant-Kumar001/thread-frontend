import React, { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Toaster } from "react-hot-toast";

import App from "./App.jsx";
import { store } from "./redux/store.js";
import { getTheme } from "./components/utils/theme.js";

import "./index.css";

const AppWrapper = () => {
  const themeMode = useSelector((state) => state.theme.mode);
  const resolvedMode = useMemo(() => {
  if (themeMode === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return themeMode;
}, [themeMode]);

const theme = useMemo(() => getTheme(resolvedMode), [resolvedMode]);


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
      <Toaster />
    </ThemeProvider>
  );
};

const rootElement = document.getElementById("root");

if (!rootElement._root) {
  rootElement._root = createRoot(rootElement);
}

rootElement._root.render(
    <BrowserRouter>
      <Provider store={store}>
        <AppWrapper />
      </Provider>
    </BrowserRouter>
);