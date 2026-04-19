import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDoctors } from "../api";
import {
  Box,
  Chip,
  Container,
  Grid,
  InputAdornment,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { getFavoriteDoctorIds, toggleDoctorFavorite } from "../utils/favorites";
import DoctorCard from "./DoctorCard";


const specialties = [
  "All",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Pediatrics",
  "General Medicine",
  "Orthopedics",
  "Gynecology",
  "Ophthalmology",
  "ENT",
  "Psychiatry",
];

function DoctorList() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const [favorites, setFavorites] = useState(getFavoriteDoctorIds());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const res = await fetchDoctors();
        setDoctors(res.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchName = doc.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSpecialty =
        specialtyFilter === "All" || doc.specialization === specialtyFilter;
      return matchName && matchSpecialty;
    });
  }, [doctors, searchTerm, specialtyFilter]);

  const stats = useMemo(() => {
    return {
      total: doctors.length,
      visible: filteredDoctors.length,
      specialties: new Set(doctors.map((doc) => doc.specialization).filter(Boolean)).size,
    };
  }, [doctors, filteredDoctors]);

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
            ? "radial-gradient(circle at top left, rgba(116,214,197,0.12), transparent 30%), radial-gradient(circle at top right, rgba(242,182,108,0.08), transparent 28%), linear-gradient(180deg, #08111b 0%, #0d1726 100%)"
            : "radial-gradient(circle at top left, rgba(116,214,197,0.18), transparent 30%), radial-gradient(circle at top right, rgba(242,182,108,0.12), transparent 28%), linear-gradient(180deg, #f3fbf8 0%, #eef4ff 100%)",
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        <Paper
          sx={{
            p: { xs: 2, sm: 3, md: 6 },
            borderRadius: { xs: "20px", md: "32px" },
            mb: 4,
            color: "white",
            position: "relative",
            overflow: "hidden",
            background: isDark
              ? "linear-gradient(135deg, #0b1d2a 0%, #163d45 100%)"
              : "linear-gradient(135deg, #102330 0%, #1b4e59 100%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: isDark ? "0 20px 50px rgba(0,0,0,0.28)" : "0 20px 50px rgba(0,0,0,0.15)",
          }}
        >
          {/* Subtle abstract background element */}
          <Box
            sx={{
              position: "absolute",
              top: "-20%",
              right: "-10%",
              width: "400px",
              height: "400px",
              background: "radial-gradient(circle, rgba(116,214,197,0.18) 0%, transparent 70%)",
              zIndex: 0,
              display: { xs: 'none', md: 'block' }
            }}
          />

          <Grid container spacing={3} alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
            <Grid item xs={12} md={8}>
              <Typography
                variant="overline"
                sx={{ 
                  letterSpacing: "0.3em", 
                  color: "#a6eadf", 
                  fontWeight: 800,
                  mb: 1,
                  display: "block",
                  fontSize: { xs: '0.65rem', md: '0.75rem' }
                }}
              >
                PREMIUM CARE
              </Typography>
              <Typography
                variant="h2"
                sx={{ 
                  fontSize: { xs: "1.8rem", sm: "2.5rem", md: "4rem" }, 
                  lineHeight: { xs: 1.2, md: 1.1 }, 
                  fontWeight: 900,
                  mb: 2,
                  background: "linear-gradient(to right, #fffaf2, rgba(173,196,214,0.8))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  wordBreak: "break-word"
                }}
              >
                Find your perfect healthcare match.
              </Typography>

              <Typography sx={{ maxWidth: 600, color: "rgba(255,255,255,0.72)", lineHeight: 1.8, fontSize: "1.1rem" }}>
                Connect with world-class specialists through our advanced directory. Premium care is just one click away.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                <Box sx={{ p: 2.5, borderRadius: "20px", bgcolor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: "#fff" }}>{stats.total}</Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.56)", fontWeight: 600, textTransform: "uppercase" }}>Active Doctors</Typography>
                </Box>
                <Box sx={{ p: 2.5, borderRadius: "20px", bgcolor: "rgba(242,182,108,0.12)", border: "1px solid rgba(242,182,108,0.18)" }}>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: "#f2b66c" }}>{stats.specialties}</Typography>
                  <Typography variant="body2" sx={{ color: "rgba(242,182,108,0.72)", fontWeight: 600, textTransform: "uppercase" }}>Specialties</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid xs={12} md={5}>

              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: "text.primary", ml: 1 }}>
                Search by Specialist Name
              </Typography>
              <TextField
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ex. Dr. Sarah Johnson..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#2563eb' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: "16px",
                    bgcolor: isDark ? "rgba(14,24,37,0.86)" : "#fff",
                    boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.22)" : "0 4px 20px rgba(0,0,0,0.03)",
                    border: "none",
                    "& fieldset": { border: `1px solid ${isDark ? "rgba(173,196,214,0.12)" : "rgba(0,0,0,0.05)"}` },
                    "&:hover fieldset": { borderColor: `${theme.palette.primary.main} !important` },
                  }
                }}
              />
            </Grid>
            <Grid xs={12} md={7}>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: "text.primary", ml: 1 }}>

                Filter by Expertise
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {specialties.map((specialty) => (
                  <Chip
                    key={specialty}
                    label={specialty}
                    clickable
                    onClick={() => setSpecialtyFilter(specialty)}
                    sx={{ 
                      borderRadius: "12px",
                      px: 1,
                      fontWeight: 700,
                      py: 2,
                      transition: "all 0.2s",
                      bgcolor: specialtyFilter === specialty ? theme.palette.primary.main : (isDark ? "rgba(14,24,37,0.86)" : "#fff"),
                      color: specialtyFilter === specialty ? (isDark ? "#08111b" : "#fffaf2") : "text.secondary",
                      border: "1px solid",
                      borderColor: specialtyFilter === specialty ? theme.palette.primary.main : (isDark ? "rgba(173,196,214,0.12)" : "rgba(0,0,0,0.05)"),
                      boxShadow: specialtyFilter === specialty ? "0 8px 15px rgba(15,118,110,0.22)" : "none",
                      "&:hover": {
                        bgcolor: specialtyFilter === specialty ? theme.palette.primary.dark : (isDark ? "rgba(173,196,214,0.08)" : "rgba(15,118,110,0.05)"),
                        transform: "translateY(-2px)"
                      }
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>


        {loading ? (
          <Grid container spacing={2}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Grid xs={12} sm={6} md={4} key={index}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    borderRadius: "24px",
                    bgcolor: isDark ? "rgba(14,24,37,0.72)" : "rgba(255, 255, 255, 0.55)",
                    border: `1px solid ${isDark ? "rgba(173,196,214,0.12)" : "rgba(255, 255, 255, 0.4)"}`,
                  }} 
                  elevation={0}
                >
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Skeleton variant="circular" width={54} height={54} animation="wave" />
                    <Box sx={{ width: '100%' }}>
                      <Skeleton variant="text" width="75%" height={28} animation="wave" />
                      <Skeleton variant="text" width="45%" height={20} animation="wave" />
                    </Box>
                  </Stack>
                  <Skeleton variant="rectangular" height={80} sx={{ my: 2, borderRadius: 3 }} animation="wave" />
                  <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                    <Skeleton variant="rounded" height={40} width="50%" sx={{ borderRadius: "12px" }} animation="wave" />
                    <Skeleton variant="rounded" height={40} width="50%" sx={{ borderRadius: "12px" }} animation="wave" />
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={2.5}>
            {filteredDoctors.map((doc) => (
              <DoctorCard
                key={doc._id}
                doc={doc}
                isFavorite={favorites.includes(doc._id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </Grid>
        )}


        {filteredDoctors.length === 0 && (
          <Paper
            sx={{
              mt: 4,
              p: 5,
              textAlign: "center",
              borderRadius: 4,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 800 }}>
              No doctors match your filters
            </Typography>
            <Typography color="text.secondary">
              Try a different name or switch the specialty chip back to All.
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
}

export default DoctorList;
