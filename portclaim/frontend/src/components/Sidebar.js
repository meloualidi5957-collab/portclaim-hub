import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Avatar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import AnchorIcon from '@mui/icons-material/Anchor';

const menuItems = [
  { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/' },
  { text: 'Réclamations', icon: <AssignmentIcon />, path: '/' }, // On pourra changer les routes plus tard
  { text: 'Agents Portuaires', icon: <PeopleIcon />, path: '/' },
];

export default function Sidebar({ onLogout, user }) {
  return (
    <Box sx={{ 
      width: 280, 
      bgcolor: '#0f172a', // Slate sombre (très tech)
      color: 'white', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.05)'
    }}>
      {/* LOGO & NOM DU PROJET */}
      <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <AnchorIcon sx={{ color: '#22d3ee', fontSize: 35 }} />
        <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 1, color: '#f8fafc' }}>
          PORTCLAIM
        </Typography>
      </Box>
      
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mx: 2, mb: 2 }} />
      
      {/* MENU DE NAVIGATION */}
      <List sx={{ flexGrow: 1, px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton sx={{ 
              borderRadius: 2, 
              '&:hover': { bgcolor: 'rgba(34, 211, 238, 0.1)', color: '#22d3ee' },
              '&:hover .MuiListItemIcon-root': { color: '#22d3ee' }
            }}>
              <ListItemIcon sx={{ color: 'rgba(255,255,255,0.6)', minWidth: 45 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* ZONE UTILISATEUR & DECONNEXION */}
      <Box sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.2)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar sx={{ bgcolor: '#22d3ee', color: '#0f172a', fontWeight: 700 }}>
            {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{user?.prenom} {user?.nom}</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{user?.role}</Typography>
          </Box>
        </Box>
        
        <ListItemButton 
          onClick={onLogout} 
          sx={{ borderRadius: 2, color: '#fda4af', '&:hover': { bgcolor: 'rgba(253, 164, 175, 0.1)' } }}
        >
          <ListItemIcon sx={{ color: '#fda4af', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Quitter la session" />
        </ListItemButton>
      </Box>
    </Box>
  );
}