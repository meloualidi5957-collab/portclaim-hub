// Nom du fichier : DashboardPage.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../api/client'; 
import {
  Typography, Button, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, Chip, Box, Grid, Card, CardContent, Select, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Fade
} from '@mui/material';

// Importations des icônes pour le look "Tech"
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

// Actions Redux
import { fetchReclamations, createReclamation, updateStatut } from '../store/actions/reclamationActions';

// Importation du style séparé
import { dashStyles as s } from './DashboardPage.styles';

const TITRES_CHOIX = [
  "Problème d'abonnement au Guichet Unique",
  "Problème de paiement de transport",
  "Problème d'acquisition de document",
  "Difficulté d'accès au système (Login/Pass)",
  "Erreur de facturation",
  "Retard de traitement de dossier",
  "Autre demande d'assistance"
];

const statutColor = {
  OUVERTE: 'info', EN_COURS: 'warning', EN_ATTENTE: 'default',
  RESOLUE: 'success', CLOTUREE: 'success', REJETEE: 'error'
};

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(state => state.reclamations);
  const user = useSelector(state => state.auth.user);
  
  // États pour les filtres et recherche
  const [filterStatut, setFilterStatut] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour les fenêtres modales (Dialogs)
  const [open, setOpen] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);
  
  // États pour les formulaires
  const [form, setForm] = useState({ titre: '', description: '', priorite: 'NORMALE' });
  const [selectedRec, setSelectedRec] = useState(null);
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');

  // Chargement initial des données
  useEffect(() => {
    dispatch(fetchReclamations(filterStatut ? { statut: filterStatut } : {}));
    
    if (user?.role === 'ADMIN') {
      axios.get('/utilisateurs/agents')
        .then(res => setAgents(res.data))
        .catch(err => console.error("Erreur récupération agents", err));
    }
  }, [dispatch, filterStatut, user]);

  // Handler : Création d'une réclamation
  const submit = () => { 
    dispatch(createReclamation(form)); 
    setOpen(false); 
    setForm({ titre: '', description: '', priorite: 'NORMALE' }); 
  };

  // Handler : Affectation d'un agent
  const handleAssign = async () => {
    try {
      await axios.patch(`/reclamations/${selectedRec.id}/affectation`, { agentId: selectedAgentId });
      setOpenAssign(false);
      setSelectedAgentId('');
      dispatch(fetchReclamations()); // Rafraîchir la liste
    } catch (err) {
      alert("Erreur lors de l'affectation de l'agent");
    }
  };

  // Calcul des statistiques
  const statsData = [
    { label: 'Total', value: items.length, color: '#0f172a' },
    { label: 'Ouvertes', value: items.filter(r => r.statut === 'OUVERTE').length, color: '#0ea5e9' },
    { label: 'En cours', value: items.filter(r => r.statut === 'EN_COURS').length, color: '#f59e0b' },
    { label: 'Résolues', value: items.filter(r => r.statut === 'RESOLUE' || r.statut === 'CLOTUREE').length, color: '#10b981' }
  ];

  // Filtrage local pour la barre de recherche
  const filteredItems = items.filter(r => 
    r.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={s.mainBox}>
      {/* 1. SECTION EN-TÊTE */}
      <Box sx={s.headerSection}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a' }}>Analytics Portnet</Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Gestion centralisée des réclamations du Guichet Unique
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<FileDownloadIcon />} 
            sx={{ borderRadius: 2, textTransform: 'none', color: '#64748b', borderColor: '#e2e8f0' }}
          >
            Export PDF
          </Button>
          {user?.role === 'CLIENT' && (
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={() => setOpen(true)} 
              sx={s.techBtn}
            >
              Nouvelle Réclamation
            </Button>
          )}
        </Box>
      </Box>

      {/* 2. GRILLE DE STATISTIQUES */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {statsData.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Card sx={s.statCard(stat.color)}>
              <CardContent>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  {stat.label}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, mt: 1, color: '#0f172a' }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 3. FILTRES ET RECHERCHE */}
      <Paper sx={s.filterPaper}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField 
              fullWidth 
              size="small" 
              placeholder="Rechercher par référence ou sujet..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: '#94a3b8', mr: 1 }} />,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <Select 
                value={filterStatut} 
                onChange={e => setFilterStatut(e.target.value)} 
                displayEmpty 
                sx={{ borderRadius: 3, bgcolor: '#f8fafc' }}
              >
                <MenuItem value="">Tous les statuts</MenuItem>
                {Object.keys(statutColor).map(st => (
                  <MenuItem key={st} value={st}>{st}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* 4. TABLEAU DES DONNÉES */}
      <Fade in={true} timeout={1000}>
        <Paper sx={s.tablePaper}>
          <Table>
            <TableHead sx={s.tableHeader}>
              <TableRow>
                <TableCell>Référence</TableCell>
                <TableCell>Nature de la demande</TableCell>
                <TableCell>Responsable</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} align="center">Chargement...</TableCell></TableRow>
              ) : filteredItems.map(r => (
                <TableRow key={r.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                  <TableCell><strong>{r.reference}</strong></TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#334155' }}>{r.titre}</TableCell>
                  <TableCell>
                    {r.agentNom ? (
                      <Chip label={r.agentNom} size="small" variant="outlined" sx={{ borderRadius: 1.5 }} />
                    ) : (
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>En attente d'affectation</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip label={r.statut} color={statutColor[r.statut]} size="small" sx={{ fontWeight: 700 }} />
                  </TableCell>
                  <TableCell align="right">
                    {user?.role === 'ADMIN' && r.statut === 'OUVERTE' && (
                      <Button 
                        size="small" 
                        variant="outlined" 
                        startIcon={<AssignmentIndIcon />} 
                        onClick={() => { setSelectedRec(r); setOpenAssign(true); }}
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                      >
                        Affecter
                      </Button>
                    )}
                    {user?.role === 'AGENT' && r.statut === 'EN_COURS' && (
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="success" 
                        onClick={() => dispatch(updateStatut(r.id, 'RESOLUE'))}
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                      >
                        Résoudre
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Fade>

      {/* --- MODALE : CRÉATION (CLIENT) --- */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Nouvelle réclamation générale</DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth margin="normal">
            <InputLabel>Objet de la réclamation</InputLabel>
            <Select label="Objet de la réclamation" value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} sx={{ borderRadius: 3 }}>
              {TITRES_CHOIX.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField 
            fullWidth 
            multiline 
            rows={4} 
            label="Description détaillée" 
            margin="normal" 
            value={form.description} 
            onChange={e => setForm({ ...form, description: e.target.value })} 
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} 
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Annuler</Button>
          <Button variant="contained" onClick={submit} disabled={!form.titre || !form.description} sx={s.techBtn}>
            Envoyer au Guichet Unique
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- MODALE : AFFECTATION (ADMIN) --- */}
      <Dialog open={openAssign} onClose={() => setOpenAssign(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Affecter un Agent</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>Référence : {selectedRec?.reference}</Typography>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Sélectionner l'agent responsable</InputLabel>
            <Select label="Sélectionner l'agent responsable" value={selectedAgentId} onChange={e => setSelectedAgentId(e.target.value)} sx={{ borderRadius: 3 }}>
              {agents.map(a => <MenuItem key={a.id} value={a.id}>{a.prenom} {a.nom}</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenAssign(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleAssign} disabled={!selectedAgentId} sx={{ borderRadius: 2, bgcolor: '#0f172a' }}>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}