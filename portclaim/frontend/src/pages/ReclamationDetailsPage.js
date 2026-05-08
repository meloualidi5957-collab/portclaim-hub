import React, { useEffect, useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../api/client'; 
import { 
  Box, Typography, Button, Paper, Grid, Chip, Divider, 
  Stepper, Step, StepLabel, CircularProgress, IconButton, Card, CardContent,
  Select, MenuItem, FormControl, TextField,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions // --- NOUVEAU : Imports pour la popup de confirmation ---
} from '@mui/material';

// Icônes
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AttachFileIcon from '@mui/icons-material/AttachFile'; 
import DownloadIcon from '@mui/icons-material/Download'; 
import ForumIcon from '@mui/icons-material/Forum'; 
import SendIcon from '@mui/icons-material/Send'; 
import BlockIcon from '@mui/icons-material/Block'; // --- NOUVEAU : Icône pour le bouton Rejeter ---

// Actions
// --- NOUVEAU : Import de updateStatut ---
import { fetchReclamationDetails, updatePriorite, addReponse, updateStatut } from '../store/actions/reclamationActions';

const steps = ['OUVERTE', 'EN_COURS', 'RESOLUE'];
const statutColor = {
  OUVERTE: 'info',
  EN_COURS: 'warning',
  RESOLUE: 'success',
  CLOTUREE: 'success',
  REJETEE: 'error' // Le rouge s'affichera automatiquement
};

const prioriteColor = {
  BASSE: '#94a3b8', NORMALE: '#10b981', HAUTE: '#f59e0b', CRITIQUE: '#ef4444'
};

export default function ReclamationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const user = useSelector(state => state.auth.user);
  const { currentDetail, loading } = useSelector(state => state.reclamations);

  const [messageText, setMessageText] = useState('');
  
  // --- NOUVEAU : État pour gérer l'ouverture de la popup de confirmation de rejet ---
  const [openRejectDialog, setOpenRejectDialog] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchReclamationDetails(id));
    }
  }, [dispatch, id]);

  const handleDownload = async (fileName) => {
    try {
      const response = await axios.get(`/reclamations/attachments/${fileName}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const originalName = fileName.includes('_') ? fileName.substring(fileName.indexOf('_') + 1) : fileName;
      link.setAttribute('download', originalName);
      
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Erreur lors du téléchargement :", error);
      alert("Impossible de télécharger le document.");
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim() !== '') {
      dispatch(addReponse(currentDetail.id, messageText));
      setMessageText(''); 
    }
  };

  // --- NOUVEAU : Fonction pour valider le rejet ---
  const handleConfirmReject = () => {
    dispatch(updateStatut(currentDetail.id, 'REJETEE'));
    setOpenRejectDialog(false);
  };
  // -----------------------------------------------

  if (loading || !currentDetail) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: '#002b5c' }} />
      </Box>
    );
  }

  const activeStep = steps.indexOf(currentDetail.statut === 'CLOTUREE' ? 'RESOLUE' : currentDetail.statut);
  const myFullName = `${user?.prenom} ${user?.nom}`;

  // Logique pour afficher ou non le bouton de rejet
  const canReject = 
    (user?.role === 'ADMIN' || (user?.role === 'AGENT' && user?.id === currentDetail.agentId)) && 
    !['RESOLUE', 'CLOTUREE', 'REJETEE'].includes(currentDetail.statut);

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2, bgcolor: '#fff', boxShadow: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a' }}>
            Détails de la Réclamation
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Référence : <strong>{currentDetail.reference}</strong>
          </Typography>
        </Box>
      </Box>

      {/* On n'affiche le Stepper que si la réclamation n'est pas rejetée */}
      {currentDetail.statut !== 'REJETEE' && (
        <Paper sx={{ p: 4, mb: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>{label}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AssignmentIcon sx={{ color: '#002b5c' }} />
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>{currentDetail.titre}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip 
                    label={currentDetail.statut} 
                    color={statutColor[currentDetail.statut]} 
                    sx={{ fontWeight: 800, borderRadius: 2 }} 
                  />
                  
                  {/* --- NOUVEAU : Bouton Rejeter --- */}
                  {canReject && (
                    <Button 
                      variant="outlined" 
                      color="error" 
                      size="small"
                      startIcon={<BlockIcon />}
                      onClick={() => setOpenRejectDialog(true)}
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                    >
                      Rejeter le dossier
                    </Button>
                  )}
                  {/* -------------------------------- */}
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DescriptionIcon fontSize="small" color="action" /> Description
                </Typography>
                <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.7, bgcolor: '#f1f5f9', p: 2, borderRadius: 2 }}>
                  {currentDetail.description}
                </Typography>
              </Box>

              {currentDetail.pieceJointe && (
                <Box sx={{ mb: 4, p: 2, border: '1px solid #e2e8f0', borderRadius: 3, bgcolor: '#fff' }}>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachFileIcon fontSize="small" /> Pièce jointe
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                      {currentDetail.pieceJointe.includes('_') 
                        ? currentDetail.pieceJointe.substring(currentDetail.pieceJointe.indexOf('_') + 1) 
                        : currentDetail.pieceJointe}
                    </Typography>
                    <Button 
                      variant="contained" 
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(currentDetail.pieceJointe)}
                      sx={{ bgcolor: '#002b5c', textTransform: 'none', borderRadius: 2 }}
                    >
                      Télécharger
                    </Button>
                  </Box>
                </Box>
              )}

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Priorité</Typography>
                  {user?.role === 'ADMIN' && currentDetail.statut !== 'REJETEE' ? (
                    <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                      <Select
                        value={currentDetail.priorite}
                        onChange={(e) => dispatch(updatePriorite(currentDetail.id, e.target.value))}
                        sx={{ 
                          fontWeight: 700, 
                          borderRadius: 2, 
                          bgcolor: '#f8fafc',
                          color: prioriteColor[currentDetail.priorite] || '#0f172a'
                        }}
                      >
                        {['BASSE', 'NORMALE', 'HAUTE', 'CRITIQUE'].map(p => (
                          <MenuItem key={p} value={p} sx={{ fontWeight: 600, color: prioriteColor[p] }}>
                            {p}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <Typography variant="body2" sx={{ fontWeight: 700, mt: 1, color: prioriteColor[currentDetail.priorite] || '#0f172a' }}>
                      {currentDetail.priorite}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Type d'opération</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, mt: 1 }}>{currentDetail.typeOperation || 'Générale'}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* CARTE MESSAGERIE (CHAT) */}
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <ForumIcon sx={{ color: '#002b5c' }} />
                <Typography variant="h5" sx={{ fontWeight: 800 }}>Suivi des échanges</Typography>
              </Box>
              
              <Box sx={{ 
                display: 'flex', flexDirection: 'column', gap: 2, mb: 3, 
                maxHeight: '400px', overflowY: 'auto', p: 1,
                bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0'
              }}>
                {currentDetail.reponses && currentDetail.reponses.length > 0 ? (
                  currentDetail.reponses.map((rep) => {
                    const isMine = rep.auteurNom === myFullName;
                    return (
                      <Box key={rep.id} sx={{
                        alignSelf: isMine ? 'flex-end' : 'flex-start',
                        bgcolor: isMine ? '#002b5c' : '#fff',
                        color: isMine ? '#fff' : '#0f172a',
                        border: isMine ? 'none' : '1px solid #e2e8f0',
                        p: 2, borderRadius: 3, maxWidth: '85%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                      }}>
                        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, opacity: isMine ? 0.8 : 0.6, fontWeight: 700 }}>
                          {rep.auteurNom} • {new Date(rep.dateCreation).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{rep.message}</Typography>
                      </Box>
                    );
                  })
                ) : (
                  <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center', fontStyle: 'italic', py: 4 }}>
                    Aucun échange pour le moment.
                  </Typography>
                )}
              </Box>

              {/* On bloque la saisie si la réclamation est rejetée */}
              {currentDetail.statut !== 'REJETEE' && (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Écrivez votre message ici..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    multiline
                    minRows={2}
                    maxRows={4}
                    sx={{ bgcolor: '#fff' }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    endIcon={<SendIcon />}
                    sx={{ bgcolor: '#002b5c', borderRadius: 2, px: 3, py: 1, textTransform: 'none', height: 'fit-content' }}
                  >
                    Envoyer
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>

        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 4, borderLeft: '6px solid #002b5c' }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon fontSize="small" /> Émetteur (Client)
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{currentDetail.clientNom || 'Client Portnet'}</Typography>
                  <Typography variant="body2" color="textSecondary">{currentDetail.clientEmail}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ borderRadius: 4, borderLeft: '6px solid #f59e0b' }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssignmentIcon fontSize="small" /> Agent Responsable
                  </Typography>
                  {currentDetail.agentNom ? (
                    <>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>{currentDetail.agentNom}</Typography>
                      <Typography variant="body2" color="textSecondary">Agent de support technique</Typography>
                    </>
                  ) : (
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#94a3b8' }}>
                      Non encore affecté
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ borderRadius: 4, bgcolor: '#0f172a', color: '#fff' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CalendarTodayIcon fontSize="small" />
                    <Typography variant="subtitle2">Chronologie</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>Création :</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      {new Date(currentDetail.dateCreation).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>Dernière MAJ :</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      {new Date(currentDetail.dateModification).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* --- NOUVEAU : POPUP DE CONFIRMATION DE REJET --- */}
      <Dialog
        open={openRejectDialog}
        onClose={() => setOpenRejectDialog(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#0f172a' }}>
          Confirmer le rejet
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#334155' }}>
            Êtes-vous sûr de vouloir rejeter cette réclamation ? Cette action est irréversible et le client en sera notifié.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setOpenRejectDialog(false)} 
            sx={{ color: '#64748b', fontWeight: 600, textTransform: 'none' }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleConfirmReject} 
            variant="contained" 
            color="error" 
            autoFocus
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
          >
            Oui, rejeter le dossier
          </Button>
        </DialogActions>
      </Dialog>
      {/* ------------------------------------------------ */}

    </Box>
  );
}