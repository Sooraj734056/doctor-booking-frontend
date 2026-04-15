import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ArrowForwardRounded,
  CalendarMonthRounded,
  ChatRounded,
  FavoriteRounded,
  LocalHospitalRounded,
  PsychologyAltRounded,
  ShieldRounded,
  StarRounded,
  VerifiedRounded,
  ScoreRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const stats = [
  { value: "15k+", label: "Appointments booked" },
  { value: "500+", label: "Verified doctors" },
  { value: "24/7", label: "Guidance available" },
  { value: "98%", label: "Patient satisfaction" },
];

const features = [
  {
    icon: <LocalHospitalRounded />,
    title: "Find trusted doctors",
    text: "Browse specialists with smooth filters, richer profiles, and faster discovery.",
  },
  {
    icon: <CalendarMonthRounded />,
    title: "Book in seconds",
    text: "Pick a doctor, choose a slot, and confirm appointments without friction.",
  },
  {
    icon: <PsychologyAltRounded />,
    title: "AI health guidance",
    text: "Use the AI assistant to get triage-style educational guidance before you book.",
  },
  {
    icon: <ChatRounded />,
    title: "Secure messaging",
    text: "Keep all patient-doctor conversation inside one clean, focused inbox.",
  },
];

const highlights = [
  "Smart health triage",
  "Premium appointment flow",
  "Conversation center",
  "Responsive mobile-first UI",
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Patient",
    quote: "The booking flow feels premium and the AI guidance helped me understand what to do next.",
  },
  {
    name: "Dr. Michael Chen",
    role: "Cardiologist",
    quote: "Everything feels faster, cleaner, and more professional than a typical health app.",
  },
  {
    name: "Emma Davis",
    role: "Patient",
    quote: "The design is beautiful on mobile, and the AI assistant is genuinely useful.",
  },
];

