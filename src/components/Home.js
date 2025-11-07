import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  Avatar,
  Chip,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  LocalHospital as LocalHospitalIcon,
  CalendarToday as CalendarTodayIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  Star as StarIcon,
  Verified as VerifiedIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <LocalHospitalIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      title: "Find Doctors",
      description: "Browse highly qualified doctors across specialties.",
      highlight: "500+ Doctors Available",
    },
    {
      icon: <CalendarTodayIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      title: "Book Appointments",
      description: "Schedule visits with flexible timing options.",
      highlight: "24/7 Booking",
    },
    {
      icon: <MessageIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      title: "Secure Messaging",
      description: "Chat safely with doctors and get instant updates.",
      highlight: "HIPAA Compliant",
    },
    {
      icon: <PersonIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      title: "Manage Profile",
      description: "Update your health info & manage appointments.",
      highlight: "Easy Dashboard",
    },
  ];

  const stats = [
    { icon: <PeopleIcon />, value: "10,000+", label: "Happy Patients" },
    { icon: <VerifiedIcon />, value: "500+", label: "Verified Doctors" },
    { icon: <AccessTimeIcon />, value: "24/7", label: "Support Available" },
    { icon: <TrendingUpIcon />, value: "98%", label: "Satisfaction Rate" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      content:
        "This platform made finding the right doctor so easy. The booking process was seamless!",
      rating: 5,
      avatar: "SJ",
    },
    {
      name: "Dr. Michael Chen",
      role: "Cardiologist",
      content:
        "Great platform for connecting with patients. The messaging system is secure and efficient.",
      rating: 5,
      avatar: "MC",
    },
    {
      name: "Emma Davis",
      role: "Patient",
      content:
        "Outstanding service! The doctors are professional and the app is user-friendly.",
      rating: 5,
      avatar: "ED",
    },
  ];

  return (
    <Box sx={{ bgcolor: "#f7f9fc", overflow: "hidden" }}>
      {/* 🌟 HERO SECTION */}
      <Box
        sx={{
          minHeight: { xs: "70vh", md: "90vh" },
          background:
            "linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #90caf9 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2, md: 3 },
          py: { xs: 8, md: 0 },
          textAlign: "center",
          position: "relative",
          boxShadow: "0 0 60px rgba(0,0,0,0.2)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(https://images.unsplash.com/photo-1588776814546-6b8b7d22b9f6?auto=format&fit=crop&w=1950&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.2,
            zIndex: 0,
            filter: "blur(1px)",
          }}
        />
        <Container sx={{ position: "relative", zIndex: 2, maxWidth: "lg" }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3.8rem" },
              letterSpacing: "0.5px",
            }}
          >
            Your Health, Our Priority
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 5,
              opacity: 0.95,
              maxWidth: "700px",
              mx: "auto",
              lineHeight: 1.7,
              fontSize: { xs: "0.9rem", md: "1.2rem" },
            }}
          >
            Connect with trusted healthcare professionals and manage your
            medical needs seamlessly through our platform.
          </Typography>

          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, justifyContent: "center", alignItems: "center" }}>
            <Button
              variant="contained"
              onClick={() => navigate("/register")}
              sx={{
                background:
                  "linear-gradient(45deg, #ffca28, #ffd54f, #ffb300)",
                color: "#000",
                fontWeight: "bold",
                px: { xs: 3, md: 5 },
                py: 1.5,
                borderRadius: 3,
                fontSize: { xs: "1rem", md: "1.1rem" },
                width: { xs: "100%", sm: "auto" },
                "&:hover": {
                  background: "linear-gradient(45deg, #ffc107, #ffca28)",
                  transform: "translateY(-3px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{
                borderColor: "white",
                color: "white",
                px: { xs: 3, md: 5 },
                py: 1.5,
                borderRadius: 3,
                fontSize: { xs: "1rem", md: "1.1rem" },
                width: { xs: "100%", sm: "auto" },
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderColor: "#fff",
                },
              }}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* 💡 FEATURES SECTION */}
      <Container sx={{ py: 10 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{ fontWeight: "bold", color: "#1976d2", mb: 2 }}
        >
          Why Choose Us?
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 8, maxWidth: 650, mx: "auto" }}
        >
          Experience modern, seamless healthcare with trusted professionals and
          user-friendly tools.
        </Typography>

        <Grid container spacing={4}>
          {features.map((f, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  textAlign: "center",
                  p: 4,
                  borderRadius: 4,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.35s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    bgcolor: "#e3f2fd",
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  {f.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  {f.title}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {f.description}
                </Typography>
                <Chip
                  label={f.highlight}
                  color="primary"
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                  }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 📊 STATS */}
      <Box sx={{ bgcolor: "#e3f2fd", py: 8 }}>
        <Container>
          <Grid container spacing={4} justifyContent="center">
            {stats.map((s, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                <Box textAlign="center">
                  <Box sx={{ fontSize: 48, color: "#1976d2", mb: 1 }}>
                    {s.icon}
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#1976d2" }}
                  >
                    {s.value}
                  </Typography>
                  <Typography color="text.secondary">{s.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 💬 TESTIMONIALS */}
      <Container sx={{ py: 10 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{ fontWeight: "bold", color: "#1976d2", mb: 2 }}
        >
          What Our Users Say
        </Typography>
        <Typography
          align="center"
          color="text.secondary"
          sx={{ mb: 8, maxWidth: 650, mx: "auto" }}
        >
          Hear from real patients and doctors who trust our platform.
        </Typography>

        <Grid container spacing={4}>
          {testimonials.map((t, i) => (
            <Grid key={i} size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: 4,
                  boxShadow: "0 4px 18px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    sx={{
                      bgcolor: "#1976d2",
                      mr: 2,
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    {t.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {t.name}
                    </Typography>
                    <Typography color="text.secondary">{t.role}</Typography>
                  </Box>
                </Box>
                <Box mb={2}>
                  {[...Array(t.rating)].map((_, i) => (
                    <StarIcon key={i} sx={{ color: "#ffc107" }} />
                  ))}
                </Box>
                <Typography color="text.secondary" fontStyle="italic">
                  "{t.content}"
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 🚀 CTA */}
      {!localStorage.getItem("userInfo") && (
        <Box sx={{ backgroundColor: "#bbdefb", py: 8 }}>
          <Container maxWidth="md">
            <Paper
              sx={{
                p: { xs: 3, md: 6 },
                textAlign: "center",
                borderRadius: 4,
                boxShadow: 6,
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "#1976d2", mb: 2 }}
              >
                Ready to Take Control of Your Health?
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4 }}>
                Join thousands of patients who trust our platform for reliable
                and secure healthcare.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/register")}
                sx={{
                  px: 6,
                  py: 1.5,
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  backgroundColor: "#1976d2",
                  "&:hover": { backgroundColor: "#1565c0" },
                }}
              >
                Create Account
              </Button>
            </Paper>
          </Container>
        </Box>
      )}

      {/* ⚫ FOOTER */}
      <Box
        sx={{
          bgcolor: "#1e1e2f",
          color: "white",
          textAlign: "center",
          py: 4,
          mt: 6,
        }}
      >
        <Typography variant="body1">
          © 2025 HealthCare App. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
