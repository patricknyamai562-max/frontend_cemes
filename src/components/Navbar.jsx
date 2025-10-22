// src/components/Navbar.jsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Tooltip,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useTheme } from "@mui/material/styles";
import { useColorMode } from "../App";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

const drawerWidth = 220;

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const theme = useTheme();
  const { toggleColorMode } = useColorMode();
  const { logout } = useAuth();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout(); // ✅ uses context logout
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        backgroundColor: theme.palette.primary.main,
        color: "#fff",
        boxShadow: "none",
        borderBottom: `4px solid ${theme.palette.secondary.main}`,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          CEMES Dashboard
        </Typography>

        {/* Theme Toggle */}
        <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
          <Tooltip
            title={`Switch to ${
              theme.palette.mode === "light" ? "dark" : "light"
            } mode`}
          >
            <IconButton color="inherit" onClick={toggleColorMode}>
              <AnimatePresence mode="wait" initial={false}>
                {theme.palette.mode === "light" ? (
                  <motion.div
                    key="dark"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <DarkModeIcon />
                  </motion.div>
                ) : (
                  <motion.div
                    key="light"
                    initial={{ rotate: 180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -180, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <LightModeIcon />
                  </motion.div>
                )}
              </AnimatePresence>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Profile */}
        <IconButton color="inherit" onClick={handleMenuOpen}>
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: theme.palette.secondary.main,
              color: theme.palette.primary.main,
            }}
          >
            <AccountCircle />
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
