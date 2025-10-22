// src/theme.js
import { createTheme } from "@mui/material/styles";

// ✅ Function that builds your theme dynamically
export const getCemesTheme = (mode) => {
  const isLight = mode === "light";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#007B55", // CEMES Green
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#FFC107", // CEMES Gold
        contrastText: "#1a1a1a",
      },
      background: {
        default: isLight ? "#f4f6f8" : "#121212",
        paper: isLight ? "#ffffff" : "#1e1e1e",
      },
      text: {
        primary: isLight ? "#1a1a1a" : "#e0e0e0",
        secondary: isLight ? "#555555" : "#b0b0b0",
      },
      success: {
        main: "#2e7d32",
      },
      error: {
        main: "#d32f2f",
      },
      info: {
        main: "#0288d1",
      },
      divider: isLight ? "rgba(0, 0, 0, 0.08)" : "rgba(255,255,255,0.12)",
    },

    typography: {
      fontFamily: "'Poppins', 'Roboto', sans-serif",
      h1: {
        fontWeight: 700,
        fontSize: "2rem",
        color: isLight ? "#007B55" : "#90caf9",
      },
      h2: {
        fontWeight: 600,
        fontSize: "1.6rem",
      },
      h3: {
        fontWeight: 600,
        fontSize: "1.3rem",
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.6,
        color: isLight ? "#333333" : "#cccccc",
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },

    shape: {
      borderRadius: 12,
    },

    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: "8px 20px",
            boxShadow: "none",
            transition: "background-color 0.3s, box-shadow 0.3s",
            "&:hover": {
              boxShadow: isLight
                ? "0 4px 10px rgba(0, 123, 85, 0.2)"
                : "0 4px 10px rgba(255,255,255,0.1)",
            },
          },
          containedPrimary: {
            backgroundColor: "#007B55",
            "&:hover": {
              backgroundColor: "#006647",
            },
          },
          containedSecondary: {
            backgroundColor: "#FFC107",
            "&:hover": {
              backgroundColor: "#e0a800",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: isLight
              ? "0 2px 8px rgba(0,0,0,0.05)"
              : "0 2px 8px rgba(255,255,255,0.1)",
            padding: "1rem",
            transition: "background-color 0.3s, color 0.3s",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? "#007B55" : "#1e1e1e",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 10,
            },
          },
        },
      },
    },
  });
};
