import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Avatar,
  Grid,
  CircularProgress,
  Alert,
  Rating,
  Box,
  Divider,
  Paper,
} from "@mui/material";
import { fetchDoctorById } from "../api";
import { toast } from "react-toastify";

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: "50px auto" }}>
      <Paper
        elevation={5}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <Grid container spacing={3} alignItems="center">
          {/* Doctor Image */}
          <Grid xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 3,
              }}
            >
              <Avatar
                src={doctor.image}
                alt={doctor.name}
                sx={{
                  width: 160,
                  height: 160,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  border: "3px solid #1976d2",
                }}
              >
                {doctor.name?.charAt(0)}
              </Avatar>
            </Box>
          </Grid>

          {/* Doctor Info */}
          <Grid xs={12} md={8}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                {doctor.name}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {doctor.specialization}
              </Typography>
              <Divider sx={{ my: 2 }} />

              {doctor.specialty && (
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Specialty:</strong> {doctor.specialty}
                </Typography>
              )}
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Email:</strong> {doctor.email}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Phone:</strong> {doctor.phone}
              </Typography>
              {doctor.experience && (
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Experience:</strong> {doctor.experience} years
                </Typography>
              )}
              {doctor.location && (
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Location:</strong> {doctor.location}
                </Typography>
              )}
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Qualifications:</strong> {doctor.qualifications || "Not specified"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Timings:</strong> {doctor.timings || "Not specified"}
              </Typography>
            </CardContent>
          </Grid>
        </Grid>

        {/* Rating and Actions */}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ p: 3 }}>
          <Typography variant="body1" gutterBottom>
            Rate this doctor:
          </Typography>
          <Rating
            name="doctor-rating"
            value={doctor.rating || 0}
            onChange={(event, newValue) => {
              toast.success(`Thank you for rating ${newValue} stars!`);
            }}
            size="large"
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Average Rating: {doctor.rating || "Not rated yet"}
          </Typography>
        </Box>

        <Divider />

        <CardActions sx={{ justifyContent: "center", p: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate(`/book/${id}`)}
            sx={{ px: 4, borderRadius: 3 }}
          >
            Book Appointment
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/doctors")}
            sx={{ px: 4, borderRadius: 3 }}
          >
            Back to Doctors
          </Button>
        </CardActions>
      </Paper>
    </Box>
  );
};

export default DoctorDetails;
