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
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import KeyIcon from "@mui/icons-material/Key";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    try {
      const { data } = await API.post("/auth/register", {
        name,
        email,
        password,
      });
      setMessage("OTP sent! Check console preview URL.");
      console.log("OTP Preview URL:", data.previewUrl);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/verify-otp", { email, otp });
      setMessage(data.message);
      navigate("/doctors");
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
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
          maxWidth: 440,
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
          Create Account
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 3 }}
        >
          Register to get started
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

        {step === 1 && (
          <Box
            component="form"
            onSubmit={handleRegister}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            <TextField
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Email"
              type="email"
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
            <TextField
              label="Confirm Password"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                      onClick={() => setShowConfirm(!showConfirm)}
                      edge="end"
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
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
              Register
            </Button>
          </Box>
        )}

        {step === 2 && (
          <Box
            component="form"
            onSubmit={handleVerifyOtp}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            <TextField
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon color="primary" />
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
              Verify OTP
            </Button>
          </Box>
        )}

        <Typography
          textAlign="center"
          sx={{
            mt: 3,
            fontSize: "0.95rem",
            color: "text.secondary",
          }}
        >
          Already have an account?{" "}
          <Button
            onClick={() => navigate("/login")}
            sx={{
              textTransform: "none",
              color: "#1976d2",
              fontWeight: "bold",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Login
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Register;
