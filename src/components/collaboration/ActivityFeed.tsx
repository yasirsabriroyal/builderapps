import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Circle as CircleIcon,
  Message as MessageIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import type { ActivityNotification } from '../../types';

interface ActivityFeedProps {
  notifications: ActivityNotification[];
  onMarkAsRead: (id: string) => void;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'message':
      return <MessageIcon />;
    case 'task':
      return <AssignmentIcon />;
    case 'document':
      return <DescriptionIcon />;
    case 'payment':
      return <AttachMoneyIcon />;
    default:
      return <CircleIcon />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'message':
      return 'primary';
    case 'task':
      return 'secondary';
    case 'document':
      return 'info';
    case 'payment':
      return 'success';
    default:
      return 'default';
  }
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  notifications,
  onMarkAsRead,
}) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Activity Feed</Typography>
          {unreadCount > 0 && (
            <Chip label={`${unreadCount} new`} color="primary" size="small" />
          )}
        </Box>
        <List>
          {notifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No recent activity
              </Typography>
            </Box>
          ) : (
            notifications.map((notification, index) => (
              <ListItem
                key={notification.id}
                sx={{
                  px: 0,
                  borderBottom: index < notifications.length - 1 ? 1 : 0,
                  borderColor: 'divider',
                  backgroundColor: notification.isRead ? 'transparent' : 'action.hover',
                }}
                secondaryAction={
                  !notification.isRead && (
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => onMarkAsRead(notification.id)}
                      title="Mark as read"
                    >
                      <CheckCircleIcon fontSize="small" />
                    </IconButton>
                  )
                }
              >
                <ListItemIcon
                  sx={{
                    color: `${getActivityColor(notification.type)}.main`,
                    minWidth: 40,
                  }}
                >
                  {getActivityIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={notification.message}
                  secondary={formatTime(notification.timestamp)}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: notification.isRead ? 'normal' : 'medium',
                  }}
                  secondaryTypographyProps={{
                    variant: 'caption',
                  }}
                />
              </ListItem>
            ))
          )}
        </List>
      </CardContent>
    </Card>
  );
};
