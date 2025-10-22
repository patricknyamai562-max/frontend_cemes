// src/App.jsx
import React, { useState, useMemo, createContext, useContext, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getCemesTheme } from "./theme"; // from your theme.js
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Loans from "./pages/Loans";
import Customers from "./pages/Customers";
import Payments from "./pages/Payments";
import Admin from "./pages/Admin";
import Login from "./Pages/Login";
import { AuthProvider, RequireAuth } from "./contexts/AuthContext";

// Create Color Mode Context (your existing)
const ColorModeContext = createContext({ toggleColorMode: () => {} });
export const useColorMode = () => useContext(ColorModeContext);

export default function App() {
  // Default mode is light
  const [mode, setMode] = useState("light");

  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode) setMode(savedMode);
  }, []);

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => getCemesTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          {/* AuthProvider must be inside BrowserRouter so it can use navigation */}
          <AuthProvider>
            <Routes>
              {/* Public route */}
              <Route path="/login" element={<Login />} />

              {/* Protected routes (wrap MainLayout in RequireAuth) */}
              <Route
                element={
                  <RequireAuth>
                    <MainLayout />
                  </RequireAuth>
                }
              >
                <Route path="/" element={<Dashboard />} />
                <Route path="/loans" element={<Loans />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/admin" element={<Admin />} />
              </Route>

              {/* Fallback to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
