import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import { fetchConversations } from "../api";

function Conversations() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await fetchConversations();
      setConversations(response.data);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationClick = (userId) => {
    navigate(`/messages/${userId}`);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <Typography>Loading conversations...</Typography>
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
            <ChatRoundedIcon />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                Messages
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.76)" }}>
                Recent conversations in one clean inbox.
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ borderRadius: 4, overflow: "hidden", bgcolor: "background.paper" }} elevation={0}>
          {conversations.length === 0 ? (
            <Box sx={{ p: 5, textAlign: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                No conversations yet
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Start a message from a doctor profile to create your first conversation.
              </Typography>
              <Button variant="contained" onClick={() => navigate("/doctors")}>
                Browse doctors
              </Button>
            </Box>
          ) : (
            <List disablePadding>
              {conversations.map((conv, index) => (
                <React.Fragment key={conv.user._id}>
                  <ListItemButton
                    onClick={() => handleConversationClick(conv.user._id)}
                    sx={{ py: 2, px: 3 }}
                  >
                    <Badge badgeContent={conv.unread} color="primary" overlap="circular">
                      <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                        {conv.user.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </Badge>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 800 }}>{conv.user.name}</Typography>}
                      secondary={
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {conv.lastMessage}
                        </Typography>
                      }
                    />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(conv.timestamp).toLocaleDateString()}
                    </Typography>
                  </ListItemButton>
                  {index < conversations.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default Conversations;
