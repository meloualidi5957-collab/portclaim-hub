import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../api/client'; // --- NOUVEAU : Pour télécharger avec le Token JWT ---
import { 
  Box, Typography, Button, Paper, Grid, Chip, Divider, 
  Stepper, Step, StepLabel, CircularProgress, IconButton, Card, CardContent
} from '@mui/material';

// Icônes
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AttachFileIcon from '@mui/icons-material/AttachFile'; // --- NOUVEAU ---
import DownloadIcon from '@mui/icons-material/Download'; // --- NOUVEAU ---

// Actions
import { fetchReclamationDetails } from '../store/actions/reclamationActions';

const steps = ['OUVERTE', 'EN_COURS', 'RESOLUE'];
const statutColor = {
  OUVERTE: 'info',
  EN_COURS: 'warning',
  RESOLUE: 'success',
  CLOTUREE: 'success',
  REJETEE: 'error'
};

export default function ReclamationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentDetail, loading } = useSelector(state => state.reclamations);

  useEffect(() => {
    if (id) {
      dispatch(fetchReclamationDetails(id));
    }
  }, [dispatch, id]);

  // --- NOUVEAU : Fonction pour télécharger le fichier en toute sécurité ---
  const handleDownload = async (fileName) => {
    try {
      // On demande le fichier au Backend sous forme de Blob (données brutes)
      const response = await axios.get(`/reclamations/attachments/${fileName}`, {
        responseType: 'blob'
      });
      
      // On crée un lien virtuel pour forcer le téléchargement sur le PC
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // On nettoie le nom du fichier (on enlève le UUID généré par le serveur pour l'affichage)
      const originalName = fileName.includes('_') ? fileName.substring(fileName.indexOf('_') + 1) : fileName;
      link.setAttribute('download', originalName);
      
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Erreur lors du téléchargement :", error);
      alert("Impossible de télécharger le document. Il a peut-être été supprimé ou est introuvable.");
    }
  };
  // ------------------------------------------------------------------------

  if (loading || !currentDetail) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: '#002b5c' }} />
      </Box>
    );
  }

  const activeStep = steps.indexOf(currentDetail.statut === 'CLOTUREE' ? 'RESOLUE' : currentDetail.statut);

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

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AssignmentIcon sx={{ color: '#002b5c' }} />
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>{currentDetail.titre}</Typography>
                </Box>
                <Chip 
                  label={currentDetail.statut} 
                  color={statutColor[currentDetail.statut]} 
                  sx={{ fontWeight: 800, borderRadius: 2 }} 
                />
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

              {/* --- NOUVEAU : Zone d'affichage de la pièce jointe --- */}
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
              {/* ------------------------------------------------------- */}

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Priorité</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{currentDetail.priorite}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Type d'opération</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{currentDetail.typeOperation || 'Générale'}</Typography>
                </Grid>
              </Grid>
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
    </Box>
  );
}