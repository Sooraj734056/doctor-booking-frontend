import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  ButtonBase,
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
  useTheme,
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
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
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
  const [paymentMethod, setPaymentMethod] = useState("card");
  
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
        background: isDark ? "#08111b" : "#f8fafc",
      }}
    >
      {/* Hero Header Section */}
      <Box
        sx={{
          pt: { xs: 8, md: 12 },
          pb: { xs: 6, md: 10 },
          color: "white",
          background: isDark
            ? "linear-gradient(135deg, #0b1d2a 0%, #163d45 100%)"
            : "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={2}>
            <Typography variant="overline" sx={{ letterSpacing: "0.22em", color: "rgba(255,255,255,0.6)", fontWeight: 800 }}>
              Secure Appointment
            </Typography>
            <Typography variant="h1" sx={{ fontSize: { xs: "2.5rem", md: "4rem" }, fontWeight: 900, lineHeight: 1.1 }}>
              Enter a calmer, smarter <br />
              <Box component="span" sx={{ color: "#74d6c5" }}>Booking experience.</Box>
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={8}>
          <Grid item xs={12} md={7}>
            <Stack spacing={6}>
              {message && (
                <Alert severity={severity} sx={{ borderRadius: 4 }}>
                  {message}
                </Alert>
              )}

              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box component="span" sx={{ width: 40, height: 4, bgcolor: '#74d6c5', borderRadius: 2 }} />
                  Appointment Details
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={4}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 800, color: "text.secondary", textTransform: 'uppercase', letterSpacing: 1 }}>
                        1. Select Your Specialist
                      </Typography>
                      <TextField
                        select
                        fullWidth
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 4,
                            bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.02)",
                          }
                        }}
                      >
                        <MenuItem value="">
                          <em>Choose a doctor</em>
                        </MenuItem>
                        {doctors.map((doc) => (
                          <MenuItem key={doc._id} value={doc._id}>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar src={doc.image} sx={{ width: 32, height: 32 }}>{doc.name?.charAt(0)}</Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={700}>{doc.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{doc.specialization}</Typography>
                              </Box>
                            </Stack>
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 800, color: "text.secondary", textTransform: 'uppercase', letterSpacing: 1 }}>
                        2. Preferred Schedule
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ min: new Date().toISOString().split("T")[0] }}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 4 } }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                            InputLabelProps={{ shrink: true }}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 4 } }}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 800, color: "text.secondary", textTransform: 'uppercase', letterSpacing: 1 }}>
                        3. Additional Information
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Please describe any symptoms or specific concerns you would like to discuss..."
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 4 } }}
                      />
                    </Box>

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{
                        py: 2.2,
                        borderRadius: 4,
                        fontSize: '1.1rem',
                        fontWeight: 900,
                        background: "linear-gradient(90deg, #74d6c5, #f2b66c)",
                        color: "#143145",
                        boxShadow: "0 10px 30px rgba(116,214,197,0.3)",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 15px 35px rgba(116,214,197,0.4)",
                        }
                      }}
                    >
                      {loading ? "Processing..." : "Continue to Payment"}
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Stack>
          </Grid>

          {/* Sticky Doctor Sidebar */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'sticky', top: 120 }}>
              {selectedDoctorData ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 5,
                    borderRadius: '24px',
                    bgcolor: isDark ? "#0f172a" : "#ffffff",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"}`,
                    boxShadow: isDark ? "0 40px 80px rgba(0,0,0,0.5)" : "0 40px 80px rgba(15,23,42,0.08)",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 900, mb: 4 }}>Booking Summary</Typography>
                  
                  <Stack spacing={4}>
                    <Stack direction="row" spacing={3} alignItems="center">
                      <Avatar
                        src={selectedDoctorData.image}
                        sx={{ width: 80, height: 80, border: '4px solid rgba(116,214,197,0.2)' }}
                      >
                        {selectedDoctorData.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 900 }}>{selectedDoctorData.name}</Typography>
                        <Chip 
                          label={selectedDoctorData.specialization} 
                          size="small" 
                          sx={{ mt: 0.5, bgcolor: '#74d6c5', color: '#143145', fontWeight: 800 }} 
                        />
                      </Box>
                    </Stack>

                    <Box sx={{ p: 3, borderRadius: 4, bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.02)" }}>
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Consultation Fee</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 900 }}>$50.00</Typography>
                        </Stack>
                        <Box sx={{ height: 1, bgcolor: "rgba(255,255,255,0.08)" }} />
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Payment Mode</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>Online Secure</Typography>
                        </Stack>
                      </Stack>
                    </Box>

                    {(date || time) && (
                      <Box sx={{ px: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 800 }}>Schedule Details</Typography>
                        <Stack spacing={1.5}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <EventIcon sx={{ color: '#74d6c5' }} fontSize="small" />
                            <Typography variant="body2" fontWeight={600}>
                              {date ? new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Pick a date"}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <AccessTimeIcon sx={{ color: '#f2b66c' }} fontSize="small" />
                            <Typography variant="body2" fontWeight={600}>{time || "Set your time"}</Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              ) : (
                <Box sx={{ 
                  p: 6, 
                  borderRadius: '24px', 
                  border: '2px dashed rgba(116,214,197,0.2)',
                  textAlign: 'center' 
                }}>
                  <Typography color="text.secondary">Select a doctor to see your booking summary</Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* SECURE PAYMENT MODAL */}
        <Dialog 
          open={paymentDialogOpen} 
          onClose={() => !loading && setPaymentDialogOpen(false)}
          PaperProps={{ sx: { borderRadius: '28px', width: '100%', maxWidth: 480, mx: 2, overflowX: 'hidden', overflowY: 'auto', maxHeight: '92vh' } }}
        >
          <Box sx={{ position: 'relative' }}>
            {loading && !paymentSuccess && (
              <Box sx={{ position: 'absolute', inset: 0, zIndex: 10, bgcolor: isDark ? 'rgba(8,17,27,0.9)' : 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '28px' }}>
                <CircularProgress size={60} thickness={4} sx={{ color: '#74d6c5' }} />
                <Typography sx={{ mt: 3, fontWeight: 800, fontSize: '1.1rem' }}>Securing Transaction...</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Please do not close this window</Typography>
              </Box>
            )}

            {paymentSuccess && (
              <Box sx={{ position: 'absolute', inset: 0, zIndex: 11, bgcolor: isDark ? '#08111b' : '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', p: 5, borderRadius: '28px' }}>
                <Box sx={{ width: 100, height: 100, borderRadius: '50%', bgcolor: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                  <CheckCircleRoundedIcon sx={{ fontSize: 60, color: '#22c55e' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>Payment Successful!</Typography>
                <Typography color="text.secondary" sx={{ fontWeight: 500 }}>Your appointment has been confirmed.</Typography>
              </Box>
            )}

            <Box sx={{ p: { xs: 3, sm: 4 } }}>
              {/* Header */}
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg,#74d6c5,#f2b66c)' }}>
                    <PaymentRoundedIcon sx={{ color: '#143145', fontSize: '1.4rem' }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.2 }}>Secure Checkout</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total: <Box component="span" sx={{ fontWeight: 900, color: '#74d6c5' }}>$50.00</Box>
                    </Typography>
                  </Box>
                </Stack>
              </Stack>

              {/* SSL badge */}
              <Box sx={{
                mb: 3, px: 2, py: 1, borderRadius: 2.5,
                bgcolor: isDark ? 'rgba(34,197,94,0.08)' : 'rgba(34,197,94,0.06)',
                border: '1px solid rgba(34,197,94,0.2)',
                display: 'flex', alignItems: 'center', gap: 1
              }}>
                <CheckCircleRoundedIcon sx={{ color: '#22c55e', fontSize: '0.9rem' }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#22c55e', letterSpacing: 0.3 }}>
                  256-bit SSL Encrypted · PCI-DSS Compliant · Secure Payment
                </Typography>
              </Box>

              {/* Payment Method Tabs */}
              <Box sx={{ mb: 3, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', borderRadius: 3, p: 0.5, display: 'flex', gap: 0.5 }}>
                {[
                  { key: "card",   label: "💳  Card" },
                  { key: "upi",    label: "📱  UPI" },
                  { key: "wallet", label: "👜  Wallet" }
                ].map(({ key, label }) => (
                  <Box
                    key={key}
                    onClick={() => setPaymentMethod(key)}
                    sx={{
                      flex: 1, py: 1.3, textAlign: 'center', borderRadius: 2.5, cursor: 'pointer',
                      fontWeight: 800, fontSize: { xs: '0.68rem', sm: '0.78rem' },
                      bgcolor: paymentMethod === key ? (isDark ? '#74d6c5' : '#143145') : 'transparent',
                      color: paymentMethod === key ? (isDark ? '#143145' : 'white') : 'text.secondary',
                      transition: 'all 0.25s ease', userSelect: 'none',
                      '&:hover': {
                        bgcolor: paymentMethod === key
                          ? (isDark ? '#74d6c5' : '#143145')
                          : (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'),
                      }
                    }}
                  >
                    {label}
                  </Box>
                ))}
              </Box>

              <Box component="form" onSubmit={handleConfirmPayment}>
                {/* ── CARD ── */}
                {paymentMethod === "card" && (
                  <Stack spacing={2.5}>
                    {/* Visual credit card */}
                    <Box sx={{
                      p: { xs: 3, sm: 3.5 }, borderRadius: '20px',
                      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #163d45 100%)',
                      color: 'white', position: 'relative', overflow: 'hidden', minHeight: 160,
                      boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
                    }}>
                      <Box sx={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', bgcolor: 'rgba(116,214,197,0.12)' }} />
                      <Box sx={{ position: 'absolute', bottom: -50, left: -30, width: 130, height: 130, borderRadius: '50%', bgcolor: 'rgba(242,182,108,0.1)' }} />
                      {/* Chip */}
                      <Box sx={{ width: 42, height: 32, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 1.5, mb: 2.5, border: '1px solid rgba(255,255,255,0.15)' }} />
                      <Typography sx={{ fontSize: { xs: '0.95rem', sm: '1.2rem' }, letterSpacing: '0.18em', fontWeight: 700, fontFamily: 'monospace', mb: 2.5 }}>
                        {cardDetails.number}
                      </Typography>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                        <Box>
                          <Typography variant="caption" sx={{ opacity: 0.5, textTransform: 'uppercase', letterSpacing: 1, display: 'block', fontSize: '0.6rem' }}>Card Holder</Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>{cardDetails.name}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" sx={{ opacity: 0.5, textTransform: 'uppercase', letterSpacing: 1, display: 'block', fontSize: '0.6rem' }}>Expires</Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>{cardDetails.expiry}</Typography>
                        </Box>
                      </Stack>
                    </Box>

                    <TextField
                      required fullWidth label="Card Number" placeholder="1234  5678  9012  3456"
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value || '•••• •••• •••• ••••' })}
                      inputProps={{ maxLength: 19 }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={7}>
                        <TextField
                          required fullWidth label="Expiry" placeholder="MM / YY"
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value || 'MM/YY' })}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <TextField
                          required fullWidth label="CVC" placeholder="•••"
                          inputProps={{ maxLength: 4 }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />
                      </Grid>
                    </Grid>
                    <TextField
                      required fullWidth label="Cardholder Name"
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value || 'CARDHOLDER NAME' })}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                  </Stack>
                )}

                {/* ── UPI ── */}
                {paymentMethod === "upi" && (
                  <Stack spacing={3} alignItems="center" sx={{ py: 1 }}>
                    <Box sx={{
                      p: 2.5, bgcolor: 'white', borderRadius: 4,
                      border: '10px solid #f1f5f9', width: 170, height: 170,
                      display: 'grid', placeItems: 'center', position: 'relative',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.12)'
                    }}>
                      <Box sx={{ width: '100%', height: '100%', background: 'repeating-linear-gradient(45deg, #0f172a, #0f172a 2px, transparent 2px, transparent 10px)', opacity: 0.85 }} />
                      <Box sx={{ position: 'absolute', bgcolor: 'white', px: 1, py: 0.5, borderRadius: 1 }}>
                        <Typography sx={{ fontWeight: 900, color: '#143145', fontSize: '0.65rem', letterSpacing: 0.5 }}>SCAN TO PAY</Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, textAlign: 'center' }}>
                      Scan with any UPI app or enter your UPI ID below
                    </Typography>
                    <TextField
                      fullWidth label="UPI ID" placeholder="yourname@okaxis"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                  </Stack>
                )}

                {/* ── WALLET ── */}
                {paymentMethod === "wallet" && (
                  <Stack spacing={1.5} sx={{ py: 1 }}>
                    {[
                      { name: "Paytm",       color: "#00b9f1", emoji: "🔵" },
                      { name: "Google Pay",   color: "#4285f4", emoji: "🔴" },
                      { name: "PhonePe",      color: "#5f259f", emoji: "🟣" },
                      { name: "Amazon Pay",   color: "#ff9900", emoji: "🟡" },
                    ].map((w) => (
                      <Box
                        key={w.name}
                        sx={{
                          p: 2.2, borderRadius: 3,
                          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          cursor: 'pointer', transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: w.color,
                            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                            transform: 'translateX(4px)',
                          }
                        }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Typography sx={{ fontSize: '1.2rem' }}>{w.emoji}</Typography>
                          <Typography fontWeight={700}>{w.name}</Typography>
                        </Stack>
                        <Box sx={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${w.color}` }} />
                      </Box>
                    ))}
                  </Stack>
                )}

                {/* Order summary strip */}
                <Box sx={{
                  mt: 3, p: 2, borderRadius: 3,
                  bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)'}`,
                }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PersonIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>Consultation Fee</Typography>
                    </Stack>
                    <Typography variant="body1" fontWeight={900} sx={{ color: '#74d6c5' }}>$50.00</Typography>
                  </Stack>
                </Box>

                <Button
                  type="submit" fullWidth variant="contained"
                  sx={{
                    mt: 2.5, py: 2, borderRadius: 3.5, fontWeight: 900, fontSize: '1rem',
                    background: 'linear-gradient(90deg, #74d6c5, #f2b66c)',
                    color: '#143145', letterSpacing: 0.5,
                    boxShadow: '0 8px 30px rgba(116,214,197,0.3)',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 14px 40px rgba(116,214,197,0.4)' }
                  }}
                >
                  🔒 &nbsp;Pay $50.00 · Confirm Booking
                </Button>
                <Button
                  fullWidth variant="text" disabled={loading}
                  sx={{ mt: 0.5, color: 'text.secondary', fontWeight: 700, borderRadius: 3 }}
                  onClick={() => setPaymentDialogOpen(false)}
                >
                  Cancel
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
