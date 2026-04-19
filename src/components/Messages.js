import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { fetchConversation, sendMessage, markMessagesAsRead } from "../api";

function Messages() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversation = useCallback(async () => {
    try {
      const response = await fetchConversation(userId);
      setMessages(response.data);
      await markMessagesAsRead(userId);
    } catch (error) {
      console.error("Error loading conversation:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadConversation();
  }, [loadConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await sendMessage({ to: userId, message: newMessage });
      setNewMessage("");
      loadConversation();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <Typography>Loading messages...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 4, md: 6 },
        background: isDark
          ? "linear-gradient(180deg, #08111b 0%, #0d1726 100%)"
          : "linear-gradient(180deg, #f3fbf8 0%, #eef4ff 100%)",
      }}
    >
      <Container maxWidth="md">
        <Paper
          sx={{
            borderRadius: 5,
            overflow: "hidden",
            bgcolor: "background.paper",
            border: `1px solid ${isDark ? "rgba(173,196,214,0.12)" : "rgba(19,99,223,0.08)"}`,
          }}
        >
          <Box
            sx={{
              p: 3,
              color: "white",
              background:
                isDark
                  ? "linear-gradient(135deg, rgba(11,29,42,0.96), rgba(22,61,69,0.92))"
                  : "linear-gradient(135deg, rgba(10,24,36,0.96), rgba(18,74,82,0.92))",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Messages
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.76)" }}>
              Chat with doctors in a calm, focused conversation view.
            </Typography>
          </Box>

          <Box sx={{ p: 2, maxHeight: "62vh", overflowY: "auto", bgcolor: isDark ? "rgba(8,17,27,0.72)" : "rgba(255,255,255,0.6)" }}>
            <Stack spacing={1.5}>
              {messages.map((msg) => {
                const isIncoming = String(msg.from) === String(userId);
                return (
                  <Stack
                    key={msg._id}
                    direction="row"
                    justifyContent={isIncoming ? "flex-start" : "flex-end"}
                  >
                    <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ maxWidth: "82%" }}>
                      {isIncoming && (
                        <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
                          U
                        </Avatar>
                      )}
                      <Paper
                        sx={{
                          p: 1.5,
                          borderRadius: 3,
                          bgcolor: isIncoming ? (isDark ? "rgba(14,24,37,0.96)" : "white") : "primary.main",
                          color: isIncoming ? "text.primary" : (isDark ? "#08111b" : "white"),
                          boxShadow: isDark ? "0 10px 24px rgba(0,0,0,0.22)" : "0 10px 24px rgba(15,23,42,0.08)",
                        }}
                        elevation={0}
                      >
                        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                          {msg.message}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7, display: "block", mt: 0.8 }}>
                          {new Date(msg.timestamp).toLocaleString()}
                        </Typography>
                      </Paper>
                      {!isIncoming && (
                        <Avatar sx={{ bgcolor: "secondary.main", width: 36, height: 36 }}>
                          Y
                        </Avatar>
                      )}
                    </Stack>
                  </Stack>
                );
              })}
            </Stack>
            <div ref={messagesEndRef} />
          </Box>

          <Box sx={{ p: 2, borderTop: "1px solid rgba(19,99,223,0.08)" }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField
                fullWidth
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                multiline
                minRows={1}
                maxRows={4}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                sx={{
                  minWidth: { xs: "100%", sm: 140 },
                  background: "linear-gradient(90deg, #74d6c5, #f2b66c)",
                  color: "#143145",
                }}
              >
                Send
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Messages;
