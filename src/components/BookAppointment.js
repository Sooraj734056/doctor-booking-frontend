import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Alert,
  Box,
  Grid,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { fetchDoctors, bookAppointment } from '../api';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(doctorId || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const res = await fetchDoctors();
        setDoctors(res.data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setMessage('Failed to load doctors');
        setSeverity('error');
      }
    };
    loadDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !date || !time) {
      setMessage('Please fill all required fields');
      setSeverity('warning');
      return;
    }

    setLoading(true);
    try {
      const appointmentData = { doctor: selectedDoctor, date, time, notes };
      await bookAppointment(appointmentData);
      setMessage('✅ Appointment booked successfully!');
      setSeverity('success');
      setDate('');
      setTime('');
      setNotes('');
    } catch (err) {
      console.error('Booking error:', err);
      setMessage(err.response?.data?.message || 'Failed to book appointment');
      setSeverity('error');
    } finally {
      setLoading(false);
    }
  };

  const selectedDoctorData = doctors.find(doc => doc._id === selectedDoctor);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 6,
        background: 'linear-gradient(135deg, #e3f2fd, #f5f5f5)',
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 4,
            color: '#1976d2',
          }}
        >
          🩺 Book Your Appointment
        </Typography>

        {message && (
          <Alert severity={severity} sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Left: Appointment Form */}
          <Grid xs={12} md={6}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 4,
                backdropFilter: 'blur(10px)',
                background: 'rgba(255,255,255,0.9)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Appointment Details
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    select
                    fullWidth
                    label="Select Doctor"
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    required
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="">
                      <em>Choose a doctor</em>
                    </MenuItem>
                    {doctors.map((doc) => (
                      <MenuItem key={doc._id} value={doc._id}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight={600}>
                              {doc.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {doc.specialization}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    fullWidth
                    type="date"
                    label="Appointment Date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                  />

                  <TextField
                    fullWidth
                    type="time"
                    label="Appointment Time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Additional Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe your symptoms or special requirements..."
                    sx={{ mb: 3 }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={
                      loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <EventIcon />
                      )
                    }
                    disabled={loading}
                    sx={{
                      py: 1.3,
                      fontWeight: 600,
                      fontSize: '1rem',
                      background:
                        'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                      borderRadius: '12px',
                      textTransform: 'none',
                    }}
                  >
                    {loading ? 'Booking...' : 'Book Appointment'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right: Doctor Info */}
          <Grid xs={12} md={6}>
            {selectedDoctorData ? (
              <Card
                elevation={4}
                sx={{
                  borderRadius: 4,
                  backdropFilter: 'blur(10px)',
                  background: 'rgba(255,255,255,0.9)',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Selected Doctor
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={selectedDoctorData.image || ''}
                      alt={selectedDoctorData.name}
                      sx={{
                        width: 70,
                        height: 70,
                        mr: 2,
                        border: '2px solid #1976d2',
                      }}
                    >
                      {!selectedDoctorData.image && (
                        <PersonIcon sx={{ fontSize: 35 }} />
                      )}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {selectedDoctorData.name}
                      </Typography>
                      <Chip
                        label={selectedDoctorData.specialization}
                        color="primary"
                        size="small"
                      />
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    <strong>Email:</strong> {selectedDoctorData.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Phone:</strong> {selectedDoctorData.phone}
                  </Typography>
                  {selectedDoctorData.experience && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Experience:</strong>{' '}
                      {selectedDoctorData.experience} years
                    </Typography>
                  )}
                  {selectedDoctorData.location && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Location:</strong> {selectedDoctorData.location}
                    </Typography>
                  )}

                  {date && time && (
                    <Box
                      sx={{
                        mt: 3,
                        p: 2,
                        borderRadius: 2,
                        background: '#e3f2fd',
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        fontWeight={600}
                      >
                        Appointment Summary
                      </Typography>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      >
                        <EventIcon sx={{ mr: 1, fontSize: 18 }} />
                        <Typography variant="body2">
                          {new Date(date).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon sx={{ mr: 1, fontSize: 18 }} />
                        <Typography variant="body2">{time}</Typography>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Select a doctor to view details.
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BookAppointment;
