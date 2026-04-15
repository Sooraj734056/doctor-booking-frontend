import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import WcRoundedIcon from "@mui/icons-material/WcRounded";
import CakeRoundedIcon from "@mui/icons-material/CakeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(data);
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${API_URL}/api/appointments/my-appointments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Sort to get the most recent or upcoming first
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setUpcomingAppointments(sorted);
      } catch (err) {
        console.error("Failed to fetch dashboard appointments");
      }
    };

    fetchProfile();
    fetchAppointments();
  }, []);

  const completion = useMemo(() => {
    const filled = ["name", "email", "age", "gender", "phone"].filter((key) => profile[key]);
    return Math.round((filled.length / 5) * 100);
  }, [profile]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/api/users/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem("userName", profile.name);
      localStorage.setItem("userEmail", profile.email);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Typography sx={{ mt: 6, textAlign: "center" }}>
        Loading profile...
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 4, md: 6 },
        background:
          "radial-gradient(circle at top right, rgba(103,232,249,0.16), transparent 30%), linear-gradient(180deg, rgba(247,251,255,1) 0%, rgba(233,243,252,1) 100%)",
      }}
    >
      <Container maxWidth="md">
        <Paper
          sx={{
            borderRadius: 5,
            overflow: "hidden",
            border: "1px solid rgba(19,99,223,0.08)",
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              color: "white",
              background:
                "linear-gradient(135deg, rgba(7,18,39,0.96), rgba(13,110,139,0.92))",
              textAlign: "center",
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: "auto",
                mb: 2,
                bgcolor: "rgba(255,255,255,0.14)",
                color: "white",
                fontWeight: 800,
                fontSize: "2rem",
                border: "4px solid rgba(255,255,255,0.18)",
              }}
            >
              {profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
            </Avatar>
            <Typography variant="overline" sx={{ letterSpacing: "0.2em", fontWeight: 800, color: "#67e8f9" }}>
              PATIENT DASHBOARD
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
              {profile.name || "Your profile"}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.78)", mt: 0.5 }}>
              {profile.email}
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}>
              <Paper sx={{ px: 2, py: 1, borderRadius: 999, bgcolor: "rgba(255,255,255,0.1)", color: "white" }} elevation={0}>
                Profile completion {completion}%
              </Paper>
            </Stack>
          </Box>

          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={4}>
                <Paper
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    height: "100%",
                    bgcolor: "rgba(19,99,223,0.04)",
                  }}
                  elevation={0}
                >
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                    Quick details
                  </Typography>
                  <Stack spacing={1.4}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PersonRoundedIcon fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        Name, email, age and phone in one place
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CakeRoundedIcon fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        Better profile data helps make care more personal
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PhoneRoundedIcon fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        Keep your contact details updated for reminders
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>

                <Paper
                  sx={{
                    mt: 3,
                    p: 2.5,
                    borderRadius: 4,
                    bgcolor: "rgba(34, 197, 94, 0.08)",
                  }}
                  elevation={0}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#166534", mb: 2 }}>
                    Next Appointment
                  </Typography>
                  {upcomingAppointments.length > 0 ? (
                    <Box>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ bgcolor: "#22c55e", width: 48, height: 48 }}>
                          <CalendarMonthRoundedIcon />
                        </Avatar>
                        <Box>
                          <Typography fontWeight={800}>{upcomingAppointments[0].doctorName || 'Consultation'}</Typography>
                          <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
                            {new Date(upcomingAppointments[0].date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Stack>
                      <Button 
                        endIcon={<ArrowForwardRoundedIcon />} 
                        onClick={() => navigate('/my-appointments')}
                        sx={{ mt: 2, fontWeight: 700, p: 0, '&:hover': { background: 'transparent', textDecoration: 'underline' } }} 
                        color="success"
                      >
                        Manage appointments
                      </Button>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No upcoming appointments booked. Use the AI assistant or find a doctor to begin.
                    </Typography>
                  )}
                </Paper>
              </Grid>

              <Grid xs={12} md={8}>
                <Paper sx={{ p: { xs: 0, md: 0 }, bgcolor: "transparent" }} elevation={0}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                    Edit profile
                  </Typography>
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid xs={12} sm={6}>
                        <TextField
                          label="Full Name"
                          name="name"
                          value={profile.name}
                          onChange={handleChange}
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <PersonRoundedIcon color="action" sx={{ mr: 1 }} />
                            ),
                          }}
                        />
                      </Grid>
                      <Grid xs={12} sm={6}>
                        <TextField
                          label="Email"
                          name="email"
                          value={profile.email}
                          onChange={handleChange}
                          fullWidth
                          type="email"
                          InputProps={{
                            startAdornment: (
                              <EmailRoundedIcon color="action" sx={{ mr: 1 }} />
                            ),
                          }}
                        />
                      </Grid>
                      <Grid xs={12} sm={6}>
                        <TextField
                          label="Age"
                          name="age"
                          type="number"
                          value={profile.age}
                          onChange={handleChange}
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <CakeRoundedIcon color="action" sx={{ mr: 1 }} />
                            ),
                          }}
                        />
                      </Grid>
                      <Grid xs={12} sm={6}>
                        <TextField
                          select
                          label="Gender"
                          name="gender"
                          value={profile.gender}
                          onChange={handleChange}
                          fullWidth
                          SelectProps={{ native: true }}
                          InputProps={{
                            startAdornment: (
                              <WcRoundedIcon color="action" sx={{ mr: 1 }} />
                            ),
                          }}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </TextField>
                      </Grid>
                      <Grid xs={12}>
                        <TextField
                          label="Phone"
                          name="phone"
                          value={profile.phone}
                          onChange={handleChange}
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <PhoneRoundedIcon color="action" sx={{ mr: 1 }} />
                            ),
                          }}
                        />
                      </Grid>
                      <Grid xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={updating}
                          sx={{
                            mt: 1,
                            width: "100%",
                            py: 1.35,
                            fontWeight: 800,
                            background: "linear-gradient(90deg, #67e8f9, #22c55e)",
                            color: "#04111f",
                          }}
                        >
                          {updating ? "Updating..." : "Update Profile"}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </Grid>
            </Grid>

            {/* Medical Records Vault */}
            <Box sx={{ mt: 5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
                Medical Records Vault
              </Typography>
              <Paper 
                sx={{ 
                  p: { xs: 3, md: 5 }, 
                  borderRadius: 4, 
                  bgcolor: "rgba(19,99,223,0.03)", 
                  border: "2px dashed rgba(19,99,223,0.2)", 
                  textAlign: "center", 
                  cursor: "pointer", 
                  transition: "all 0.2s",
                  "&:hover": { bgcolor: "rgba(19,99,223,0.08)", borderColor: "rgba(19,99,223,0.4)" } 
                }} 
                elevation={0} 
                onClick={() => alert("Enterprise Vault File Sync Initiated (Simulation)")}
              >
                <CloudUploadRoundedIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="h6" fontWeight={700}>Drag & drop health documents</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  Securely store X-rays, MRI scans, and past prescriptions (PDF, JPG, PNG)
                </Typography>
                
                <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ gap: 1 }}>
                   <Chip icon={<InsertDriveFileRoundedIcon />} label="Blood_Report_2024.pdf" color="primary" variant="outlined" />
                   <Chip icon={<InsertDriveFileRoundedIcon />} label="Chest_XRay_Clear.jpg" color="primary" variant="outlined" />
                   <Chip icon={<InsertDriveFileRoundedIcon />} label="Vaccination_Card.pdf" color="primary" variant="outlined" />
                </Stack>
              </Paper>
            </Box>

          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Profile;
