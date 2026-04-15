import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const ThemeContext = createContext();

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("theme-mode") || "light";
  });

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    localStorage.setItem("theme-mode", mode);
    document.documentElement.dataset.theme = mode;
    document.body.style.background =
      mode === "light"
        ? "linear-gradient(180deg, #f7fbff 0%, #eef5fb 100%)"
        : "linear-gradient(180deg, #09111f 0%, #111a2e 100%)";
    document.body.style.color = mode === "light" ? "#10243f" : "#ecf5ff";
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "light" ? "#1363df" : "#67e8f9",
          },
          secondary: {
            main: mode === "light" ? "#0f766e" : "#34d399",
          },
          background: {
            default: mode === "light" ? "#f7fbff" : "#09111f",
            paper: mode === "light" ? "rgba(255,255,255,0.9)" : "rgba(9,17,31,0.88)",
          },
          text: {
            primary: mode === "light" ? "#10243f" : "#ecf5ff",
            secondary: mode === "light" ? "#55708f" : "#b6c9e4",
          },
        },
        shape: {
          borderRadius: 18,
        },
        typography: {
          fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif',
          h1: { fontFamily: '"Cormorant Garamond", serif', fontWeight: 700 },
          h2: { fontFamily: '"Cormorant Garamond", serif', fontWeight: 700 },
          h3: { fontFamily: '"Cormorant Garamond", serif', fontWeight: 700 },
          h4: { fontWeight: 800, letterSpacing: "-0.02em" },
          h5: { fontWeight: 700 },
          h6: { fontWeight: 700 },
          button: {
            textTransform: "none",
            fontWeight: 700,
          },
        },
        shadows: [
          "none",
          "0 10px 24px rgba(15, 23, 42, 0.06)",
          "0 14px 30px rgba(15, 23, 42, 0.08)",
          "0 18px 42px rgba(15, 23, 42, 0.1)",
          "0 22px 48px rgba(15, 23, 42, 0.12)",
          ...Array(20).fill("0 20px 45px rgba(15, 23, 42, 0.12)"),
        ],
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                margin: 0,
                WebkitFontSmoothing: "antialiased",
                MozOsxFontSmoothing: "grayscale",
                backgroundAttachment: "fixed",
                backgroundRepeat: "no-repeat",
              },
              "*::-webkit-scrollbar": {
                width: 10,
                height: 10,
              },
              "*::-webkit-scrollbar-thumb": {
                borderRadius: 999,
                background:
                  mode === "light"
                    ? "linear-gradient(180deg, rgba(19,99,223,0.5), rgba(15,118,110,0.45))"
                    : "linear-gradient(180deg, rgba(103,232,249,0.55), rgba(52,211,153,0.45))",
              },
              "*::-webkit-scrollbar-track": {
                background: "transparent",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backdropFilter: "blur(16px)",
                backgroundImage: "none",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 14,
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              variant: "outlined",
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
