import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Avatar,
  TextField,
  InputAdornment,
  MenuItem,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const specialties = [
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

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/doctors");
        setDoctors(res.data);
        setFilteredDoctors(res.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    let filtered = doctors;
    if (searchTerm) {
      filtered = filtered.filter((doc) =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (specialtyFilter) {
      filtered = filtered.filter(
        (doc) => doc.specialization === specialtyFilter
      );
    }
    setFilteredDoctors(filtered);
  }, [searchTerm, specialtyFilter, doctors]);

  const handleBook = (doctorId) => {
    navigate(`/book/${doctorId}`);
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", my: 6, px: 2 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom align="center">
        Our Doctors
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Search by Name"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            select
            fullWidth
            label="Filter by Specialty"
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            variant="outlined"
          >
            <MenuItem value="">All</MenuItem>
            {specialties.map((spec) => (
              <MenuItem key={spec} value={spec}>
                {spec}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* Doctors List */}
      <Grid container spacing={3}>
        {filteredDoctors.map((doc) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={doc._id}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 3,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
                maxWidth: { xs: "100%", sm: 350, md: 400 },
                mx: "auto",
              }}
            >
              <Card sx={{ textAlign: "center", p: 2 }}>
                <Avatar
                  src={doc.image}
                  alt={doc.name}
                  sx={{
                    width: 80,
                    height: 80,
                    mx: "auto",
                    mb: 2,
                    border: "2px solid #1976d2",
                  }}
                >
                  {doc.name.charAt(0)}
                </Avatar>

                <CardContent>
                  <Typography variant="h6">{doc.name}</Typography>
                  <Typography color="text.secondary">
                    {doc.specialization}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {doc.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {doc.phone}
                  </Typography>
                </CardContent>

                <CardActions
                  sx={{ justifyContent: "center", gap: 1, pb: 2 }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(`/doctor/${doc._id}`)}
                  >
                    View Profile
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => handleBook(doc._id)}
                  >
                    Book Now
                  </Button>
                </CardActions>
              </Card>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DoctorList;
