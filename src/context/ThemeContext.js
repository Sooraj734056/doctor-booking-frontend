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
    const pageBackground =
      mode === "light"
        ? "radial-gradient(circle at top, #f3fbf8 0%, #eef4ff 44%, #f7f4ec 100%)"
        : "radial-gradient(circle at top, #132437 0%, #0d1726 48%, #08111b 100%)";

    localStorage.setItem("theme-mode", mode);
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.background = pageBackground;
    document.documentElement.style.transition = "background 220ms ease, color 220ms ease";
    document.body.style.background = pageBackground;
    document.body.style.color = mode === "light" ? "#18364a" : "#eff8ff";
    document.body.style.transition = "background 220ms ease, color 220ms ease";
  }, [mode]);

  const theme = useMemo(
    () => {
      const isLight = mode === "light";

      return createTheme({
        palette: {
          mode,
          primary: {
            main: isLight ? "#0f766e" : "#74d6c5",
            light: isLight ? "#43b6ab" : "#a6eadf",
            dark: isLight ? "#0a4f4a" : "#4eb3a0",
          },
          secondary: {
            main: isLight ? "#dc8b45" : "#f2b66c",
            light: isLight ? "#f4b97c" : "#f8cf99",
            dark: isLight ? "#9f5f22" : "#d89342",
          },
          success: {
            main: isLight ? "#27976d" : "#5bd0a2",
          },
          background: {
            default: isLight ? "#f4f8f5" : "#08111b",
            paper: isLight ? "rgba(255,250,244,0.84)" : "rgba(14,24,37,0.84)",
          },
          text: {
            primary: isLight ? "#18364a" : "#eff8ff",
            secondary: isLight ? "#5f7888" : "#adc4d6",
          },
          divider: isLight ? "rgba(24,54,74,0.1)" : "rgba(173,196,214,0.16)",
          info: {
            main: isLight ? "#4b84b6" : "#7cb8de",
          },
        },
        shape: {
          borderRadius: 22,
        },
        typography: {
          fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif',
          h1: { fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 700 },
          h2: { fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 700 },
          h3: { fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 700 },
          h4: { fontWeight: 800, letterSpacing: "-0.03em" },
          h5: { fontWeight: 700, letterSpacing: "-0.02em" },
          h6: { fontWeight: 700 },
          body1: {
            fontSize: "1rem",
            lineHeight: 1.75,
          },
          body2: {
            lineHeight: 1.7,
          },
          button: {
            textTransform: "none",
            fontWeight: 800,
            letterSpacing: "0.01em",
          },
        },
        shadows: [
          "none",
          "0 12px 30px rgba(20, 49, 69, 0.08)",
          "0 18px 40px rgba(20, 49, 69, 0.1)",
          "0 22px 48px rgba(20, 49, 69, 0.12)",
          "0 28px 58px rgba(20, 49, 69, 0.14)",
          ...Array(20).fill(
            isLight ? "0 28px 60px rgba(20, 49, 69, 0.14)" : "0 30px 70px rgba(0, 0, 0, 0.34)"
          ),
        ],
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              ":root": {
                colorScheme: mode,
              },
              body: {
                margin: 0,
                WebkitFontSmoothing: "antialiased",
                MozOsxFontSmoothing: "grayscale",
                backgroundAttachment: "fixed",
                backgroundRepeat: "no-repeat",
                transition: "background 220ms ease, color 220ms ease",
              },
              "a": {
                color: "inherit",
              },
              "*::-webkit-scrollbar": {
                width: 10,
                height: 10,
              },
              "*::-webkit-scrollbar-thumb": {
                borderRadius: 999,
                background:
                  isLight
                    ? "linear-gradient(180deg, rgba(15,118,110,0.45), rgba(220,139,69,0.35))"
                    : "linear-gradient(180deg, rgba(116,214,197,0.55), rgba(242,182,108,0.42))",
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
                border: `1px solid ${isLight ? "rgba(24,54,74,0.08)" : "rgba(173,196,214,0.12)"}`,
                boxShadow: isLight
                  ? "0 24px 60px rgba(20,49,69,0.10)"
                  : "0 28px 70px rgba(0,0,0,0.32)",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 999,
                paddingInline: 18,
                boxShadow: "none",
              },
              contained: {
                boxShadow: isLight
                  ? "0 14px 32px rgba(15,118,110,0.22)"
                  : "0 16px 36px rgba(116,214,197,0.18)",
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 999,
                fontWeight: 700,
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              variant: "outlined",
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: 18,
                backgroundColor: isLight ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.04)",
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 28,
              },
            },
          },
        },
      });
    },
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
