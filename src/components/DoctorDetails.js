import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Grid,
  Paper,
  Rating,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { fetchDoctorById } from "../api";
import { toast } from "react-toastify";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import MedicalInformationRoundedIcon from "@mui/icons-material/MedicalInformationRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { getFavoriteDoctorIds, toggleDoctorFavorite } from "../utils/favorites";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function DoctorDetails() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState(getFavoriteDoctorIds());

  useEffect(() => {
    const getDoctor = async () => {
      try {
        const { data } = await fetchDoctorById(id);
        setDoctor(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch doctor details");
      } finally {
        setLoading(false);
      }
    };
    getDoctor();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ minHeight: "80vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5, px: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: isDark
          ? "#08111b"
          : "#f8fafc",
      }}
    >
      {/* Hero Header Section */}
      <Box
        sx={{
          pt: { xs: 10, md: 15 },
          pb: { xs: 8, md: 12 },
          color: "white",
          background: isDark
            ? "linear-gradient(135deg, #0b1d2a 0%, #163d45 100%)"
            : "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle decorative background element */}
        <Box
          sx={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(116,214,197,0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Avatar
                src={doctor.image}
                alt={doctor.name}
                sx={{
                  width: { xs: 180, md: 220 },
                  height: { xs: 180, md: 220 },
                  border: "8px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
                  bgcolor: "rgba(255,255,255,0.05)",
                }}
              >
                {doctor.name?.charAt(0)}
              </Avatar>
            </Grid>
            <Grid item xs={12} md={9} textAlign={{ xs: "center", md: "left" }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 1.5 }}>
                  <Chip
                    icon={<VerifiedRoundedIcon sx={{ color: "#74d6c5 !important", fontSize: '1rem' }} />}
                    label="Medical Board Verified"
                    sx={{
                      bgcolor: "rgba(116,214,197,0.12)",
                      color: "#74d6c5",
                      fontWeight: 800,
                      border: "1px solid rgba(116,214,197,0.2)",
                      fontSize: '0.7rem',
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      px: 1
                    }}
                  />
                  <IconButton
                    onClick={() => setFavorites(toggleDoctorFavorite(doctor._id))}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.05)",
                      color: "white",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }
                    }}
                  >
                    {favorites.includes(doctor._id) ? <FavoriteRoundedIcon color="error" /> : <FavoriteBorderRoundedIcon />}
                  </IconButton>
                </Box>
                <Typography variant="h1" sx={{
                  fontSize: { xs: "2.8rem", sm: "3.8rem", md: "4.8rem" },
                  lineHeight: 1,
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                }}>
                  {doctor.name}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 500, color: "rgba(255,255,255,0.7)", maxWidth: 700 }}>
                  Expert in <Box component="span" sx={{ color: "#f2b66c", fontWeight: 700 }}>{doctor.specialization}</Box> providing world-class medical consultation and advanced patient care.
                </Typography>

                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: { xs: 3, sm: 4 },
                    justifyContent: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography sx={{ fontWeight: 900, mb: -0.5, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>{doctor.experience || "12"}</Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", textTransform: "uppercase", fontWeight: 800, letterSpacing: 1, fontSize: { xs: '0.6rem', sm: '0.7rem' } }}>Years Exp.</Typography>
                  </Box>
                  <Box sx={{ borderLeft: { xs: 'none', sm: '1px solid rgba(255,255,255,0.15)' }, pl: { xs: 0, sm: 3 }, textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography sx={{ fontWeight: 900, mb: -0.5, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>{doctor.rating || "4.9"}</Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", textTransform: "uppercase", fontWeight: 800, letterSpacing: 1, fontSize: { xs: '0.6rem', sm: '0.7rem' } }}>Satisfaction</Typography>
                  </Box>
                  <Box sx={{ borderLeft: { xs: 'none', sm: '1px solid rgba(255,255,255,0.15)' }, pl: { xs: 0, sm: 3 }, textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography sx={{ fontWeight: 900, mb: -0.5, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>2k+</Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", textTransform: "uppercase", fontWeight: 800, letterSpacing: 1, fontSize: { xs: '0.6rem', sm: '0.7rem' } }}>Cases</Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={8}>
          <Grid item xs={12} md={7.5}>
            <Stack spacing={8}>
              {/* Profile Section */}
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box component="span" sx={{ width: 40, height: 4, bgcolor: '#74d6c5', borderRadius: 2 }} />
                  Professional Profile
                </Typography>
                <Typography sx={{ 
                  fontSize: "1.15rem", 
                  lineHeight: 2, 
                  color: isDark ? "rgba(255,255,255,0.7)" : "rgba(15,23,42,0.7)",
                  fontWeight: 500
                }}>
                  {doctor.qualifications || "With a focus on patient-centric care, this specialist brings years of expertise in clinical diagnosis and advanced treatment methodologies. Recognized for exceptional medical leadership and a compassionate approach to patient recovery."}
                </Typography>
                
                <Grid container spacing={3} sx={{ mt: 4 }}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 4, borderRadius: 4, border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"}` }}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#74d6c5', color: '#143145' }}>
                          <MedicalInformationRoundedIcon fontSize="small" />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>Clinic Contact</Typography>
                      </Stack>
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>{doctor.email}</Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>{doctor.phone || "+1 555-092-4112"}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 4, borderRadius: 4, border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"}` }}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#f2b66c', color: '#143145' }}>
                          <LocationOnRoundedIcon fontSize="small" />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>Practice Area</Typography>
                      </Stack>
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>{doctor.location || "Central Medical Plaza"}</Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>{doctor.timings || "Mon - Sat • 09:00 AM - 06:00 PM"}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Expert Insights */}
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box component="span" sx={{ width: 40, height: 4, bgcolor: '#f2b66c', borderRadius: 2 }} />
                  Clinical Specialties
                </Typography>
                <Stack spacing={3}>
                  {[
                    { icon: <WorkspacePremiumRoundedIcon color="secondary" />, text: "Board certified in internal medicine and surgery" },
                    { icon: <AccessTimeRoundedIcon color="secondary" />, text: "Pioneer in minimally invasive healthcare procedures" },
                    { icon: <VerifiedRoundedIcon color="secondary" />, text: "Regularly contributes to leading international medical journals" }
                  ].map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                      <Box sx={{ mt: 0.5 }}>{item.icon}</Box>
                      <Typography variant="body1" sx={{ color: "text.secondary", fontSize: '1.1rem', lineHeight: 1.6 }}>{item.text}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Map Section */}
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box component="span" sx={{ width: 40, height: 4, bgcolor: '#74d6c5', borderRadius: 2 }} />
                  Location Overview
                </Typography>
                <Box 
                  sx={{ 
                    height: 400, 
                    width: '100%', 
                    borderRadius: 8, 
                    overflow: 'hidden', 
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"}`,
                    position: 'relative',
                    zIndex: 1,
                    boxShadow: isDark ? "0 20px 50px rgba(0,0,0,0.3)" : "0 20px 50px rgba(15,23,42,0.06)"
                  }}
                >
                  <MapContainer center={[40.7128, -74.0060]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      attribution='&copy; OSM'
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    <Marker position={[40.7128, -74.0060]}>
                      <Popup>
                        <Stack spacing={1}>
                          <Typography variant="body2" fontWeight={800}>{doctor.name}</Typography>
                          <Typography variant="caption">{doctor.location || "Primary Practice Clinic"}</Typography>
                        </Stack>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </Box>
              </Box>
            </Stack>
          </Grid>

          {/* Sticky Sidebar */}
          <Grid item xs={12} md={4.5}>
            <Box sx={{ position: 'sticky', top: 120 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: '24px',
                  bgcolor: isDark ? "#0f172a" : "#ffffff",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"}`,
                  boxShadow: isDark ? "0 40px 80px rgba(0,0,0,0.5)" : "0 40px 80px rgba(15,23,42,0.08)",
                  position: 'relative'
                }}
              >
                {/* Decorative accent */}
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 6, background: "linear-gradient(90deg, #74d6c5, #f2b66c)" }} />
                
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>Reserve Appointment</Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>Check real-time availability and book your slot instantly.</Typography>
                  </Box>

                  <Box sx={{ p: 3, borderRadius: 4, border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"}` }}>
                    <Stack spacing={3}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Consultation Fee</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 900, color: '#74d6c5' }}>$120</Typography>
                      </Stack>
                      <Box sx={{ height: 1, bgcolor: "rgba(255,255,255,0.05)" }} />
                      <Stack direction="row" spacing={2} alignItems="center">
                        <AccessTimeRoundedIcon sx={{ color: '#f2b66c' }} fontSize="small" />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Next available: Today, 04:00 PM</Typography>
                      </Stack>
                    </Stack>
                  </Box>

                  <Stack spacing={2}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate(`/book/${id}`)}
                      sx={{
                        py: 2.2,
                        borderRadius: 4,
                        fontSize: '1rem',
                        fontWeight: 900,
                        background: "linear-gradient(90deg, #74d6c5, #f2b66c)",
                        color: "#143145",
                        boxShadow: "0 10px 30px rgba(116,214,197,0.3)",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 15px 35px rgba(116,214,197,0.4)",
                        }
                      }}
                    >
                      Instant Booking
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate("/doctors")}
                      sx={{
                        py: 2,
                        borderRadius: 4,
                        fontWeight: 700,
                        borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.1)",
                        color: "text.primary",
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.05)",
                          borderColor: "text.primary"
                        }
                      }}
                    >
                      Browse More Doctors
                    </Button>
                  </Stack>

                  <Typography variant="caption" sx={{ textAlign: 'center', color: 'text.secondary', display: 'block' }}>
                    No upfront payment required for basic consultation slots.
                  </Typography>
                </Stack>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default DoctorDetails;
