import React from "react";
import { IconButton, Tooltip, useTheme } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useThemeContext } from "../context/ThemeContext";

function ThemeToggle() {
  const { mode, toggleTheme } = useThemeContext();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Tooltip title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          color: isDark ? "#eff8ff" : "#fffaf2",
          bgcolor: isDark ? "rgba(173,196,214,0.08)" : "rgba(255,250,242,0.12)",
          border: `1px solid ${isDark ? "rgba(173,196,214,0.16)" : "rgba(255,250,242,0.14)"}`,
          backdropFilter: "blur(12px)",
          "&:hover": {
            bgcolor: isDark ? "rgba(173,196,214,0.14)" : "rgba(255,250,242,0.2)",
          },
        }}
      >
        {mode === "light" ? <DarkMode /> : <LightMode />}
      </IconButton>
    </Tooltip>
  );
}

export default ThemeToggle;
