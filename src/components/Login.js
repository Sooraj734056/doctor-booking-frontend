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
  useTheme,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { loginUser } from "../api";

function Login() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔑 Handle Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await loginUser({
        email,
        password,
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        if (res.data?.user?.role) {
          localStorage.setItem("userRole", res.data.user.role);
        }
        if (res.data?.user?.name) {
          localStorage.setItem("userName", res.data.user.name);
        }
        if (res.data?.user?.email) {
          localStorage.setItem("userEmail", res.data.user.email);
        }
        setMessage(res.data.message || "✅ Login successful!");
        console.log("✅ Logged in successfully:", res.data);
        navigate(res.data?.user?.role === "admin" ? "/admin-dashboard" : "/doctors");
      } else {
        setError("Invalid server response. Please try again.");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: isDark
          ? "radial-gradient(circle at top, rgba(116,214,197,0.14), transparent 30%), linear-gradient(135deg, #08111b, #132437)"
          : "radial-gradient(circle at top, rgba(116,214,197,0.18), transparent 30%), linear-gradient(135deg, #eef4ff, #f3fbf8)",
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
          background: isDark ? "rgba(14,24,37,0.88)" : "rgba(255,250,244,0.9)",
          color: "text.primary",
          boxShadow: isDark
            ? "0px 18px 40px rgba(0, 0, 0, 0.34)"
            : "0px 8px 25px rgba(0, 0, 0, 0.12)",
          border: `1px solid ${isDark ? "rgba(173,196,214,0.12)" : "rgba(24,54,74,0.08)"}`,
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            mb: 2,
            fontWeight: "bold",
            background: "linear-gradient(90deg, #74d6c5, #f2b66c)",
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
          Please login to continue
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
          sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
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
            disabled={loading}
            sx={{
              mt: 1,
              py: 1.2,
              background: "linear-gradient(90deg, #74d6c5, #f2b66c)",
              color: "#143145",
              fontWeight: "bold",
              borderRadius: 3,
              textTransform: "none",
              fontSize: "1rem",
              transition: "0.3s",
              "&:hover": {
                background: "linear-gradient(90deg, #61c8b7, #e7a85e)",
                transform: "translateY(-2px)",
              },
            }}
          >
            {loading ? "Logging in..." : "Login"}
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
              color: "primary.main",
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
