import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Paper,
  Box,
  Avatar
} from '@mui/material';
import { fetchConversation, sendMessage, markMessagesAsRead } from '../api';

const Messages = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversation = useCallback(async () => {
    try {
      const response = await fetchConversation(userId);
      setMessages(response.data);
      // Mark messages as read
      await markMessagesAsRead(userId);
    } catch (error) {
      console.error('Error loading conversation:', error);
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
      setNewMessage('');
      // Reload conversation to show new message
      loadConversation();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (loading) {
    return <Typography>Loading messages...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Messages
      </Typography>

      <Paper sx={{ height: '60vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          <List>
            {messages.map((msg) => (
              <ListItem key={msg._id} sx={{ justifyContent: msg.from === userId ? 'flex-start' : 'flex-end' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: '70%' }}>
                  <Avatar sx={{ mr: 1 }}>
                    {msg.from === userId ? 'U' : 'Y'}
                  </Avatar>
                  <Paper sx={{ p: 1, bgcolor: msg.from === userId ? 'grey.100' : 'primary.main', color: msg.from === userId ? 'text.primary' : 'white' }}>
                    <ListItemText
                      primary={msg.message}
                      secondary={new Date(msg.timestamp).toLocaleString()}
                    />
                  </Paper>
                </Box>
              </ListItem>
            ))}
          </List>
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ mr: 1 }}
          />
          <Button variant="contained" onClick={handleSendMessage} sx={{ mt: 1 }}>
            Send
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Messages;
