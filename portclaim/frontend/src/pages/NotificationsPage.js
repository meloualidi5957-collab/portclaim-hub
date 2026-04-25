import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/client';
import { 
  Box, Typography, Paper, List, ListItemButton, 
  ListItemText, ListItemAvatar, Avatar, CircularProgress, Chip 
} from '@mui/material';

import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // On récupère la liste des notifications depuis le Backend
      const res = await axios.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des notifications :", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notif) => {
    try {
      // 1. Si elle n'est pas lue, on prévient le Backend pour enlever le badge rouge
      if (!notif.lu) {
        await axios.patch(`/notifications/${notif.id}/marquer-lue`);
      }
      // 2. On redirige l'utilisateur vers la page de détails de la réclamation
      navigate(`/reclamations/${notif.reclamationId}`);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la notification :", err);
      // Même en cas d'erreur réseau pour marquer comme lu, on redirige quand même l'utilisateur
      navigate(`/reclamations/${notif.reclamationId}`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: '#002b5c' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: '#002b5c', width: 50, height: 50 }}>
          <NotificationsActiveIcon fontSize="medium" />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a' }}>
            Centre de Notifications
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Suivez l'activité récente de vos réclamations
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {notifications.length === 0 ? (
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#94a3b8', fontWeight: 600 }}>
              Vous n'avez aucune notification pour le moment.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {notifications.map((notif, index) => (
              <React.Fragment key={notif.id}>
                <ListItemButton 
                  onClick={() => handleNotificationClick(notif)}
                  sx={{
                    px: 3,
                    py: 2.5,
                    borderBottom: '1px solid #f1f5f9',
                    // Si la notification n'est pas lue, on met un fond légèrement bleu
                    bgcolor: notif.lu ? 'transparent' : '#f0f9ff',
                    '&:hover': { bgcolor: '#e2e8f0' }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      bgcolor: notif.lu ? '#e2e8f0' : '#0ea5e9', 
                      color: notif.lu ? '#94a3b8' : '#fff' 
                    }}>
                      <AssignmentTurnedInIcon />
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText 
                    primary={notif.message} 
                    secondary={new Date(notif.dateCreation).toLocaleString()}
                    primaryTypographyProps={{ 
                      fontWeight: notif.lu ? 500 : 800, 
                      color: '#0f172a',
                      mb: 0.5
                    }}
                    secondaryTypographyProps={{ 
                      color: '#64748b',
                      fontSize: '0.8rem'
                    }}
                  />
                  
                  {/* Petit badge visuel "Nouveau" pour les non lues */}
                  {!notif.lu && (
                    <Chip 
                      label="Nouveau" 
                      color="error" 
                      size="small" 
                      sx={{ fontWeight: 800, height: 20, fontSize: '0.7rem' }} 
                    />
                  )}
                </ListItemButton>
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}