import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
  Button
} from '@mui/material';
import { fetchConversations } from '../api';

const Conversations = () => {
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
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationClick = (userId) => {
    navigate(`/messages/${userId}`);
  };

  if (loading) {
    return <Typography>Loading conversations...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Messages
      </Typography>

      {conversations.length === 0 ? (
        <Typography>No conversations yet.</Typography>
      ) : (
        <List>
          {conversations.map((conv) => (
            <ListItem
              key={conv.user._id}
              button
              onClick={() => handleConversationClick(conv.user._id)}
              sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}
            >
              <ListItemAvatar>
                <Badge badgeContent={conv.unread} color="primary">
                  <Avatar>{conv.user.name.charAt(0).toUpperCase()}</Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={conv.user.name}
                secondary={`${conv.lastMessage} • ${new Date(conv.timestamp).toLocaleDateString()}`}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Button variant="contained" onClick={() => navigate('/doctors')} sx={{ mt: 2 }}>
        Start New Conversation
      </Button>
    </Container>
  );
};

export default Conversations;
