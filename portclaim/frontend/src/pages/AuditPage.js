import React, { useEffect, useState } from 'react';
import axios from '../api/client';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, CircularProgress,
  TextField, InputAdornment
} from '@mui/material';

// Icônes
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      // Appel à ton nouveau contrôleur AuditController.java
      const res = await axios.get('/audit');
      setLogs(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des logs d'audit", err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrage pour la recherche
  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.utilisateurNom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.cible?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.detail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour donner une couleur selon l'action
  const getActionColor = (action) => {
    if (action.includes('LOGIN')) return 'success';
    if (action.includes('LOGOUT')) return 'default';
    if (action.includes('CREATION')) return 'info';
    if (action.includes('STATUT') || action.includes('PRIORITE')) return 'warning';
    if (action.includes('SUPPRESSION')) return 'error';
    return 'primary';
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
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <HistoryIcon sx={{ fontSize: 40, color: '#0f172a' }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a' }}>
              Journal d'Audit
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Trame complète des activités et de la sécurité du système
            </Typography>
          </Box>
        </Box>

        <TextField
          placeholder="Rechercher une action, un utilisateur..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ bgcolor: '#fff', borderRadius: 2, width: 350 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#64748b' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Tableau des Logs */}
      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#0f172a' }}>
            <TableRow>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Date & Heure</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Utilisateur</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Action</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Cible</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Détails de l'événement</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <TableRow key={log.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>
                    {new Date(log.dateAction).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                        {log.utilisateurNom}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        ID: {log.utilisateurId || 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={log.action} 
                      color={getActionColor(log.action)}
                      size="small"
                      sx={{ fontWeight: 800, borderRadius: 1.5, fontSize: '0.7rem' }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.85rem' }}>
                    {log.cible}
                  </TableCell>
                  <TableCell sx={{ color: '#475569' }}>
                    {log.detail}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  <Typography variant="body1" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                    Aucun événement trouvé dans le journal.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}