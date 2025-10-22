// src/components/StatCard.jsx
import React from "react";
import { Card, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AnimatedCounter from "./AnimatedCounter";
import { motion } from "framer-motion"; // ✅ Added for animation

export default function StatCard({ title, value, icon: Icon, color }) {
  const theme = useTheme();

  // Determine prefix/suffix dynamically
  const getPrefixSuffix = () => {
    if (title.toLowerCase().includes("payment")) return { prefix: "KSh ", suffix: "" };
    if (title.toLowerCase().includes("rate")) return { prefix: "", suffix: "%" };
    return { prefix: "", suffix: "" };
  };

  const { prefix, suffix } = getPrefixSuffix();

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor:
          color === "primary"
            ? theme.palette.primary.light
            : color === "secondary"
            ? theme.palette.secondary.light
            : theme.palette.background.paper,
        color:
          color === "primary"
            ? theme.palette.primary.contrastText
            : color === "secondary"
            ? theme.palette.secondary.contrastText
            : theme.palette.text.primary,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[6],
        },
      }}
    >
      {/* Left Text Section */}
      <Box>
        <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
          {title}
        </Typography>

        <Typography variant="h5" fontWeight="bold">
          <AnimatedCounter
            end={value}
            duration={1.8}
            prefix={prefix}
            suffix={suffix}
          />
        </Typography>
      </Box>

      {/* Right Icon Section — now animated */}
      {Icon && (
        <motion.div
          animate={{
            scale: [1, 1.15, 1], // gentle pulse
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: "50%",
              backgroundColor: theme.palette.background.default,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon fontSize="large" />
          </Box>
        </motion.div>
      )}
    </Card>
  );
}
