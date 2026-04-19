import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { useNavigate } from "react-router-dom";

const DoctorCard = ({ doc, isFavorite, onToggleFavorite }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Card
        sx={{
          height: "100%",
          borderRadius: "24px",
          overflow: "hidden",
          backdropFilter: "blur(20px) saturate(180%)",
          backgroundColor: isDark ? "rgba(14,24,37,0.78)" : "rgba(255, 255, 255, 0.7)",
          border: `1px solid ${isDark ? "rgba(173,196,214,0.12)" : "rgba(255, 255, 255, 0.4)"}`,
          boxShadow: isDark ? "0 18px 40px rgba(0,0,0,0.26)" : "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          "&:hover": {
            transform: "translateY(-8px) scale(1.01)",
            boxShadow: isDark ? "0 22px 45px rgba(0,0,0,0.32)" : "0 22px 45px rgba(0,0,0,0.1)",
            backgroundColor: isDark ? "rgba(14,24,37,0.9)" : "rgba(255, 255, 255, 0.85)",
            "& .card-header-gradient": {
              opacity: 1,
            }
          },
        }}
      >
        <Box
          className="card-header-gradient"
          sx={{
            p: { xs: 2, md: 3 },
            background: isDark
              ? "linear-gradient(135deg, rgba(116,214,197,0.10) 0%, rgba(242,182,108,0.06) 100%)"
              : "linear-gradient(135deg, rgba(15,118,110,0.08) 0%, rgba(220,139,69,0.05) 100%)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            borderBottom: `1px solid ${isDark ? "rgba(173,196,214,0.08)" : "rgba(0,0,0,0.03)"}`,
            transition: "opacity 0.4s ease",
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: -2,
                  borderRadius: '50%',
                  border: `2px solid ${theme.palette.primary.main}`,
                  opacity: 0.3,
                }
              }}
            >
              <Avatar
                src={doc.image}
                alt={doc.name}
                sx={{
                  width: { xs: 54, md: 68 },
                  height: { xs: 54, md: 68 },
                  bgcolor: "primary.main",
                  border: `2px solid ${isDark ? "#0d1726" : "#fff"}`,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                {doc.name?.charAt(0)}
              </Avatar>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1.2, mb: 0.5, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                {doc.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                {doc.specialization}
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5, 
              background: isDark ? "rgba(8,17,27,0.86)" : "#fff", 
              px: 1, 
              py: 0.4, 
              borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <StarRoundedIcon sx={{ color: "#f59e0b", fontSize: '1rem' }} />
              <Typography variant="body2" sx={{ fontWeight: 800, color: "text.primary", fontSize: '0.8rem' }}>
                {doc.rating || "4.8"}
              </Typography>
            </Box>
          </Box>
        </Box>

        <CardContent sx={{ p: { xs: 2.5, md: 4 }, flexGrow: 1 }}>
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Box sx={{ p: 0.7, borderRadius: '8px', bgcolor: isDark ? 'rgba(116,214,197,0.10)' : 'rgba(15,118,110,0.08)', color: 'primary.main' }}>
                <LocationOnRoundedIcon fontSize="small" />
              </Box>
              <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500, fontSize: '0.85rem' }}>
                {doc.location || "Location not listed"}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Box sx={{ p: 0.7, borderRadius: '8px', bgcolor: isDark ? 'rgba(91,208,162,0.10)' : 'rgba(39,151,109,0.08)', color: 'success.main' }}>
                <HealthAndSafetyRoundedIcon fontSize="small" />
              </Box>
              <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500, fontSize: '0.85rem' }}>
                {doc.qualifications || "Verified specialist"}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Box sx={{ p: 0.7, borderRadius: '8px', bgcolor: isDark ? 'rgba(173,196,214,0.08)' : 'rgba(100, 116, 139, 0.05)', color: 'text.secondary' }}>
                <ScheduleRoundedIcon fontSize="small" />
              </Box>
              <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500, fontSize: '0.85rem' }}>
                {doc.timings || "Mon - Sat • Flexible"}
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ mt: 2.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip 
              label={`${doc.experience || '10+'} yrs Exp`} 
              size="small" 
              sx={{ 
                bgcolor: isDark ? 'rgba(116,214,197,0.14)' : 'rgba(15,118,110,0.12)', 
                color: 'primary.main', 
                fontWeight: 700,
                borderRadius: '8px',
                fontSize: '0.75rem'
              }} 
            />
          </Box>
        </CardContent>

        <CardActions sx={{ p: { xs: 2.5, md: 4 }, pt: 0, display: "flex", gap: { xs: 1, md: 2 } }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate(`/doctor/${doc._id}`)}
            sx={{ 
              borderRadius: '12px', 
              py: 1, 
              fontWeight: 700,
              fontSize: { xs: '0.8rem', md: '0.875rem' },
              textTransform: 'none',
              color: 'text.secondary',
              borderColor: isDark ? 'rgba(173,196,214,0.12)' : 'rgba(15, 23, 42, 0.12)',
            }}
          >
            Profile
          </Button>
          <Button
            fullWidth
            variant="contained"
            disableElevation
            onClick={() => navigate(`/book/${doc._id}`)}
            sx={{ 
              borderRadius: '12px', 
              py: 1, 
              fontWeight: 800,
              fontSize: { xs: '0.8rem', md: '0.875rem' },
              textTransform: 'none',
              background: 'linear-gradient(90deg, #74d6c5 0%, #f2b66c 100%)',
              color: '#143145',
              boxShadow: '0 4px 15px rgba(220,139,69,0.24)',
            }}
          >
            Book
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default DoctorCard;
