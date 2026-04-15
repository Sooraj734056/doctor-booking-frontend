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
} from "@mui/material";
import { fetchConversation, sendMessage, markMessagesAsRead } from "../api";

function Messages() {
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
        background: "linear-gradient(180deg, rgba(247,251,255,1) 0%, rgba(233,243,252,1) 100%)",
      }}
    >
      <Container maxWidth="md">
        <Paper
          sx={{
            borderRadius: 5,
            overflow: "hidden",
            bgcolor: "background.paper",
            border: "1px solid rgba(19,99,223,0.08)",
          }}
        >
          <Box
            sx={{
              p: 3,
              color: "white",
              background:
                "linear-gradient(135deg, rgba(7,18,39,0.96), rgba(13,110,139,0.92))",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Messages
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.76)" }}>
              Chat with doctors in a calm, focused conversation view.
            </Typography>
          </Box>

          <Box sx={{ p: 2, maxHeight: "62vh", overflowY: "auto", bgcolor: "rgba(255,255,255,0.6)" }}>
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
                          bgcolor: isIncoming ? "white" : "primary.main",
                          color: isIncoming ? "text.primary" : "white",
                          boxShadow: "0 10px 24px rgba(15,23,42,0.08)",
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
                  background: "linear-gradient(90deg, #67e8f9, #22c55e)",
                  color: "#04111f",
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
