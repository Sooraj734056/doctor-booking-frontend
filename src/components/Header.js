import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Switch, FormControlLabel, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MenuIcon from '@mui/icons-material/Menu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');

  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    toast.success('Logged out successfully');
    navigate('/');
    setDrawerOpen(false);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
    toast.info(`Switched to ${!darkMode ? 'Dark' : 'Light'} Mode`);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = token ? [
    { text: 'Doctors', path: '/doctors' },
    { text: 'My Appointments', path: '/my-appointments' },
    { text: 'Profile', path: '/profile' },
    { text: 'Messages', path: '/messages' },
  ] : [
    { text: 'Login', path: '/login' },
    { text: 'Register', path: '/register' },
  ];

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <LocalHospitalIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Healthcare App
          </Typography>

          {isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={<Switch checked={darkMode} onChange={handleToggleDarkMode} color="default" size="small" />}
                label=""
                sx={{ mr: 1 }}
              />
              <IconButton color="inherit" onClick={toggleDrawer}>
                <MenuIcon />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={<Switch checked={darkMode} onChange={handleToggleDarkMode} color="default" />}
                label=""
                sx={{ mr: 2 }}
              />
              {token ? (
                <>
                  <Button color="inherit" component={Link} to="/doctors" sx={{ mr: 2 }}>
                    Doctors
                  </Button>
                  <Button color="inherit" component={Link} to="/my-appointments" sx={{ mr: 2 }}>
                    My Appointments
                  </Button>
                  <Button color="inherit" component={Link} to="/profile" sx={{ mr: 2 }}>
                    Profile
                  </Button>
                  <Button color="inherit" component={Link} to="/messages" sx={{ mr: 2 }}>
                    Messages
                  </Button>
                  <Typography variant="body1" sx={{ mr: 2 }}>
                    Hi, {userName}
                  </Typography>
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/login" sx={{ mr: 2 }}>
                    Login
                  </Button>
                  <Button color="inherit" component={Link} to="/register">
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            {token && (
              <ListItem>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Hi, {userName}
                </Typography>
              </ListItem>
            )}
            {menuItems.map((item) => (
              <ListItem key={item.path} onClick={() => { navigate(item.path); setDrawerOpen(false); }}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            {token && (
              <ListItem onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Header;
