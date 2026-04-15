import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PersonSearchRoundedIcon from "@mui/icons-material/PersonSearchRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAiHealthGuidance } from "../api";

const quickPrompts = [
  "Fever + body pain for 2 days",
  "Cough and sore throat for 1 week",
  "Headache and dizziness after work stress",
  "Mild chest discomfort while climbing stairs",
];

const urgencyColor = {
  Low: "success",
  Medium: "warning",
  High: "error",
};

function AIAssistant() {
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [age, setAge] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [listening, setListening] = useState(false);
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = i18n.language === "hi" ? "hi-IN" : "en-IN";
    
    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSymptoms((prev) => (prev ? prev + ", " + transcript : transcript));
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    
    recognition.start();
  };

  const sourceLabel = useMemo(() => {
    if (!result?.source) return "";
    return result.source === "openai" ? "AI-Powered Analysis" : "Smart Fallback Analysis";
  }, [result]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!symptoms.trim()) {
      setError("Please enter symptoms before analysis.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await getAiHealthGuidance({
        symptoms: symptoms.trim(),
        duration: duration.trim(),
        age: age.trim(),
        notes: notes.trim(),
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch AI guidance right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        py: { xs: 3, md: 5 },
        px: 2,
        background:
          "radial-gradient(circle at 10% 20%, rgba(0,188,212,0.15), transparent 35%), radial-gradient(circle at 80% 0%, rgba(255,112,67,0.15), transparent 30%), linear-gradient(180deg, #f4fbff 0%, #eef6ff 45%, #f7fbff 100%)",
      }}
    >
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            p: { xs: 2.5, md: 4 },
            mb: 3,
            background:
              "linear-gradient(130deg, rgba(13,71,161,0.95), rgba(0,96,100,0.9))",
            color: "white",
            boxShadow: "0 20px 40px rgba(10,40,90,0.2)",
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
            <AutoAwesomeIcon />
            <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: "1.5rem", md: "2rem" } }}>
              AI Health Assistant
            </Typography>
          </Stack>
          <Typography sx={{ opacity: 0.9, maxWidth: 760 }}>
            Describe symptoms and get instant educational triage guidance with urgency hints and next recommended actions.
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: "1px solid rgba(25,118,210,0.2)",
                background: "rgba(255,255,255,0.86)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Patient Input
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2, gap: 1 }}>
                {quickPrompts.map((prompt) => (
                  <Chip
                    key={prompt}
                    label={prompt}
                    onClick={() => setSymptoms(prompt)}
                    sx={{
                      borderRadius: "10px",
                      bgcolor: "rgba(25,118,210,0.1)",
                      "&:hover": { bgcolor: "rgba(25,118,210,0.2)" },
                    }}
                  />
                ))}
              </Stack>

              <Box component="form" onSubmit={onSubmit}>
                <Stack spacing={2}>
                  <TextField
                    label="Symptoms"
                    multiline
                    minRows={3}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Example: fever, cough, sore throat"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
                            onClick={handleVoiceInput} 
                            color={listening ? "error" : "primary"}
                            sx={{ 
                              bgcolor: listening ? "rgba(239,68,68,0.1)" : "rgba(37,99,235,0.1)",
                              transition: 'all 0.2s',
                              animation: listening ? 'pulse 1.5s infinite' : 'none'
                            }}
                          >
                            <MicRoundedIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <TextField
                    label="Duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Example: 2 days"
                  />
                  <TextField
                    label="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Example: 29"
                  />
                  <TextField
                    label="Additional Notes"
                    multiline
                    minRows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any allergies, medicine history, other context"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <PsychologyAltIcon />}
                    sx={{
                      py: 1.2,
                      borderRadius: 2.5,
                      fontWeight: 700,
                      textTransform: "none",
                      background: "linear-gradient(90deg, #006064, #00838f)",
                    }}
                  >
                    {loading ? "Analyzing..." : "Analyze Symptoms"}
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                minHeight: 540,
                border: "1px solid rgba(25,118,210,0.2)",
                background: "rgba(255,255,255,0.86)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Guidance
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              {!result && !loading && (
                <Alert severity="info">
                  Enter symptoms and click <strong>Analyze Symptoms</strong> to get guidance.
                </Alert>
              )}

              {result && (
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Chip
                      icon={<WarningAmberIcon />}
                      label={`Urgency: ${result.urgency || "Medium"}`}
                      color={urgencyColor[result.urgency] || "warning"}
                    />
                    {sourceLabel && <Chip label={sourceLabel} variant="outlined" />}
                  </Stack>

                  <Paper sx={{ p: 2, borderRadius: 2.5, bgcolor: "#f8fbff" }} elevation={0}>
                    <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Summary</Typography>
                    <Typography variant="body2">{result.summary}</Typography>
                  </Paper>

                  <Paper sx={{ p: 2, borderRadius: 2.5, bgcolor: "#f8fbff" }} elevation={0}>
                    <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Possible Causes</Typography>
                    {(result.possibleCauses || []).map((item) => (
                      <Typography key={item} variant="body2">• {item}</Typography>
                    ))}
                  </Paper>

                  <Paper sx={{ p: 2, borderRadius: 2.5, bgcolor: "#f8fbff" }} elevation={0}>
                    <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Next Steps</Typography>
                    {(result.nextSteps || []).map((item) => (
                      <Typography key={item} variant="body2">• {item}</Typography>
                    ))}
                  </Paper>

                  <Paper sx={{ p: 2, borderRadius: 2.5, bgcolor: "#fff7f7" }} elevation={0}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <LocalHospitalIcon color="error" fontSize="small" />
                      <Typography sx={{ fontWeight: 700 }}>Warning Signs</Typography>
                    </Stack>
                    {(result.warningSigns || []).map((item) => (
                      <Typography key={item} variant="body2">• {item}</Typography>
                    ))}
                  </Paper>

                  <Alert severity="warning">{result.disclaimer}</Alert>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/doctors')}
                    startIcon={<PersonSearchRoundedIcon />}
                    sx={{ 
                      mt: 1, 
                      py: 1.5, 
                      borderRadius: 3,
                      background: 'linear-gradient(90deg, #1e3a8a, #3b82f6)', 
                      color: 'white', 
                      fontWeight: 800 
                    }}
                  >
                    Find a Recommended Specialist
                  </Button>
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default AIAssistant;
