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

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          height: "100%",
          borderRadius: "24px",
          overflow: "hidden",
          backdropFilter: "blur(20px) saturate(180%)",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          "&:hover": {
            transform: "translateY(-12px) scale(1.02)",
            boxShadow: "0 22px 45px rgba(0,0,0,0.1)",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            "& .card-header-gradient": {
              opacity: 1,
            }
          },
        }}
      >
        <Box
          className="card-header-gradient"
          sx={{
            p: 3,
            background: "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(29, 78, 216, 0.05) 100%)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(0,0,0,0.03)",
            transition: "opacity 0.4s ease",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: -3,
                  borderRadius: '50%',
                  border: '2px solid #2563eb',
                  opacity: 0.3,
                }
              }}
            >
              <Avatar
                src={doc.image}
                alt={doc.name}
                sx={{
                  width: 68,
                  height: 68,
                  bgcolor: "primary.main",
                  border: "3px solid #fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                {doc.name?.charAt(0)}
              </Avatar>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b", lineHeight: 1.2, mb: 0.5 }}>
                {doc.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "#2563eb", fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                {doc.specialization}
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5, 
              background: '#fff', 
              px: 1.2, 
              py: 0.5, 
              borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <StarRoundedIcon sx={{ color: "#f59e0b", fontSize: '1.1rem' }} />
              <Typography variant="body2" sx={{ fontWeight: 800, color: "#1e293b" }}>
                {doc.rating || "4.8"}
              </Typography>
            </Box>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(doc._id);
              }}
              size="small"
              sx={{
                bgcolor: "white",
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'all 0.2s',
                "&:hover": { 
                  bgcolor: "#fff",
                  transform: 'scale(1.1)',
                  color: 'error.main'
                },
              }}
            >
              {isFavorite ? (
                <FavoriteRoundedIcon color="error" fontSize="small" />
              ) : (
                <FavoriteBorderRoundedIcon fontSize="small" />
              )}
            </IconButton>
          </Box>
        </Box>

        <CardContent sx={{ p: 4, flexGrow: 1 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ p: 0.8, borderRadius: '10px', bgcolor: 'rgba(37, 99, 235, 0.05)', color: '#2563eb' }}>
                <LocationOnRoundedIcon fontSize="small" />
              </Box>
              <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
                {doc.location || "Location not listed"}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ p: 0.8, borderRadius: '10px', bgcolor: 'rgba(16, 185, 129, 0.05)', color: '#10b981' }}>
                <HealthAndSafetyRoundedIcon fontSize="small" />
              </Box>
              <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
                {doc.qualifications || "Verified specialist"}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ p: 0.8, borderRadius: '10px', bgcolor: 'rgba(100, 116, 139, 0.05)', color: '#64748b' }}>
                <ScheduleRoundedIcon fontSize="small" />
              </Box>
              <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
                {doc.timings || "Mon - Sat • Flexible"}
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip 
              label={`${doc.experience || '10+'} yrs Exp`} 
              size="small" 
              sx={{ 
                bgcolor: 'rgba(37, 99, 235, 0.15)', 
                color: '#1e40af', 
                fontWeight: 800,
                borderRadius: '8px',
                border: 'none'
              }} 
            />
            <Chip 
              label={doc.email?.split('@')[0]} 
              size="small" 
              variant="outlined"
              sx={{ borderRadius: '8px', borderColor: 'rgba(0,0,0,0.12)', color: '#475569', fontWeight: 600 }}
            />
          </Box>
        </CardContent>

        <CardActions sx={{ p: 4, pt: 0, display: "flex", gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate(`/doctor/${doc._id}`)}
            sx={{ 
              borderRadius: '14px', 
              py: 1.2, 
              fontWeight: 700,
              textTransform: 'none',
              color: '#475569',
              borderColor: 'rgba(15, 23, 42, 0.12)',
              "&:hover": { bgcolor: 'rgba(15, 23, 42, 0.04)', borderColor: '#94a3b8', color: '#0f172a' }
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
              borderRadius: '14px', 
              py: 1.2, 
              fontWeight: 800,
              textTransform: 'none',
              background: 'linear-gradient(90deg, #38bdf8 0%, #2563eb 100%)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(37,99,235,0.3)',
              "&:hover": { background: 'linear-gradient(90deg, #0ea5e9 0%, #1d4ed8 100%)', boxShadow: '0 6px 20px rgba(37,99,235,0.4)' }
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
