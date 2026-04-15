import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import PaymentRoundedIcon from "@mui/icons-material/PaymentRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { fetchDoctors, bookAppointment } from "../api";
import { toast } from "react-toastify";

function BookAppointment() {
  const { doctorId } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(doctorId || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const [loading, setLoading] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Card States for Mockup
  const [cardDetails, setCardDetails] = useState({
    number: "•••• •••• •••• ••••",
    expiry: "MM/YY",
    name: "CARDHOLDER NAME",
    cvc: "•••"
  });

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const res = await fetchDoctors();
        const docs = res.data;
        setDoctors(docs);
        // Ensure the doctorId from URL actually exists in the list
        if (doctorId && !docs.some(d => d._id === doctorId)) {
          console.warn("Selected doctor ID from URL not found in list.");
          setSelectedDoctor("");
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setMessage("Failed to load doctors");
        setSeverity("error");
      }
    };
    loadDoctors();
  }, [doctorId]);

  const selectedDoctorData = useMemo(
    () => doctors.find((doc) => doc._id === selectedDoctor),
    [doctors, selectedDoctor]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDoctor || !date || !time) {
      setMessage("Please fill all required fields");
      setSeverity("warning");
      return;
    }
    setPaymentSuccess(false);
    setPaymentDialogOpen(true);
  };

  const handleConfirmPayment = async (e) => {
    e?.preventDefault?.();
    setPaymentDialogOpen(false);
    setLoading(true);
    try {
      // Simulate network delay for premium feel
      await new Promise(resolve => setTimeout(resolve, 2000));
      await bookAppointment({ doctor: selectedDoctor, date, time, notes });
      
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentDialogOpen(false);
        toast.success("Payment of $50 successful! Appointment booked.");
        setMessage("Appointment booked successfully.");
        setSeverity("success");
        setDate("");
        setTime("");
        setNotes("");
      }, 1500);
    } catch (err) {
      console.error("Booking error:", err);
      toast.error(err.response?.data?.message || "Failed to book appointment");
      setMessage(err.response?.data?.message || "Failed to book appointment");
      setSeverity("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 4, md: 6 },
        background:
          "radial-gradient(circle at top right, rgba(103,232,249,0.16), transparent 28%), linear-gradient(180deg, rgba(247,251,255,1) 0%, rgba(233,243,252,1) 100%)",
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
              "linear-gradient(135deg, rgba(7,18,39,0.96), rgba(13,110,139,0.92))",
          }}
        >
          <Stack direction={{ xs: "column", md: "row" }} spacing={2.5} alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="overline" sx={{ letterSpacing: "0.22em", color: "rgba(255,255,255,0.72)" }}>
                Smart booking
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: "2.2rem", md: "3.4rem" }, lineHeight: 1 }}>
                Book your appointment in a calmer, smarter flow.
              </Typography>
              <Typography sx={{ mt: 1.5, color: "rgba(255,255,255,0.8)", maxWidth: 780, lineHeight: 1.8 }}>
                Choose a doctor, reserve a time, and keep your notes organized in one polished booking screen.
              </Typography>
            </Box>
            <Chip
              icon={<MedicalServicesRoundedIcon sx={{ color: "#67e8f9 !important" }} />}
              label="Instant confirmation"
              sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white", px: 1 }}
            />
          </Stack>
        </Paper>

        {message && (
          <Alert severity={severity} sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid xs={12} md={7}>
            <Card sx={{ borderRadius: 4, bgcolor: "background.paper", border: "1px solid rgba(19,99,223,0.08)" }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                  Appointment details
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={2}>
                    <TextField
                      select
                      fullWidth
                      label="Select Doctor"
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      required
                    >
                      <MenuItem value="">
                        <em>Choose a doctor</em>
                      </MenuItem>
                      {doctors.map((doc) => (
                        <MenuItem key={doc._id} value={doc._id}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{ width: 34, height: 34, bgcolor: "primary.main" }}>
                              <PersonIcon fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight={700}>
                                {doc.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {doc.specialization}
                              </Typography>
                            </Box>
                          </Stack>
                        </MenuItem>
                      ))}
                    </TextField>

                    <Grid container spacing={2}>
                      <Grid xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="date"
                          label="Appointment Date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ min: new Date().toISOString().split("T")[0] }}
                        />
                      </Grid>
                      <Grid xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="time"
                          label="Appointment Time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          required
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>

                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Additional Notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Describe your symptoms or special requirements..."
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <EventIcon />}
                      sx={{
                        py: 1.4,
                        fontWeight: 800,
                        background: "linear-gradient(90deg, #67e8f9, #22c55e)",
                        color: "#04111f",
                      }}
                    >
                      {loading ? "Booking..." : "Book Appointment"}
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid xs={12} md={5}>
            {selectedDoctorData ? (
              <Card sx={{ borderRadius: 4, bgcolor: "background.paper", border: "1px solid rgba(19,99,223,0.08)" }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                    Selected doctor
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Avatar
                      src={selectedDoctorData.image || ""}
                      alt={selectedDoctorData.name}
                      sx={{ width: 72, height: 72, bgcolor: "primary.main" }}
                    >
                      {!selectedDoctorData.image && <PersonIcon />}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {selectedDoctorData.name}
                      </Typography>
                      <Chip label={selectedDoctorData.specialization} color="primary" size="small" sx={{ mt: 0.5 }} />
                    </Box>
                  </Stack>

                  <Stack spacing={1.2}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Email:</strong> {selectedDoctorData.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Phone:</strong> {selectedDoctorData.phone}
                    </Typography>
                    {selectedDoctorData.experience && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Experience:</strong> {selectedDoctorData.experience} years
                      </Typography>
                    )}
                    {selectedDoctorData.location && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Location:</strong> {selectedDoctorData.location}
                      </Typography>
                    )}
                  </Stack>

                  {(date || time) && (
                    <Paper sx={{ mt: 3, p: 2.5, borderRadius: 3, bgcolor: "rgba(19,99,223,0.06)" }} elevation={0}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                        Appointment summary
                      </Typography>
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <EventIcon fontSize="small" />
                          <Typography variant="body2">
                            {date ? new Date(date).toLocaleDateString() : "Choose a date"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AccessTimeIcon fontSize="small" />
                          <Typography variant="body2">{time || "Choose a time"}</Typography>
                        </Stack>
                      </Stack>
                    </Paper>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 4,
                  minHeight: 260,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "background.paper",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Select a doctor to preview booking details.
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>

      {/* SECURE PAYMENT MODAL - PREMIUM REDESIGN */}
      <Dialog 
        open={paymentDialogOpen} 
        onClose={() => !loading && setPaymentDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 6, width: '100%', maxWidth: 480, overflow: 'hidden' } }}
      >
        <Box sx={{ position: 'relative' }}>
          {loading && !paymentSuccess && (
            <Box sx={{ position: 'absolute', inset: 0, zIndex: 10, bgcolor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress size={60} thickness={4} />
              <Typography sx={{ mt: 2, fontWeight: 700 }}>Processing Payment...</Typography>
            </Box>
          )}

          {paymentSuccess && (
            <Box sx={{ position: 'absolute', inset: 0, zIndex: 11, bgcolor: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', p: 4 }}>
              <Avatar sx={{ bgcolor: '#22c55e', width: 80, height: 80, mb: 2 }}>
                <CheckCircleRoundedIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>Payment Successful!</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>Your appointment is confirmed.</Typography>
            </Box>
          )}

          <Box sx={{ p: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <Avatar sx={{ bgcolor: "#22c55e", width: 44, height: 44 }}>
                <PaymentRoundedIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>Complete Booking</Typography>
                <Typography variant="body2" color="text.secondary">Total to pay: <strong style={{ color: '#0f172a' }}>$50.00</strong></Typography>
              </Box>
            </Stack>

            {/* Interactive Card Mockup */}
            <Paper elevation={12} sx={{ mb: 4, p: 3, borderRadius: 4, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ width: 45, height: 35, bgcolor: '#f59e0b', borderRadius: 1, opacity: 0.8 }} />
                <Typography sx={{ fontWeight: 800, fontStyle: 'italic', opacity: 0.8 }}>VISA</Typography>
              </Stack>
              <Typography sx={{ fontSize: '1.2rem', letterSpacing: '0.15em', my: 2, fontFamily: 'monospace' }}>
                {cardDetails.number || "•••• •••• •••• ••••"}
              </Typography>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.6, display: 'block' }}>CARDHOLDER</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{cardDetails.name.toUpperCase() || "NAME SURNAME"}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.6, display: 'block' }}>EXPIRES</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{cardDetails.expiry || "MM/YY"}</Typography>
                </Box>
              </Stack>
            </Paper>
            
            <Box component="form" onSubmit={handleConfirmPayment}>
              <Stack spacing={2.2}>
                <TextField 
                  required fullWidth label="Card Number" 
                  autoFocus
                  placeholder="4242 4242 4242 4242"
                  onChange={(e) => setCardDetails({...cardDetails, number: e.target.value || "•••• •••• •••• ••••"})}
                  inputProps={{ maxLength: 19 }}
                />
                <Grid container spacing={2}>
                  <Grid item xs={7}>
                    <TextField 
                      required fullWidth label="Expiry" placeholder="MM / YY" 
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value || "MM/YY"})}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField 
                      required fullWidth label="CVC" placeholder="•••" 
                      inputProps={{ maxLength: 3 }}
                    />
                  </Grid>
                </Grid>
                <TextField 
                  required fullWidth label="Name on Card" placeholder="John Doe" 
                  onChange={(e) => setCardDetails({...cardDetails, name: e.target.value || "CARDHOLDER NAME"})}
                />
              </Stack>

              <Button 
                type="submit" 
                fullWidth 
                variant="contained" 
                color="success"
                sx={{ mt: 4, py: 1.8, fontWeight: 800, fontSize: '1.1rem', background: 'linear-gradient(90deg, #22c55e, #16a34a)', boxShadow: '0 8px 20px rgba(34,197,94,0.3)' }}
              >
                Confirm & Pay $50.00
              </Button>
              <Button 
                fullWidth 
                variant="text" 
                disabled={loading}
                sx={{ mt: 1, fontWeight: 700, color: 'text.secondary' }}
                onClick={() => setPaymentDialogOpen(false)}
              >
                Back to details
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </Container>
    </Box>
  );
}

export default BookAppointment;
