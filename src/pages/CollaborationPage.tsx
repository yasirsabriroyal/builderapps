import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ChatInterface } from '../components/collaboration/ChatInterface';
import { TaskBoard } from '../components/collaboration/TaskBoard';
import { TeamMembers } from '../components/collaboration/TeamMembers';
import { ActivityFeed } from '../components/collaboration/ActivityFeed';
import api from '../services/api';
import type {
  ChatMessage,
  Task,
  TaskStatus,
  TeamMember,
  ActivityNotification,
} from '../types';

export const CollaborationPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [notifications, setNotifications] = useState<ActivityNotification[]>([]);
  const currentUserId = 'user-1'; // TODO: Get from auth context

  useEffect(() => {
    fetchCollaborationData();
  }, []);

  const fetchCollaborationData = async () => {
    try {
      setLoading(true);
      const [messagesRes, tasksRes, membersRes, notificationsRes] = await Promise.all([
        api.get('/collaboration/messages'),
        api.get('/collaboration/tasks'),
        api.get('/collaboration/team-members'),
        api.get('/collaboration/notifications'),
      ]);
      setMessages(messagesRes.data);
      setTasks(tasksRes.data);
      setTeamMembers(membersRes.data);
      setNotifications(notificationsRes.data);
    } catch (err) {
      setError('Failed to load collaboration data');
      console.error(err);
      // Mock data for development
      setMessages([
        {
          id: '1',
          userId: 'user-2',
          userName: 'Jane Smith',
          message: 'Foundation work is progressing well!',
          timestamp: new Date(Date.now() - 3600000),
          isOnline: true,
        },
        {
          id: '2',
          userId: 'user-1',
          userName: 'You',
          message: 'Great! When do you expect it to be completed?',
          timestamp: new Date(Date.now() - 3000000),
          isOnline: true,
        },
        {
          id: '3',
          userId: 'user-2',
          userName: 'Jane Smith',
          message: 'Should be done by end of week',
          timestamp: new Date(Date.now() - 1800000),
          isOnline: true,
        },
      ]);
      setTasks([
        {
          id: 'task-1',
          title: 'Review floor plans',
          description: 'Final review before construction',
          assigneeId: 'user-1',
          assigneeName: 'You',
          dueDate: new Date(Date.now() + 86400000),
          priority: 'high',
          status: 'todo',
          createdAt: new Date(),
        },
        {
          id: 'task-2',
          title: 'Order materials',
          assigneeId: 'user-2',
          assigneeName: 'Jane Smith',
          priority: 'medium',
          status: 'in-progress',
          createdAt: new Date(),
        },
        {
          id: 'task-3',
          title: 'Sign contract',
          priority: 'high',
          status: 'done',
          createdAt: new Date(),
        },
      ]);
      setTeamMembers([
        {
          id: 'user-1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'client',
          isOnline: true,
          phone: '(555) 123-4567',
        },
        {
          id: 'user-2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'builder',
          isOnline: true,
          phone: '(555) 234-5678',
        },
        {
          id: 'user-3',
          name: 'Bob Wilson',
          email: 'bob@example.com',
          role: 'architect',
          isOnline: false,
          phone: '(555) 345-6789',
        },
      ]);
      setNotifications([
        {
          id: '1',
          type: 'task',
          message: 'New task assigned: Review floor plans',
          timestamp: new Date(Date.now() - 7200000),
          isRead: false,
          userId: 'user-1',
        },
        {
          id: '2',
          type: 'message',
          message: 'Jane Smith sent a message',
          timestamp: new Date(Date.now() - 3600000),
          isRead: false,
          userId: 'user-2',
        },
        {
          id: '3',
          type: 'document',
          message: 'New document uploaded: Floor_Plan.pdf',
          timestamp: new Date(Date.now() - 86400000),
          isRead: true,
          userId: 'user-3',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUserId,
      userName: 'You',
      message,
      timestamp: new Date(),
      isOnline: true,
    };

    try {
      await api.post('/collaboration/messages', { message });
      setMessages([...messages, newMessage]);
    } catch (err) {
      console.error(err);
      // Mock send for development
      setMessages([...messages, newMessage]);
    }
  };

  const handleTaskMove = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await api.put(`/collaboration/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    } catch (err) {
      console.error(err);
      // Mock update for development
      setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    }
  };

  const handleAddTask = (status: TaskStatus) => {
    // TODO: Open add task dialog
    console.log('Add task with status:', status);
  };

  const handleInviteMember = () => {
    // TODO: Open invite member dialog
    console.log('Invite team member');
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.put(`/collaboration/notifications/${id}/read`);
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error(err);
      // Mock update for development
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Collaboration Hub
        </Typography>

        {error && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {error} - Using demo data
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Box sx={{ mb: 3 }}>
              <TaskBoard
                tasks={tasks}
                onTaskMove={handleTaskMove}
                onAddTask={handleAddTask}
              />
            </Box>
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              currentUserId={currentUserId}
            />
          </Grid>

          <Grid item xs={12} lg={4}>
            <Box sx={{ mb: 3 }}>
              <TeamMembers members={teamMembers} onInvite={handleInviteMember} />
            </Box>
            <ActivityFeed
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
