import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  Dialog,
  TextField,
  Stack,
  Chip,
} from "@mui/material";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import MonitorHeartRoundedIcon from "@mui/icons-material/MonitorHeartRounded";
import { toast } from "react-toastify";

export default function DoctorDashboard() {
  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const pendingPatients = [
    { id: 1, name: "Arjun Verma", time: "10:30 AM", condition: "Fever & Chills", status: "Waiting", color: "#f59e0b" },
    { id: 2, name: "Sneha Patel", time: "11:15 AM", condition: "Routine Checkup", status: "Waiting", color: "#3b82f6" },
    { id: 3, name: "Rohan Gupta", time: "01:00 PM", condition: "Post-op consult", status: "Waiting", color: "#8b5cf6" },
  ];

  const handleWrite = (patient) => {
    setSelectedPatient(patient);
    setOpen(true);
  };

  const handleSend = (e) => {
    e.preventDefault();
    setOpen(false);
    toast.success(`Digital Prescription sent exclusively to ${selectedPatient.name}!`);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f1f5f9", py: 5 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: "#0f172a" }}>
          Doctor Workspace
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
          Manage your schedule and issue secure digital prescriptions.
        </Typography>

        <Grid container spacing={3}>
          {pendingPatients.map((patient) => (
            <Grid item xs={12} md={4} key={patient.id}>
              <Paper sx={{ p: 4, borderRadius: 4, borderTop: `4px solid ${patient.color}`, transition: "transform 0.2s", "&:hover": { transform: "translateY(-4px)", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" } }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                  <Avatar sx={{ bgcolor: patient.color, width: 56, height: 56, fontWeight: 700 }}>
                    {patient.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{patient.name}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: patient.color }}>{patient.time}</Typography>
                  </Box>
                </Stack>
                <Chip icon={<MonitorHeartRoundedIcon />} label={patient.condition} size="small" sx={{ mb: 3, bgcolor: "rgba(0,0,0,0.04)" }} />
                <Button variant="contained" fullWidth startIcon={<EditNoteRoundedIcon />} onClick={() => handleWrite(patient)} sx={{ py: 1.2, fontWeight: 700, borderRadius: 2, bgcolor: "#0f172a", "&:hover": { bgcolor: "#1e293b" } }}>
                  Write Prescription
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Digital Prescription Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { borderRadius: 4, width: '100%', maxWidth: 500, p: 2 } }}>
        <Box component="form" onSubmit={handleSend} sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
            <CheckCircleRoundedIcon color="success" />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>Digital Prescription</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Issuing for: <strong>{selectedPatient?.name}</strong>
          </Typography>

          <Stack spacing={2.5}>
            <TextField label="Diagnosis" required fullWidth autoFocus placeholder="E.g., Viral Pharyngitis" />
            <TextField label="Medications & Dosage" required fullWidth multiline rows={3} placeholder="1. Paracetamol 500mg - 1 tab (SOS)&#10;2. Azithromycin 250mg - 1 tab (after meals)" />
            <TextField label="Advice / Follow-up" fullWidth multiline rows={2} placeholder="Drink plenty of warm fluids." />
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button onClick={() => setOpen(false)} fullWidth sx={{ fontWeight: 700 }}>Cancel</Button>
            <Button type="submit" variant="contained" color="success" fullWidth sx={{ fontWeight: 800 }}>Sign & Send</Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
}
