import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/client';
import { 
  Box, List, ListItem, ListItemButton, ListItemIcon, 
  ListItemText, Typography, Divider, Avatar, Badge 
} from '@mui/material';

// Icônes
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import AnchorIcon from '@mui/icons-material/Anchor';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BarChartIcon from '@mui/icons-material/BarChart'; // Icône pour les analyses

export default function Sidebar({ onLogout, user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      axios.get('/notifications/non-lues')
        .then(res => setUnreadCount(res.data))
        .catch(err => console.error("Erreur notifications", err));
    }
  }, [user]);

  // Configuration des menus
  const menuItems = [
    { 
      text: 'Réclamations', 
      icon: <AssignmentIcon />, 
      path: '/reclamations', 
      show: true 
    }, 
    { 
      text: 'Notifications', 
      icon: (
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      ), 
      path: '/notifications',
      show: true
    },
    // NOUVEAU : Onglet Analyses réservé aux Admins
    { 
      text: 'Analyses', 
      icon: <BarChartIcon />, 
      path: '/analyses', 
      show: user?.role === 'ADMIN' 
    },
    { 
      text: 'Gestion Utilisateurs', 
      icon: <ManageAccountsIcon />, 
      path: '/utilisateurs', 
      show: user?.role === 'ADMIN' 
    },
  ];

  return (
    <Box sx={{ width: 280, bgcolor: '#0f172a', color: 'white', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <AnchorIcon sx={{ color: '#22d3ee', fontSize: 35 }} />
        <Typography variant="h6" sx={{ fontWeight: 900, color: '#f8fafc' }}>PORTCLAIM</Typography>
      </Box>
      
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mx: 2, mb: 2 }} />
      
      <List sx={{ flexGrow: 1, px: 2 }}>
        {menuItems.filter(item => item.show).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                onClick={() => navigate(item.path)}
                sx={{ 
                  borderRadius: 2, 
                  bgcolor: isActive ? 'rgba(34, 211, 238, 0.15)' : 'transparent',
                  color: isActive ? '#22d3ee' : 'white',
                  '&:hover': { bgcolor: 'rgba(34, 211, 238, 0.1)', color: '#22d3ee' }
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#22d3ee' : 'rgba(255,255,255,0.6)', minWidth: 45 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: isActive ? 700 : 500 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.2)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar sx={{ bgcolor: '#22d3ee', color: '#0f172a' }}>{user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}</Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{user?.prenom} {user?.nom}</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{user?.role}</Typography>
          </Box>
        </Box>
        <ListItemButton onClick={onLogout} sx={{ borderRadius: 2, color: '#fda4af' }}>
          <ListItemIcon sx={{ color: '#fda4af', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Quitter la session" />
        </ListItemButton>
      </Box>
    </Box>
  );
}