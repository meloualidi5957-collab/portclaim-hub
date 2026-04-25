import React, { useState, useEffect } from 'react';
import axios from '../api/client';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem, Grid, Alert
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupIcon from '@mui/icons-material/Group';

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // L'état qui stocke les données du formulaire
  const [formData, setFormData] = useState({
    nom: '', prenom: '', email: '', motDePasse: '', 
    cin: '', telephone: '', role: 'AGENT', entreprise: ''
  });

  // Charger les utilisateurs au démarrage de la page
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/utilisateurs');
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur chargement utilisateurs", err);
    }
  };

  const handleOpen = () => setOpen(true);
  
  const handleClose = () => {
    setOpen(false);
    setError('');
    // On réinitialise le formulaire à la fermeture
    setFormData({ nom: '', prenom: '', email: '', motDePasse: '', cin: '', telephone: '', role: 'AGENT', entreprise: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // On envoie les données à ton nouveau contrôleur Backend
      await axios.post('/utilisateurs', formData);
      setSuccess('Utilisateur ajouté avec succès !');
      fetchUsers(); // On met à jour le tableau
      handleClose(); // On ferme la fenêtre
    } catch (err) {
      // Si l'email ou le CIN existe déjà, on affiche l'erreur envoyée par Spring Boot
      setError(err.response?.data || "Erreur lors de l'ajout de l'utilisateur");
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* En-tête de la page */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <GroupIcon sx={{ fontSize: 40, color: '#0f172a' }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a' }}>
              Gestion des Utilisateurs
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Administrez les clients et les agents portuaires
            </Typography>
          </Box>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<PersonAddIcon />} 
          onClick={handleOpen}
          sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' }, fontWeight: 'bold', px: 3 }}
        >
          Ajouter un membre
        </Button>
      </Box>

      {/* Message de succès */}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      {/* Tableau des utilisateurs */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f1f5f9' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Nom & Prénom</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Rôle</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>CIN</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Téléphone</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Entreprise</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{user.nom} {user.prenom}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role} 
                    size="small" 
                    sx={{ 
                      fontWeight: 'bold', 
                      bgcolor: user.role === 'ADMIN' ? '#fee2e2' : user.role === 'AGENT' ? '#e0f2fe' : '#f3e8ff',
                      color: user.role === 'ADMIN' ? '#ef4444' : user.role === 'AGENT' ? '#0ea5e9' : '#a855f7'
                    }} 
                  />
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.cin || '---'}</TableCell>
                <TableCell>{user.telephone || '---'}</TableCell>
                <TableCell>{user.entreprise || '---'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Fenêtre Modale (Formulaire d'ajout) */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #e2e8f0', pb: 2 }}>
          Ajouter un nouvel utilisateur
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ mt: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Nom" name="nom" required value={formData.nom} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Prénom" name="prenom" required value={formData.prenom} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email" type="email" name="email" required value={formData.email} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Mot de passe temporaire" name="motDePasse" required value={formData.motDePasse} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Numéro de CIN" name="cin" required value={formData.cin} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Téléphone" name="telephone" value={formData.telephone} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth select label="Rôle de l'utilisateur" name="role" value={formData.role} onChange={handleChange}>
                  <MenuItem value="AGENT">Agent Portuaire</MenuItem>
                  <MenuItem value="CLIENT">Client / Importateur</MenuItem>
                  <MenuItem value="ADMIN">Administrateur</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Entreprise (Optionnel)" 
                  name="entreprise" 
                  value={formData.entreprise} 
                  onChange={handleChange} 
                  disabled={formData.role === 'AGENT' || formData.role === 'ADMIN'}
                  helperText="Uniquement pour les clients"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid #e2e8f0' }}>
            <Button onClick={handleClose} color="inherit" sx={{ fontWeight: 'bold' }}>Annuler</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#0f172a', fontWeight: 'bold' }}>
              Créer le compte
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}