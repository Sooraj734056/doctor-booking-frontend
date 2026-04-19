import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { io } from "socket.io-client";
import { useTranslation } from "react-i18next";

const SOCKET_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const socket = io(SOCKET_URL, { transports: ["websocket"] });

const navItems = [
  { label: "Doctors", to: "/doctors" },
  { label: "Appointments", to: "/my-appointments" },
  { label: "Messages", to: "/messages" },
  { label: "AI Assistant", to: "/ai-assistant", accent: true },
  { label: "Favorites", to: "/favorites" },
  { label: "Profile", to: "/profile" },
];

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2); // Simulated unread alerts
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "hi" : "en");
  };

  const name =
    localStorage.getItem("userName") || localStorage.getItem("userEmail") || "U";
  const userInitial = name.charAt(0).toUpperCase();

  React.useEffect(() => {
    const handleNewTraffic = () => setUnreadCount(prev => prev + 1);
    socket.on('receive_message', handleNewTraffic);
    return () => socket.off('receive_message', handleNewTraffic);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const NavButton = ({ item, mobile = false }) => {
    const active = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
    return (
      <Button
        component={Link}
        to={item.to}
        onClick={() => mobile && setDrawerOpen(false)}
        sx={{
          justifyContent: mobile ? "flex-start" : "center",
          px: mobile ? 0.5 : 1.8,
          py: 1,
          borderRadius: 999,
          color: active ? "#fffaf2" : "rgba(255,250,242,0.82)",
          bgcolor: active
            ? item.accent
              ? "rgba(242,182,108,0.18)"
              : "rgba(255,250,242,0.12)"
            : "transparent",
          border: item.accent ? "1px solid rgba(242,182,108,0.32)" : "1px solid transparent",
          fontWeight: 700,
          letterSpacing: "0.01em",
          "&:hover": {
            bgcolor: item.accent ? "rgba(242,182,108,0.14)" : "rgba(255,250,242,0.1)",
          },
        }}
      >
        {t(item.label)}
      </Button>
    );
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: "100vw",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, rgba(11,27,39,0.96), rgba(18,63,74,0.93) 46%, rgba(32,102,97,0.92))",
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(255,250,242,0.1)",
        boxShadow: "0 18px 42px rgba(6, 17, 27, 0.16)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 64, md: 76 },
          display: "flex",
          justifyContent: "space-between",
          gap: 1.5,
          px: { xs: 1.5, md: 3 },
        }}
      >
        <Stack direction="row" spacing={{ xs: 1, md: 2 }} alignItems="center">
          <Avatar
            sx={{
              bgcolor: "rgba(255,250,242,0.12)",
              color: "#fffaf2",
              width: { xs: 36, md: 44 },
              height: { xs: 36, md: 44 },
              border: "1px solid rgba(255,250,242,0.18)",
            }}
          >
            <LocalHospitalIcon fontSize="small" />
          </Avatar>
          <Box component={Link} to="/" sx={{ color: "#fffaf2", textDecoration: 'none' }}>
            <Typography
              variant="h6"
              sx={{ 
                fontFamily: '"Cormorant Garamond", serif', 
                fontWeight: 800, 
                lineHeight: 1,
                fontSize: { xs: '1.1rem', md: '1.5rem' } 
              }}
            >
              HealthConnect AI
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                opacity: 0.74, 
                fontWeight: 500, 
                letterSpacing: '0.06em', 
                display: { xs: 'none', sm: 'block' } 
              }}
            >
              Care that feels intelligent
            </Typography>
          </Box>
        </Stack>


        <Box sx={{ display: { xs: "none", lg: "flex" }, alignItems: "center", gap: 1 }}>
          <Chip
            label="24/7 bookings"
            sx={{
              color: "#fffaf2",
              bgcolor: "rgba(255,250,242,0.1)",
              border: "1px solid rgba(255,250,242,0.14)",
              mr: 1
            }}
          />
          {token ? (
            <>
              {navItems.map((item) => (
                <NavButton key={item.to} item={item} />
              ))}
              {role === "admin" && <NavButton item={{ label: "Admin", to: "/admin-dashboard", accent: true }} />}
              {role === "doctor" && <NavButton item={{ label: "Doctor Portal", to: "/doctor-dashboard", accent: true }} />}
              <ThemeToggle />
              
              <Button
                onClick={toggleLanguage}
                sx={{
                  ml: 0.5,
                  minWidth: 50,
                  color: "#fffaf2",
                  bgcolor: "rgba(255,250,242,0.08)",
                  border: "1px solid rgba(255,250,242,0.14)",
                  "&:hover": { bgcolor: "rgba(255,250,242,0.16)" },
                  px: 1
                }}
              >
                <TranslateRoundedIcon fontSize="small" sx={{ mr: 0.5 }} />
                {i18n.language === 'en' ? 'EN' : 'HI'}
              </Button>

              <IconButton 
                component={Link} 
                to="/messages"
                sx={{ ml: 1, color: "#fffaf2", bgcolor: "rgba(255,250,242,0.08)", "&:hover": { bgcolor: "rgba(255,250,242,0.14)" } }}
              >
                <Badge badgeContent={unreadCount} color="error" overlap="circular">
                  <NotificationsRoundedIcon />
                </Badge>
              </IconButton>

              <Button
                onClick={handleLogout}
                sx={{
                  ml: 1.5,
                  px: 2,
                  color: "#fffaf2",
                  bgcolor: "rgba(255,250,242,0.12)",
                  border: "1px solid rgba(255,250,242,0.14)",
                  "&:hover": { bgcolor: "rgba(255,250,242,0.18)" },
                }}
              >
                Logout
              </Button>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "rgba(255,250,242,0.16)",
                  color: "#fffaf2",
                  border: "1px solid rgba(255,250,242,0.18)",
                }}
              >
                {userInitial}
              </Avatar>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" sx={{ color: "#fffaf2" }}>
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                sx={{
                  color: "#143145",
                  bgcolor: "#f5d6ab",
                  "&:hover": { bgcolor: "#efc58f" },
                }}
              >
                Register
              </Button>
              <ThemeToggle />
            </>
          )}
        </Box>

        <Box sx={{ display: { xs: "flex", lg: "none" }, alignItems: "center", gap: 0.5 }}>
          <Button 
            onClick={toggleLanguage} 
            sx={{ 
              color: "#fffaf2", 
              minWidth: 36,
              px: 0.5,
              fontSize: '0.85rem'
            }}
          >
            {i18n.language === 'en' ? 'EN' : 'HI'}
          </Button>
          <ThemeToggle />
          <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: "#fffaf2", p: 0.8 }}>
            <MenuIcon />
          </IconButton>
        </Box>

      </Toolbar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: "min(88vw, 360px)",
            background: "linear-gradient(180deg, #0d1f2a 0%, #153640 100%)",
            color: "#fffaf2",
            p: 2,
          },
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Menu
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "#fffaf2" }}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Divider sx={{ borderColor: "rgba(255,250,242,0.12)", mb: 2 }} />

        <Stack spacing={1}>
          {token ? (
            <>
              {navItems.map((item) => (
                <NavButton key={item.to} item={item} mobile />
              ))}
              {role === "admin" && <NavButton item={{ label: "Admin Dashboard", to: "/admin-dashboard", accent: true }} mobile />}
              <Button
                onClick={handleLogout}
                sx={{
                  justifyContent: "flex-start",
                  color: "#fffaf2",
                  bgcolor: "rgba(255,250,242,0.1)",
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavButton item={{ label: "Login", to: "/login" }} mobile />
              <NavButton item={{ label: "Register", to: "/register" }} mobile />
            </>
          )}
        </Stack>
      </Drawer>
    </AppBar>
  );
}

export default Header;
