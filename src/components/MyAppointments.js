import React, { useEffect, useMemo, useState } from "react";
import { fetchMyAppointments, cancelAppointment } from "../api";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { format, isToday, isTomorrow } from "date-fns";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import { JitsiMeeting } from '@jitsi/react-sdk';

function MyAppointments() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingId, setCancelingId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [activeMeeting, setActiveMeeting] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view appointments");
          setLoading(false);
          return;
        }
        const { data } = await fetchMyAppointments();
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

  const stats = useMemo(() => {
    const total = appointments.length;
    const upcoming = appointments.filter((a) => a.status === "Confirmed").length;
    const done = appointments.filter((a) => a.status === "Completed").length;
    const cancelled = appointments.filter((a) => a.status === "Cancelled").length;
    return { total, upcoming, done, cancelled };
  }, [appointments]);

  const handleCancelClick = (id) => {
    setAppointmentToCancel(id);
    setConfirmDialogOpen(true);
  };

  const handleDialogClose = () => {
    setConfirmDialogOpen(false);
    setAppointmentToCancel(null);
  };

  const handleConfirmCancel = async () => {
    const id = appointmentToCancel;
    setConfirmDialogOpen(false);
    setAppointmentToCancel(null);
    if (!id) return;

    setCancelingId(id);
    try {
      await cancelAppointment(id);
      setAppointments((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: "Cancelled" } : app))
      );
    } catch (err) {
      console.error("Cancel error:", err);
      alert(err.response?.data?.message || "Failed to cancel appointment");
    } finally {
      setCancelingId(null);
    }
  };

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

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", py: 6, px: 2, background: isDark ? "linear-gradient(180deg, #08111b 0%, #0d1726 100%)" : "linear-gradient(180deg, #f3fbf8 0%, #eef4ff 100%)" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ textAlign: "center", mb: 4, fontWeight: 800 }}>
            My Appointments
          </Typography>
          <Grid container spacing={3}>
            {Array.from({ length: 3 }).map((_, index) => (
              <Grid xs={12} sm={6} md={4} key={index}>
                <Skeleton variant="rounded" height={250} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ px: 2, mt: 4 }}>
        <Alert severity="error" sx={{ maxWidth: 700, mx: "auto" }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 4, md: 6 },
        background:
          isDark
            ? "radial-gradient(circle at top right, rgba(116,214,197,0.12), transparent 28%), linear-gradient(180deg, #08111b 0%, #0d1726 100%)"
            : "radial-gradient(circle at top right, rgba(116,214,197,0.16), transparent 28%), linear-gradient(180deg, #f3fbf8 0%, #eef4ff 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Paper
          sx={{
            p: { xs: 2.5, md: 4 },
            mb: { xs: 3, md: 4 },
            borderRadius: { xs: 4, md: 5 },
            color: "white",
            background:
              isDark
                ? "linear-gradient(135deg, rgba(11,29,42,0.96), rgba(22,61,69,0.92))"
                : "linear-gradient(135deg, rgba(10,24,36,0.96), rgba(18,74,82,0.92))",
          }}
        >
          <Typography variant="overline" sx={{ letterSpacing: "0.24em", color: "rgba(255,255,255,0.72)", fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
            Personal dashboard
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3.4rem" }, lineHeight: 1.2, mt: 1, fontWeight: 800 }}>
            Your appointments at a glance.
          </Typography>
          <Typography sx={{ mt: 1.5, color: "rgba(255,255,255,0.78)", maxWidth: 760, lineHeight: 1.8, fontSize: { xs: '0.9rem', md: '1rem' } }}>
            Track pending visits, confirmed bookings, and completed care in a clean dashboard.
          </Typography>
        </Paper>


        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            ["Total", stats.total],
            ["Upcoming", stats.upcoming],
            ["Completed", stats.done],
            ["Cancelled", stats.cancelled],
          ].map(([label, value]) => (
            <Grid xs={6} md={3} key={label}>
              <Paper sx={{ p: 2, textAlign: "center", borderRadius: 4 }} elevation={0}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main", fontSize: { xs: '1.25rem', md: '2rem' } }}>
                  {value}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, fontSize: '0.65rem' }}>
                  {label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>


        {appointments.length === 0 ? (
          <Paper sx={{ p: 5, textAlign: "center", borderRadius: 4 }} elevation={0}>
            <AssignmentTurnedInRoundedIcon sx={{ fontSize: 64, color: "primary.main", mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              No appointments yet
            </Typography>
            <Typography color="text.secondary">
              Once you book an appointment, it will appear here with status and date details.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {appointments.map((app) => (
              <Grid xs={12} sm={6} md={4} key={app._id}>

                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    overflow: "hidden",
                    bgcolor: "background.paper",
                    border: "1px solid rgba(19,99,223,0.08)",
                    transition: "transform 180ms ease, box-shadow 180ms ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 20px 38px rgba(15,23,42,0.12)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          {app.doctor ? app.doctor.name : "Unknown Doctor"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {app.doctor?.specialization || "-"}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack spacing={1.2} sx={{ mb: 2 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <EventIcon fontSize="small" color="primary" />
                        <Typography variant="body2">{getAppointmentMessage(app.date)}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="body2">{app.time}</Typography>
                      </Stack>
                    </Stack>

                    {app.notes && (
                      <Paper sx={{ p: 1.5, borderRadius: 3, bgcolor: isDark ? "rgba(173,196,214,0.08)" : "rgba(19,99,223,0.04)" }} elevation={0}>
                        <Typography variant="body2" color="text.secondary">
                          {app.notes}
                        </Typography>
                      </Paper>
                    )}

                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={app.status}
                        color={getStatusColor(app.status)}
                        size="small"
                        sx={{ fontWeight: 800 }}
                      />
                    </Box>
                  </CardContent>

                  {app.status !== "Cancelled" && app.status !== "Completed" && (
                    <Box sx={{ p: 3, pt: 0 }}>
                      <Stack spacing={1}>
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<VideocamRoundedIcon />}
                          onClick={() => setActiveMeeting(app)}
                          sx={{ 
                            py: 1.1, 
                            fontWeight: 800,
                            background: "linear-gradient(90deg, #74d6c5, #f2b66c)",
                            color: "#143145"
                          }}
                        >
                          Join Consultation
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          fullWidth
                          onClick={() => handleCancelClick(app._id)}
                          disabled={cancelingId === app._id}
                          sx={{ py: 1.1, fontWeight: 800 }}
                        >
                          {cancelingId === app._id ? "Cancelling..." : "Cancel Appointment"}
                        </Button>
                      </Stack>
                    </Box>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog
          open={confirmDialogOpen}
          onClose={handleDialogClose}
          aria-labelledby="cancel-dialog-title"
          aria-describedby="cancel-dialog-description"
        >
          <DialogTitle id="cancel-dialog-title">Cancel Appointment</DialogTitle>
          <DialogContent>
            <DialogContentText id="cancel-dialog-description">
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>No, Keep It</Button>
            <Button onClick={handleConfirmCancel} color="error" variant="contained" autoFocus>
              Yes, Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog fullScreen open={Boolean(activeMeeting)} onClose={() => setActiveMeeting(null)}>
          <Box sx={{ height: '100vh', width: '100vw', bgcolor: isDark ? '#050b12' : '#0f172a', position: 'relative' }}>
            <Button 
              onClick={() => setActiveMeeting(null)} 
              variant="contained"
              color="error"
              sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1000, fontWeight: 800 }}
            >
              End Consultation
            </Button>
            {activeMeeting && (
              <JitsiMeeting
                roomName={`Consultation-${activeMeeting._id}`}
                configOverwrite={{
                  startWithAudioMuted: false,
                  startWithVideoMuted: false,
                }}
                getIFrameRef={(iframeRef) => { iframeRef.style.height = '100%'; iframeRef.style.width = '100%'; }}
                onReadyToClose={() => setActiveMeeting(null)}
              />
            )}
          </Box>
        </Dialog>
      </Container>
    </Box>
  );
}

export default MyAppointments;
