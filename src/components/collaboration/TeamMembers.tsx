import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  Chip,
  Button,
} from '@mui/material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import type { TeamMember } from '../../types';

interface TeamMembersProps {
  members: TeamMember[];
  onInvite: () => void;
}

const ROLE_CONFIG = {
  client: { label: 'Client', color: 'primary' as const },
  builder: { label: 'Builder', color: 'secondary' as const },
  designer: { label: 'Designer', color: 'success' as const },
  architect: { label: 'Architect', color: 'info' as const },
};

export const TeamMembers: React.FC<TeamMembersProps> = ({ members, onInvite }) => {
  return (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Team Members</Typography>
          <Button size="small" startIcon={<PersonAddIcon />} onClick={onInvite}>
            Invite
          </Button>
        </Box>
        <List>
          {members.map((member, index) => (
            <ListItem
              key={member.id}
              sx={{
                px: 0,
                borderBottom: index < members.length - 1 ? 1 : 0,
                borderColor: 'divider',
              }}
            >
              <ListItemAvatar>
                <Box sx={{ position: 'relative' }}>
                  <Avatar src={member.avatar} alt={member.name}>
                    {member.name[0]}
                  </Avatar>
                  {member.isOnline && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: 'success.main',
                        border: '2px solid white',
                      }}
                    />
                  )}
                </Box>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2">{member.name}</Typography>
                    <Chip
                      label={ROLE_CONFIG[member.role].label}
                      color={ROLE_CONFIG[member.role].color}
                      size="small"
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2" component="span">
                      {member.email}
                    </Typography>
                    {member.phone && (
                      <>
                        <br />
                        <Typography variant="body2" component="span">
                          {member.phone}
                        </Typography>
                      </>
                    )}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
