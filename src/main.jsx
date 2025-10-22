// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// 🌈 Import Material UI theme tools
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getCemesTheme } from "./theme"; // ✅ FIXED: use named import

// 🚀 Create the initial theme (default: light mode)
const theme = getCemesTheme("light");

// 🚀 Render the App with theme support
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {/* CssBaseline resets default browser styles */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
