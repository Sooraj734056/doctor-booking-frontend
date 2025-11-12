import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Avatar,
  Grid,
  Divider,
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('https://doctor-booking-backend-z54j.onrender.com/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(data);
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('https://doctor-booking-backend-z54j.onrender.com/api/users/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.setItem('userName', profile.name);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Typography sx={{ mt: 5, textAlign: 'center' }}>Loading profile...</Typography>;

  return (
    <Box
      sx={{
        maxWidth: 700,
        mx: 'auto',
        mt: 6,
        mb: 6,
        p: 2,
      }}
    >
      <Paper
        elevation={5}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          backgroundColor: '#fff',
        }}
      >
        {/* Top Section with Gradient Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
            color: 'white',
            py: 4,
            px: 3,
            textAlign: 'center',
          }}
        >
          <Avatar
            sx={{
              width: 90,
              height: 90,
              mx: 'auto',
              mb: 2,
              bgcolor: '#fff',
              color: '#1976d2',
              fontWeight: 'bold',
              fontSize: '2rem',
              border: '4px solid #fff',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            }}
          >
            {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {profile.name || 'Your Name'}
          </Typography>
          <Typography variant="body1">{profile.email}</Typography>
        </Box>

        {/* Divider */}
        <Divider />

        {/* Form Section */}
        <Box sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#333', mb: 3 }}>
            Edit Profile
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  type="email"
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
                />
              </Grid>
              <Grid xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={updating}
                  sx={{
                    mt: 2,
                    width: '100%',
                    py: 1.3,
                    fontWeight: 'bold',
                    letterSpacing: '0.5px',
                    textTransform: 'none',
                    borderRadius: 2,
                    transition: '0.3s',
                    backgroundColor: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#125ea8',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                    },
                  }}
                >
                  {updating ? 'Updating...' : 'Update Profile'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
