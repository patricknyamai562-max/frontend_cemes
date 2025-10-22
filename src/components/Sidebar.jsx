// src/components/Sidebar.jsx
import React from "react";
import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PeopleIcon from "@mui/icons-material/People";
import PaymentIcon from "@mui/icons-material/Payment";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useTheme } from "@mui/material/styles";
import cemesLogo from "../assets/cemes-logo.png"; // ✅ make sure the logo is inside src/assets/

const drawerWidth = 220;

export default function Sidebar() {
  const location = useLocation();
  const theme = useTheme();

  const menuItems = [
    { text: "Dashboard", path: "/", icon: <DashboardIcon /> },
    { text: "Loans", path: "/loans", icon: <AccountBalanceIcon /> },
    { text: "Customers", path: "/customers", icon: <PeopleIcon /> },
    { text: "Payments", path: "/payments", icon: <PaymentIcon /> },
    { text: "Admin", path: "/admin", icon: <AdminPanelSettingsIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.primary.main
              : theme.palette.background.paper,
          color: "#fff",
          transition: "all 0.3s ease",
          borderRight: `3px solid ${theme.palette.secondary.main}`,
        },
      }}
    >
      {/* ✅ Logo and Company Section */}
      <Box
        component={Link}
        to="/"
        sx={{
          textDecoration: "none",
          color: "inherit",
          textAlign: "center",
          py: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.primary.main
              : theme.palette.background.default,
          "&:hover": {
            opacity: 0.9,
          },
        }}
      >
        <img
          src={cemesLogo}
          alt="CEMES Logo"
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "8px",
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color:
              theme.palette.mode === "light"
                ? theme.palette.secondary.main
                : theme.palette.primary.main,
            letterSpacing: 0.5,
          }}
        >
          CEMES
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color:
              theme.palette.mode === "light"
                ? "#fff"
                : theme.palette.text.secondary,
            fontSize: "0.8rem",
          }}
        >
          Micro Credit Ltd
        </Typography>
      </Box>

      {/* Keeps content below AppBar when AppBar is fixed */}
      <Toolbar />

      {/* ✅ Sidebar Menu */}
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.text}
              component={Link}
              to={item.path}
              sx={{
                my: 0.5,
                borderRadius: 1,
                mx: 1,
                backgroundColor: isActive
                  ? "rgba(255,255,255,0.2)"
                  : "transparent",
                color: isActive ? "#fff" : "#e0e0e0",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                },
                transition: "background-color 0.3s ease, color 0.3s ease",
              }}
            >
              <ListItemIcon
                sx={{
                  color: "#fff",
                  minWidth: 36,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 400,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}
