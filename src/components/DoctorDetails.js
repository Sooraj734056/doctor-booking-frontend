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
  IconButton,
  Grid,
  Paper,
  Rating,
  Stack,
  Typography,
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
        py: { xs: 4, md: 6 },
        background:
          "radial-gradient(circle at top left, rgba(103,232,249,0.18), transparent 30%), linear-gradient(180deg, rgba(247,251,255,1) 0%, rgba(233,243,252,1) 100%)",
      }}
    >
      <Box sx={{ maxWidth: 1100, mx: "auto", px: 2 }}>
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
                "linear-gradient(135deg, rgba(7,18,39,0.96), rgba(13,110,139,0.9))",
            }}
          >
            <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="center">
              <Avatar
                src={doctor.image}
                alt={doctor.name}
                sx={{
                  width: 140,
                  height: 140,
                  border: "4px solid rgba(255,255,255,0.3)",
                  boxShadow: "0 18px 40px rgba(0,0,0,0.2)",
                  bgcolor: "rgba(255,255,255,0.14)",
                }}
              >
                {doctor.name?.charAt(0)}
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Chip
                  icon={<VerifiedRoundedIcon sx={{ color: "#67e8f9 !important" }} />}
                  label="Verified doctor profile"
                  sx={{
                    mb: 1.5,
                    bgcolor: "rgba(255,255,255,0.08)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                />
                <Typography variant="h2" sx={{ fontSize: { xs: "2.2rem", md: "3.4rem" }, lineHeight: 1 }}>
                  {doctor.name}
                </Typography>
                <Typography sx={{ mt: 1, fontSize: "1.1rem", color: "rgba(255,255,255,0.78)" }}>
                  {doctor.specialization}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2, gap: 1 }}>
                  <Chip label={doctor.location || "Top clinic access"} sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "white" }} />
                  <Chip label={doctor.timings || "Flexible timings"} sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "white" }} />
                  <Chip label={doctor.experience ? `${doctor.experience} years experience` : "Experienced care"} sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "white" }} />
                  <IconButton
                    onClick={() => setFavorites(toggleDoctorFavorite(doctor._id))}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.1)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    {favorites.includes(doctor._id) ? <FavoriteRoundedIcon color="error" /> : <FavoriteBorderRoundedIcon />}
                  </IconButton>
                </Stack>
              </Box>
            </Stack>
          </Box>

          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={7}>
                <Stack spacing={2.2}>
                  <Paper sx={{ p: 2.5, borderRadius: 4, bgcolor: "rgba(19,99,223,0.04)" }} elevation={0}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 800 }}>
                      Professional Overview
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.9 }}>
                      {doctor.qualifications || "Professional healthcare provider focused on patient-first care and efficient consultation."}
                    </Typography>
                  </Paper>

                  <Grid container spacing={2}>
                    <Grid xs={12} sm={6}>
                      <Paper sx={{ p: 2.2, borderRadius: 3, height: "100%" }} elevation={0}>
                        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1 }}>
                          <MedicalInformationRoundedIcon color="primary" />
                          <Typography fontWeight={800}>Contact</Typography>
                        </Stack>
                        <Typography color="text.secondary">{doctor.email}</Typography>
                        <Typography color="text.secondary">{doctor.phone || "Phone not available"}</Typography>
                      </Paper>
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <Paper sx={{ p: 2.2, borderRadius: 3, height: "100%" }} elevation={0}>
                        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1 }}>
                          <LocationOnRoundedIcon color="primary" />
                          <Typography fontWeight={800}>Clinic</Typography>
                        </Stack>
                        <Typography color="text.secondary">{doctor.location || "Location not listed"}</Typography>
                        <Typography color="text.secondary">{doctor.timings || "Check availability in booking"}</Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Paper sx={{ p: 2.5, borderRadius: 4, bgcolor: "rgba(19,99,223,0.04)" }} elevation={0}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 800 }}>
                      Why patients choose this doctor
                    </Typography>
                    <Stack spacing={1.2}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <WorkspacePremiumRoundedIcon color="secondary" fontSize="small" />
                        <Typography color="text.secondary">Specialized consultation with clear patient communication</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AccessTimeRoundedIcon color="secondary" fontSize="small" />
                        <Typography color="text.secondary">Smooth appointment scheduling with a clean booking experience</Typography>
                      </Stack>
                    </Stack>
                  </Paper>

                  <Paper sx={{ p: 2, borderRadius: 4, bgcolor: "rgba(19,99,223,0.04)" }} elevation={0}>
                    <Typography variant="h6" sx={{ mb: 2, ml: 1, fontWeight: 800 }}>
                      Clinic Location
                    </Typography>
                    <Box sx={{ height: 260, width: '100%', borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', position: 'relative', zIndex: 1 }}>
                      <MapContainer center={[40.7128, -74.0060]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                          attribution='&copy; OSM'
                          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />
                        <Marker position={[40.7128, -74.0060]}>
                          <Popup>
                            <Typography variant="body2" fontWeight={800}>{doctor.name}</Typography>
                            {doctor.location || "Clinic Location"}
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </Box>
                  </Paper>
                </Stack>
              </Grid>

              <Grid xs={12} md={5}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    bgcolor: "rgba(7,18,39,0.96)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                    Rate this doctor
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.72)", mb: 2 }}>
                    Share your experience and help other patients discover trusted care.
                  </Typography>
                  <Rating
                    name="doctor-rating"
                    value={doctor.rating || 0}
                    onChange={(event, newValue) => {
                      toast.success(`Thank you for rating ${newValue} stars!`);
                    }}
                    size="large"
                    sx={{ mb: 1.5 }}
                  />
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.76)" }}>
                    Average Rating: {doctor.rating || "Not rated yet"}
                  </Typography>

                  <Box sx={{ mt: 3, p: 2.5, borderRadius: 3, bgcolor: "rgba(255,255,255,0.08)" }}>
                    <Typography sx={{ fontWeight: 800, mb: 1 }}>Booking summary</Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.76)", lineHeight: 1.8 }}>
                      Use the booking flow to reserve a slot, then manage the appointment from your dashboard.
                    </Typography>
                  </Box>

                  <Stack spacing={1.2} sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate(`/book/${id}`)}
                      sx={{
                        py: 1.3,
                        background: "linear-gradient(90deg, #67e8f9, #22c55e)",
                        color: "#04111f",
                      }}
                    >
                      Book Appointment
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate("/doctors")}
                      sx={{
                        py: 1.3,
                        borderColor: "rgba(255,255,255,0.28)",
                        color: "white",
                      }}
                    >
                      Back to Doctors
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Paper>
      </Box>
    </Box>
  );
}

export default DoctorDetails;
