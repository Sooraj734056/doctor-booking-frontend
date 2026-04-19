import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { fetchDoctors } from "../api";
import { getFavoriteDoctorIds, toggleDoctorFavorite } from "../utils/favorites";

function Favorites() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [doctors, setDoctors] = useState([]);
  const [favorites, setFavorites] = useState(getFavoriteDoctorIds());
  const navigate = useNavigate();

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const res = await fetchDoctors();
        setDoctors(res.data);
      } catch (err) {
        console.error("Error loading doctors for favorites:", err);
      }
    };
    loadDoctors();
  }, []);

  const favoriteDoctors = useMemo(
    () => doctors.filter((doctor) => favorites.includes(doctor._id)),
    [doctors, favorites]
  );

  const handleToggleFavorite = (doctorId) => {
    setFavorites(toggleDoctorFavorite(doctorId));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 4, md: 6 },
        background:
          isDark
            ? "radial-gradient(circle at top right, rgba(242,182,108,0.10), transparent 24%), linear-gradient(180deg, #08111b 0%, #0d1726 100%)"
            : "radial-gradient(circle at top right, rgba(242,182,108,0.14), transparent 24%), linear-gradient(180deg, #f3fbf8 0%, #eef4ff 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            borderRadius: 5,
            color: "white",
            background:
              isDark
                ? "linear-gradient(135deg, rgba(11,29,42,0.96), rgba(86,44,53,0.92))"
                : "linear-gradient(135deg, rgba(10,24,36,0.96), rgba(127,63,54,0.9))",
          }}
        >
          <Typography variant="overline" sx={{ letterSpacing: "0.24em", color: "rgba(255,255,255,0.72)" }}>
            Saved care list
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: "2.2rem", md: "3.4rem" }, lineHeight: 1, mt: 1 }}>
            Your favorite doctors.
          </Typography>
          <Typography sx={{ mt: 1.5, color: "rgba(255,255,255,0.78)", maxWidth: 760, lineHeight: 1.8 }}>
            Keep a shortlist of doctors you trust and jump back to them faster next time.
          </Typography>
        </Paper>

        {favoriteDoctors.length === 0 ? (
          <Paper sx={{ p: 5, textAlign: "center", borderRadius: 4 }} elevation={0}>
            <FavoriteBorderRoundedIcon sx={{ fontSize: 64, color: "primary.main", mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              No favorites yet
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Open doctor cards and tap the heart icon to save someone here.
            </Typography>
            <Button variant="contained" onClick={() => navigate("/doctors")}>
              Explore doctors
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {favoriteDoctors.map((doctor) => (
              <Grid xs={12} sm={6} md={4} key={doctor._id}>
                <Card
                  sx={{
                    borderRadius: 4,
                    bgcolor: "background.paper",
                    border: "1px solid rgba(19,99,223,0.08)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                      <Avatar src={doctor.image} sx={{ bgcolor: "primary.main" }}>
                        {doctor.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          {doctor.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {doctor.specialization}
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                      <Chip label={doctor.location || "Location"} size="small" />
                      <Chip label={doctor.timings || "Flexible timings"} size="small" />
                    </Stack>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0, display: "flex", gap: 1 }}>
                    <Button fullWidth variant="outlined" onClick={() => navigate(`/doctor/${doctor._id}`)}>
                      View
                    </Button>
                    <Button fullWidth variant="contained" onClick={() => navigate(`/book/${doctor._id}`)}>
                      Book
                    </Button>
                  </CardActions>
                  <Box sx={{ px: 3, pb: 3 }}>
                    <Button
                      fullWidth
                      variant="text"
                      startIcon={<FavoriteRoundedIcon />}
                      onClick={() => handleToggleFavorite(doctor._id)}
                    >
                      Remove from favorites
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default Favorites;
