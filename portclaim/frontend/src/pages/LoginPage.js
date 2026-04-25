// Nom du fichier : LoginPage.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Box, TextField, Button, Typography, Alert, Container, 
  InputAdornment, IconButton, Card, Divider, Fade 
} from '@mui/material';

// Importations des actions et des styles
import { loginRequest } from '../store/actions/authActions';
import { loginStyles as s } from './LoginPage.styles';

// Importations des icônes
import AnchorIcon from '@mui/icons-material/Anchor';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useSelector(state => state.auth);
  
  // États locaux
  const [email, setEmail] = useState('admin@port.com');
  const [motDePasse, setMotDePasse] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);

  // MODIFICATION : Redirection vers /reclamations si déjà connecté
  useEffect(() => { 
    if (token) navigate('/reclamations'); 
  }, [token, navigate]);

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    dispatch(loginRequest({ email, motDePasse })); 
  };

  return (
    <Box sx={s.mainContainer}>
      <Container maxWidth="xs" sx={{ zIndex: 1 }}>
        <Fade in={true} timeout={800}>
          <Card elevation={0} sx={s.loginCard}>
            
            {/* Header du Login */}
            <Box sx={{ mb: 3 }}>
              <Box sx={s.logoIconWrapper}>
                <AnchorIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#002b5c', letterSpacing: '-0.5px' }}>
                PortClaim Hub
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Gestion des Réclamations Portuaires
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

            {/* Formulaire */}
            <form onSubmit={handleSubmit}>
              <TextField 
                fullWidth 
                label="Email" 
                margin="normal" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={s.textField}
              />

              <TextField 
                fullWidth 
                label="Mot de passe" 
                type={showPassword ? 'text' : 'password'}
                margin="normal" 
                value={motDePasse} 
                onChange={e => setMotDePasse(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={s.textField}
              />

              <Button 
                fullWidth 
                type="submit" 
                variant="contained" 
                disabled={loading}
                sx={s.submitButton}
              >
                {loading ? 'Vérification...' : 'Se connecter'}
              </Button>
            </form>

            <Divider sx={{ my: 4 }}>
              <Typography variant="caption" color="text.secondary" sx={{ px: 1, fontWeight: 600 }}>
                ACCÈS DÉMO
              </Typography>
            </Divider>

            <Box sx={s.testAccountBox}>
              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                Utilisez les comptes pré-configurés pour tester les rôles.
              </Typography>
            </Box>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
}