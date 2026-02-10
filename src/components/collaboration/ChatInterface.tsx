import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  Divider,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import type { ChatMessage } from '../../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  currentUserId: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  currentUserId,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card elevation={2}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Team Chat</Typography>
        </Box>

        <Box
          sx={{
            height: 400,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {messages.map((msg) => {
            const isCurrentUser = msg.userId === currentUserId;
            return (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  flexDirection: isCurrentUser ? 'row-reverse' : 'row',
                  gap: 1,
                }}
              >
                <Avatar
                  src={msg.userAvatar}
                  alt={msg.userName}
                  sx={{ width: 32, height: 32 }}
                >
                  {msg.userName[0]}
                </Avatar>
                <Box sx={{ maxWidth: '70%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 1,
                      mb: 0.5,
                      flexDirection: isCurrentUser ? 'row-reverse' : 'row',
                    }}
                  >
                    <Typography variant="caption" fontWeight="medium">
                      {msg.userName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatTime(msg.timestamp)}
                    </Typography>
                    {msg.isOnline && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: 'success.main',
                        }}
                      />
                    )}
                  </Box>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      backgroundColor: isCurrentUser ? 'primary.main' : 'grey.100',
                      color: isCurrentUser ? 'primary.contrastText' : 'text.primary',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2">{msg.message}</Typography>
                  </Paper>
                </Box>
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </Box>

        <Divider />

        <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={3}
          />
          <IconButton color="primary" onClick={handleSend} disabled={!newMessage.trim()}>
            <SendIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};
