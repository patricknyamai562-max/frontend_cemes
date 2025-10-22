// src/layouts/MainLayout.jsx
import React from "react";
import { Box, Toolbar, Typography } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar"; // ✅ corrected import path
import { Outlet } from "react-router-dom";

const drawerWidth = 220;

export default function MainLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      {/* ✅ Top Navbar */}
      <Navbar />

      {/* ✅ Left Sidebar */}
      <Sidebar />

      {/* ✅ Main Content + Footer */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Page content goes here */}
        <Box>
          <Toolbar /> {/* keeps content below navbar */}
          <Outlet />
        </Box>

        {/* ✅ Footer Section */}
        <Box
          sx={{
            textAlign: "center",
            py: 2,
            borderTop: "1px solid rgba(0,0,0,0.1)",
            mt: 4,
          }}
        >
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            © {new Date().getFullYear()} CEMES Micro Ltd. | Version 1.0.0
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