function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <Box sx={{ overflow: "hidden" }}>
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: "auto", md: "92vh" },
          py: { xs: 6, md: 10 },
          background:
            "radial-gradient(circle at top left, rgba(103,232,249,0.18), transparent 30%), radial-gradient(circle at 85% 20%, rgba(19,99,223,0.16), transparent 26%), linear-gradient(180deg, rgba(7,18,39,0.98) 0%, rgba(11,40,76,0.96) 100%)",
          color: "white",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(5,13,27,0.25), rgba(5,13,27,0.7)), url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1950&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.32,
          }}
        />

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>
                <Chip
                  icon={<ShieldRounded sx={{ color: "#67e8f9 !important" }} />}
                  label="Secure, modern, AI-assisted healthcare"
                  sx={{
                    width: "fit-content",
                    bgcolor: "rgba(255,255,255,0.1)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.14)",
                  }}
                />
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2.2rem", sm: "3.5rem", md: "5.5rem" },
                    lineHeight: { xs: 1.2, md: 1.15 },
                    letterSpacing: "-0.02em",
                    wordBreak: "break-word",
                  }}
                >
                  {t('hero_title') || "Healthcare that feels calm, smart, and premium."}
                </Typography>
                <Typography
                  sx={{
                    maxWidth: 680,
                    width: "100%",
                    fontSize: { xs: "1rem", md: "1.2rem" },
                    fontWeight: 500,
                    color: "#ffffff",
                    lineHeight: { xs: 1.6, md: 1.8 },
                    opacity: { xs: 0.9, md: 1 },
                  }}
                >
                  {t('hero_subtitle') || "Discover doctors, book appointments, chat securely, and use AI-powered guidance to decide your next step with confidence."}
                </Typography>


                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate(isLoggedIn ? "/doctors" : "/register")}
                    endIcon={<ArrowForwardRounded />}
                    sx={{
                      px: 3.5,
                      py: 1.4,
                      background: "linear-gradient(90deg, #67e8f9, #22c55e)",
                      color: "#05131f",
                      boxShadow: "0 16px 40px rgba(34,197,94,0.25)",
                    }}
                  >
                    {isLoggedIn ? t('explore_doctors') : "Get started"}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate("/ai-assistant")}
                    sx={{
                      px: 3.5,
                      py: 1.4,
                      borderColor: "rgba(255,255,255,0.42)",
                      color: "white",
                      bgcolor: "rgba(255,255,255,0.06)",
                    }}
                  >
                    {t('try_ai')}
                  </Button>
                </Stack>

                <Stack direction="row" spacing={1.2} flexWrap="wrap" sx={{ gap: 1 }}>
                  {highlights.map((item) => (
                    <Chip
                      key={item}
                      label={item}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.08)",
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                  ))}
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 5,
                  background: "rgba(8,18,34,0.52)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 22px 50px rgba(0,0,0,0.28)",
                }}
              >
                <Stack spacing={2.2}>
                  <Stack direction="row" spacing={1.4} alignItems="center">
                    <Avatar sx={{ bgcolor: "rgba(103,232,249,0.14)", color: "#67e8f9" }}>
                      <FavoriteRounded />
                    </Avatar>
                    <Box>
                      <Typography fontWeight={800}>Today’s care flow</Typography>
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                        AI triage + doctor booking + live chat
                      </Typography>
                    </Box>
                  </Stack>
                  <Box sx={{ display: "grid", gap: 1.4 }}>
                    {[
                      ["1", "Describe symptoms in AI assistant"],
                      ["2", "Review possible urgency and next steps"],
                      ["3", "Book the right doctor instantly"],
                    ].map(([step, text]) => (
                      <Paper
                        key={step}
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          bgcolor: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "white",
                        }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Chip label={step} sx={{ bgcolor: "#67e8f9", color: "#04111f", fontWeight: 800 }} />
                          <Typography variant="body2">{text}</Typography>
                        </Stack>
                      </Paper>
                    ))}
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 7, md: 10 } }}>
        <Grid container spacing={2} justifyContent="center">
          {stats.map((stat) => (
            <Grid item xs={6} md={3} key={stat.label}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  border: "1px solid rgba(19,99,223,0.08)",
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.main" }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ py: { xs: 4, md: 8 }, background: theme.palette.mode === 'dark' ? "linear-gradient(180deg, rgba(15,23,42,0.55), rgba(30,58,138,0.25))" : "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(219,240,255,0.45))" }}>
        <Container maxWidth="xl">
          <Stack spacing={1.5} sx={{ mb: 4 }} alignItems="center" textAlign="center">
            <Typography variant="overline" sx={{ letterSpacing: "0.24em", color: "secondary.main", fontWeight: 800 }}>
              Platform highlights
            </Typography>
            <Typography variant="h3" sx={{ fontSize: { xs: "2.1rem", md: "3rem" } }}>
              Designed to feel modern, not generic.
            </Typography>
            <Typography sx={{ maxWidth: 760, color: "text.secondary" }}>
              We turned the app into a more polished health product with stronger hierarchy, softer surfaces, richer visuals, and a signature AI feature.
            </Typography>
          </Stack>

          <Grid container spacing={3} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={feature.title}>
                <Card
                  sx={{
                    p: 3,
                    minHeight: 240,
                    borderRadius: 4,
                    position: "relative",
                    overflow: "hidden",
                    border: "1px solid rgba(19,99,223,0.08)",
                    bgcolor: "background.paper",
                    transition: "transform 180ms ease, box-shadow 180ms ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 20px 38px rgba(15,23,42,0.12)",
                    },
                    backdropFilter: "blur(12px)",
                    backgroundColor: theme.palette.mode === 'dark' ? "rgba(30,41,59,0.72)" : "rgba(255, 255, 255, 0.72)",
                  }}
                >
                  <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                    <Avatar
                      sx={{
                        mb: 2,
                        mx: "auto",
                        bgcolor: "rgba(19,99,223,0.1)",
                        color: "primary.main",
                        width: 54,
                        height: 54,
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 800 }}>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {feature.text}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>
        <Grid container spacing={3} alignItems="stretch" justifyContent="center">
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 5,
                height: "100%",
                bgcolor: "background.paper",
                border: "1px solid rgba(19,99,223,0.08)",
                textAlign: "center"
              }}
            >
              <Typography variant="h3" sx={{ mb: 2, fontSize: { xs: "2rem", md: "2.6rem" }, fontWeight: 800 }}>
                What users will notice immediately
              </Typography>
              <Typography sx={{ color: "text.secondary", maxWidth: 700, mb: 4, mx: "auto" }}>
                Better spacing, calmer surfaces, stronger contrast, smoother cards, and a more distinct health-tech identity across the whole product.
              </Typography>
              <Stack spacing={2} sx={{ maxWidth: 450, mx: "auto" }}>
                {[
                  "Premium glassy surfaces instead of flat blocks",
                  "More readable hierarchy and better typography",
                  "Clear AI call-to-action across the app",
                  "Responsive layout designed for desktop and mobile",
                ].map((item) => (
                  <Stack key={item} direction="row" spacing={1.5} alignItems="center">
                    <VerifiedRounded color="secondary" />
                    <Typography fontWeight={500}>{item}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 5,
                height: "100%",
                bgcolor: "linear-gradient(180deg, rgba(7,18,39,0.96), rgba(11,35,66,0.95))",
                color: "white",
                background:
                  "linear-gradient(180deg, rgba(7,18,39,0.96), rgba(11,35,66,0.95))",
                border: "1px solid rgba(255,255,255,0.08)",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <Typography variant="h4" sx={{ mb: 2, fontSize: { xs: "1.7rem", md: "2.2rem" }, fontWeight: 800 }}>
                Ready to try the new flow?
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.78)", mb: 4, lineHeight: 1.8, maxWidth: 400, mx: "auto" }}>
                Start with AI guidance, then move directly to the best doctor and booking flow in one smooth experience.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => navigate(isLoggedIn ? "/ai-assistant" : "/register")}
                sx={{
                  py: 1.8,
                  background: "linear-gradient(90deg, #67e8f9, #22c55e)",
                  color: "#04111f",
                  fontWeight: 800,
                  fontSize: "1.1rem"
                }}
              >
                {isLoggedIn ? "Open AI Assistant" : "Create account"}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ py: { xs: 7, md: 10 }, background: theme.palette.mode === 'dark' ? "transparent" : "linear-gradient(180deg, rgba(7,18,39,0.04), rgba(7,18,39,0.08))" }}>
        <Container maxWidth="xl">
          <Stack spacing={1.5} sx={{ mb: 6 }} alignItems="center" textAlign="center">
            <Typography variant="overline" sx={{ letterSpacing: "0.24em", color: "secondary.main", fontWeight: 800 }}>
              User stories
            </Typography>
            <Typography variant="h3" sx={{ fontSize: { xs: "2rem", md: "3.5rem" }, fontWeight: 800 }}>
              The app now feels like a product people trust.
            </Typography>
          </Stack>
          <Grid container spacing={3} justifyContent="center">
            {testimonials.map((item) => (
              <Grid item xs={12} md={4} key={item.name}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    minHeight: 220,
                    bgcolor: "background.paper",
                    border: "1px solid rgba(19,99,223,0.08)",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar sx={{ bgcolor: "primary.main" }}>{item.name.charAt(0)}</Avatar>
                    <Box>
                      <Typography fontWeight={800}>{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.role}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={0.5} sx={{ mb: 2 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarRounded key={star} sx={{ color: "#f59e0b" }} />
                    ))}
                  </Stack>
                  <Typography sx={{ color: "text.secondary", lineHeight: 1.9 }}>
                    {item.quote}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
