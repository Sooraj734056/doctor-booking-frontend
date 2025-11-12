import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Alert,
  Chip,
  Box,
  Avatar,
  Divider,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import { format, isToday, isTomorrow } from "date-fns";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";

const AppointmentStats = React.memo(({ appointments }) => {
  const stats = useMemo(() => {
    const total = appointments.length;
    const upcoming = appointments.filter((a) => a.status === "Confirmed").length;
    const done = appointments.filter((a) => a.status === "Completed").length;
    return { total, upcoming, done };
  }, [appointments]);

  return (
    <Typography variant="h6" sx={{ fontWeight: 600 }}>
      Total: {stats.total} | Upcoming: {stats.upcoming} | Done: {stats.done}
    </Typography>
  );
});

const MyAppointments = React.memo(() => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view appointments");
          setLoading(false);
          return;
        }

        const { data } = await axios.get(
          "https://doctor-booking-backend-z54j.onrender.com/api/appointments/my",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAppointments(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancel = useCallback(async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    setCancelingId(id);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://doctor-booking-backend-z54j.onrender.com/api/appointments/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status: "Cancelled" } : app
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel appointment");
    } finally {
      setCancelingId(null);
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "success";
      case "Pending":
        return "warning";
      case "Cancelled":
        return "error";
      case "Completed":
        return "info";
      default:
        return "default";
    }
  };

  const getAppointmentMessage = (date) => {
    const appointmentDate = new Date(date);
    if (isToday(appointmentDate)) return "Today";
    if (isTomorrow(appointmentDate)) return "Tomorrow";
    return format(appointmentDate, "MMM dd, yyyy");
  };

  if (loading)
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)",
          py: 6,
          px: 2,
        }}
      >
        <Box sx={{ maxWidth: 1000, mx: "auto" }}>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{ fontWeight: 700, color: "#1565c0", mb: 4 }}
          >
            🩺 My Appointments
          </Typography>
          <Box
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 3,
              background: "rgba(255,255,255,0.9)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CircularProgress size={24} sx={{ mr: 2 }} />
              <Typography variant="body1">Loading appointments...</Typography>
            </Box>
          </Box>
          <Grid container spacing={3}>
            {Array.from({ length: 3 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  elevation={5}
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.9)",
                    boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                      <Box>
                        <Skeleton variant="text" width={150} height={24} />
                        <Skeleton variant="text" width={100} height={16} />
                      </Box>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width={80} height={20} />
                    <Box sx={{ mt: 2 }}>
                      <Skeleton variant="rectangular" width={80} height={24} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    );

  if (error)
    return (
      <Alert severity="error" sx={{ mt: 4, mx: "auto", width: "60%" }}>
        {error}
      </Alert>
    );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)",
        py: 6,
        px: 2,
      }}
    >
      <Box sx={{ maxWidth: 1000, mx: "auto" }}>
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{ fontWeight: 700, color: "#1565c0", mb: 4 }}
        >
          🩺 My Appointments
        </Typography>

        <Box
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 3,
            background: "rgba(255,255,255,0.8)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            backdropFilter: "blur(10px)",
          }}
        >
          <AppointmentStats appointments={appointments} />
        </Box>

        {appointments.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              p: 5,
              background: "rgba(255,255,255,0.8)",
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <AssignmentIcon sx={{ fontSize: 60, color: "#90caf9", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              You haven’t booked any appointments yet.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {appointments.map((app) => (
              <Grid item xs={12} sm={6} md={4} key={app._id}>
                <Card
                  elevation={5}
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.9)",
                    boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {app.doctor ? app.doctor.name : "Unknown Doctor"}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontStyle: "italic" }}
                        >
                          {app.doctor?.specialization || "-"}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <EventIcon sx={{ fontSize: 18, verticalAlign: "middle", mr: 1 }} />
                        {getAppointmentMessage(app.date)}
                      </Typography>
                      <Typography variant="body2">
                        <AccessTimeIcon sx={{ fontSize: 18, verticalAlign: "middle", mr: 1 }} />
                        {app.time}
                      </Typography>
                    </Box>

                    {app.notes && (
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          p: 1,
                          bgcolor: "#e3f2fd",
                          borderRadius: 2,
                        }}
                      >
                        📝 {app.notes}
                      </Typography>
                    )}

                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={app.status}
                        color={getStatusColor(app.status)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </CardContent>

                  {app.status !== "Cancelled" && app.status !== "Completed" && (
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        fullWidth
                        onClick={() => handleCancel(app._id)}
                        disabled={cancelingId === app._id}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: 2,
                          py: 1,
                          transition: "0.3s",
                          "&:hover": {
                            backgroundColor: "#d32f2f",
                            transform: "scale(1.03)",
                          },
                        }}
                      >
                        {cancelingId === app._id
                          ? "Cancelling..."
                          : "Cancel Appointment"}
                      </Button>
                    </Box>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
});

export default MyAppointments;
