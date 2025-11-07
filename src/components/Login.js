import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import API from "../api";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      setMessage(data.message);
      setError("");
      navigate("/doctors");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setMessage("");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1976d2, #42a5f5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          p: 4,
          backdropFilter: "blur(12px)",
          background: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            mb: 2,
            fontWeight: "bold",
            background: "linear-gradient(90deg, #1976d2, #42a5f5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome Back
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 3 }}
        >
          Login to continue to your account
        </Typography>

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          <TextField
            label="Email Address"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              mt: 1,
              py: 1.2,
              background: "linear-gradient(90deg, #1976d2, #42a5f5)",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: 3,
              textTransform: "none",
              fontSize: "1rem",
              transition: "0.3s",
              "&:hover": {
                background: "linear-gradient(90deg, #1565c0, #1e88e5)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Login
          </Button>
        </Box>

        <Typography
          textAlign="center"
          sx={{
            mt: 3,
            fontSize: "0.95rem",
            color: "text.secondary",
          }}
        >
          Don’t have an account?{" "}
          <Button
            onClick={() => navigate("/register")}
            sx={{
              textTransform: "none",
              color: "#1976d2",
              fontWeight: "bold",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Register
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;
