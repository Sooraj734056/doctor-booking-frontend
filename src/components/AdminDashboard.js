import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  Container,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import { fetchAdminStats } from "../api";
import { BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

const StatCard = ({ label, value, icon, isDark }) => (
  <Paper
    sx={{
      p: 2.5,
      borderRadius: 4,
      bgcolor: "background.paper",
      border: `1px solid ${isDark ? "rgba(173,196,214,0.12)" : "rgba(19,99,223,0.08)"}`,
    }}
    elevation={0}
  >
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Avatar sx={{ bgcolor: isDark ? "rgba(116,214,197,0.12)" : "rgba(19,99,223,0.1)", color: "primary.main" }}>{icon}</Avatar>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Stack>
  </Paper>
);

function AdminDashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchAdminStats();
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load admin dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const summaryCards = useMemo(() => {
    if (!stats?.summary) return [];
    const s = stats.summary;
    return [
      ["Users", s.totalUsers, <PeopleRoundedIcon />],
      ["Doctors", s.totalDoctors, <MedicalServicesRoundedIcon />],
      ["Appointments", s.totalAppointments, <EventAvailableRoundedIcon />],
      ["Messages", s.totalMessages, <ChatRoundedIcon />],
    ];
  }, [stats]);

  const chartData = useMemo(() => {
    if (!stats?.summary) return [];
    return [
      { name: 'Pending', value: stats.summary.pendingAppointments || 0, color: '#f59e0b' },
      { name: 'Confirmed', value: stats.summary.confirmedAppointments || 0, color: '#3b82f6' },
      { name: 'Completed', value: stats.summary.completedAppointments || 0, color: '#10b981' },
      { name: 'Cancelled', value: stats.summary.cancelledAppointments || 0, color: '#ef4444' }
    ];
  }, [stats]);

  if (loading) {
    return (
      <Container sx={{ py: 6 }}>
        <Skeleton variant="rounded" height={200} sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rounded" height={120} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 6 }}>
        <Paper sx={{ p: 3, borderRadius: 4 }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      </Container>
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
            p: { xs: 3, md: 4 },
            mb: 4,
            borderRadius: 5,
            color: "white",
            background:
              isDark
                ? "linear-gradient(135deg, rgba(11,29,42,0.96), rgba(22,61,69,0.92))"
                : "linear-gradient(135deg, rgba(10,24,36,0.96), rgba(18,74,82,0.92))",
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <InsightsRoundedIcon />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                Admin Dashboard
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.76)" }}>
                Live platform overview with users, appointments, messages, and new doctors.
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {summaryCards.map(([label, value, icon]) => (
            <Grid xs={12} sm={6} md={3} key={label}>
              <StatCard label={label} value={value} icon={icon} isDark={isDark} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 4, bgcolor: "background.paper", height: '100%' }} elevation={0}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
                Appointments Analytics
              </Typography>
              <Box sx={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: isDark ? '#adc4d6' : '#64748b' }} axisLine={false} tickLine={false} />
                    <RechartsTooltip 
                      cursor={{ fill: isDark ? 'rgba(173,196,214,0.06)' : 'rgba(19,99,223,0.04)' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 700, background: isDark ? '#0d1726' : '#fffaf2', color: isDark ? '#eff8ff' : '#18364a' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          <Grid xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 4, bgcolor: "background.paper" }} elevation={0}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                Recent doctors
              </Typography>
              <Stack spacing={1.5}>
                {stats.recentDoctors.map((doctor) => (
                  <Paper key={doctor._id} sx={{ p: 1.5, borderRadius: 3, bgcolor: isDark ? "rgba(173,196,214,0.08)" : "rgba(19,99,223,0.04)" }} elevation={0}>
                    <Typography sx={{ fontWeight: 800 }}>{doctor.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {doctor.specialization} • {doctor.location || "Location not listed"}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 4, bgcolor: "background.paper" }} elevation={0}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                Recent appointments
              </Typography>
              <Stack spacing={1.5}>
                {stats.recentAppointments.map((appointment) => (
                  <Paper key={appointment._id} sx={{ p: 1.5, borderRadius: 3, bgcolor: isDark ? "rgba(173,196,214,0.08)" : "rgba(19,99,223,0.04)" }} elevation={0}>
                    <Typography sx={{ fontWeight: 800 }}>
                      {appointment.user?.name || "Unknown user"} with {appointment.doctor?.name || "Unknown doctor"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time} • {appointment.status}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 4, bgcolor: "background.paper" }} elevation={0}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                Recent messages
              </Typography>
              <Stack spacing={1.5}>
                {stats.recentMessages.map((message) => (
                  <Paper key={message._id} sx={{ p: 1.5, borderRadius: 3, bgcolor: isDark ? "rgba(173,196,214,0.08)" : "rgba(19,99,223,0.04)" }} elevation={0}>
                    <Typography sx={{ fontWeight: 800 }}>
                      {message.from?.name || "User"} to {message.to?.name || "User"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {message.message}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default AdminDashboard;
