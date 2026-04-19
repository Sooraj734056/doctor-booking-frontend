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
          PaperProps={{ sx: { borderRadius: '32px', width: '100%', maxWidth: 480, overflowX: 'hidden', overflowY: 'auto', maxHeight: '90vh' } }}
        >
          <Box sx={{ position: 'relative' }}>
            {loading && !paymentSuccess && (
              <Box sx={{ position: 'absolute', inset: 0, zIndex: 10, bgcolor: isDark ? 'rgba(8,17,27,0.85)' : 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={60} thickness={4} />
                <Typography sx={{ mt: 3, fontWeight: 800 }}>Securing Transaction...</Typography>
              </Box>
            )}

            {paymentSuccess && (
              <Box sx={{ position: 'absolute', inset: 0, zIndex: 11, bgcolor: isDark ? '#08111b' : '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', p: 4 }}>
                <Avatar sx={{ bgcolor: '#22c55e', width: 100, height: 100, mb: 3 }}>
                  <CheckCircleRoundedIcon sx={{ fontSize: 60 }} />
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>Successful!</Typography>
                <Typography color="text.secondary">Your appointment is now confirmed.</Typography>
              </Box>
            )}

            <Box sx={{ p: { xs: 3, md: 5 } }}>
              <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 4 }}>
                <Avatar sx={{ bgcolor: "#22c55e", width: 50, height: 50 }}>
                  <PaymentRoundedIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 900 }}>Finalize Securely</Typography>
                  <Typography variant="body2" color="text.secondary">Amount: <Box component="span" sx={{ fontWeight: 900, color: 'text.primary' }}>$50.00</Box></Typography>
                </Box>
              </Stack>

              <Box sx={{ mb: 4, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', borderRadius: 4, p: 0.5 }}>
                <Grid container>
                  {["card", "upi", "wallet"].map((method) => (
                    <Grid item xs={4} key={method}>
                      <ButtonBase
                        onClick={() => setPaymentMethod(method)}
                        sx={{
                          display: 'block',
                          width: '100%',
                          py: 1.5,
                          textAlign: 'center',
                          borderRadius: 3.5,
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                          bgcolor: paymentMethod === method ? (isDark ? '#74d6c5' : '#143145') : 'transparent',
                          color: paymentMethod === method ? (isDark ? '#143145' : 'white') : 'text.secondary',
                          transition: 'all 0.3s ease',
                          "&:hover": {
                            bgcolor: paymentMethod === method ? (isDark ? '#74d6c5' : '#143145') : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'),
                          }
                        }}
                      >
                        {method}
                      </ButtonBase>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Box component="form" onSubmit={handleConfirmPayment}>
                {paymentMethod === "card" && (
                  <Stack spacing={3}>
                    {/* Card Mockup */}
                    <Box sx={{ 
                      mb: 2, p: 4, borderRadius: '24px', 
                      background: isDark ? 'linear-gradient(135deg, #050b12 0%, #102330 100%)' : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
                      color: 'white', position: 'relative', overflow: 'hidden',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                    }}>
                      <Typography sx={{ fontSize: '1.4rem', letterSpacing: '0.15em', mb: 4, fontWeight: 700, fontFamily: 'monospace' }}>
                        {cardDetails.number || "•••• •••• •••• ••••"}
                      </Typography>
                      <Stack direction="row" justifyContent="space-between">
                        <Box>
                          <Typography variant="caption" sx={{ opacity: 0.5, display: 'block', textTransform: 'uppercase' }}>Holder</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>{cardDetails.name.toUpperCase() || "NAME SURNAME"}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" sx={{ opacity: 0.5, display: 'block', textTransform: 'uppercase' }}>Expiry</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>{cardDetails.expiry || "12/28"}</Typography>
                        </Box>
                      </Stack>
                    </Box>

                    <TextField 
                      required fullWidth label="Card Number" 
                      onChange={(e) => setCardDetails({...cardDetails, number: e.target.value || "•••• •••• •••• ••••"})}
                      inputProps={{ maxLength: 19 }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={7}>
                        <TextField 
                          required fullWidth label="Expiry Date" placeholder="MM / YY" 
                          onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value || "MM/YY"})}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <TextField 
                          required fullWidth label="CVC" placeholder="•••" 
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                        />
                      </Grid>
                    </Grid>
                    <TextField 
                      required fullWidth label="Cardholder Name" 
                      onChange={(e) => setCardDetails({...cardDetails, name: e.target.value || "CARDHOLDER NAME"})}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                    />
                  </Stack>
                )}

                {paymentMethod === "upi" && (
                  <Stack spacing={4} alignItems="center" sx={{ py: 2 }}>
                    <Box sx={{ 
                      p: 3, bgcolor: 'white', borderRadius: 4, 
                      border: '10px solid #f1f5f9', width: 200, height: 200,
                      display: 'grid', placeItems: 'center', position: 'relative'
                    }}>
                      <Box sx={{ width: '100%', height: '100%', background: 'repeating-linear-gradient(45deg, #0f172a, #0f172a 2px, transparent 2px, transparent 10px)', opacity: 0.8 }} />
                      <Typography sx={{ position: 'absolute', bgcolor: 'white', px: 1, fontWeight: 900, color: '#143145', fontSize: '0.7rem' }}>SCAN TO PAY</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">Scan QR or enter UPI ID below</Typography>
                    <TextField 
                      fullWidth label="Enter UPI ID" placeholder="user@okaxis" 
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                    />
                  </Stack>
                )}

                {paymentMethod === "wallet" && (
                  <Stack spacing={1.5} sx={{ py: 1 }}>
                    {["Paytm", "Google Pay", "PhonePe", "Amazon Pay"].map((wallet) => (
                      <Box 
                        key={wallet}
                        sx={{ 
                          p: 2.5, borderRadius: 3, border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                          "&:hover": { bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }
                        }}
                      >
                        <Typography fontWeight={700}>{wallet}</Typography>
                        <Box sx={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #74d6c5' }} />
                      </Box>
                    ))}
                  </Stack>
                )}

                <Button 
                  type="submit" 
                  fullWidth 
                  variant="contained" 
                  sx={{ 
                    mt: 4, py: 2.2, borderRadius: 4, fontWeight: 900, fontSize: '1.2rem', 
                    background: 'linear-gradient(90deg, #74d6c5, #f2b66c)', 
                    color: '#143145', boxShadow: '0 8px 30px rgba(116,214,197,0.3)',
                    "&:hover": { transform: 'translateY(-2px)' }
                  }}
                >
                  Pay & Confirm Booking
                </Button>
                <Button 
                  fullWidth 
                  variant="text" 
                  disabled={loading}
                  sx={{ mt: 1, color: 'text.secondary', fontWeight: 700 }}
                  onClick={() => setPaymentDialogOpen(false)}
                >
                  Cancel Payment
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
