// Nom du fichier : LoginPage.styles.js

export const loginStyles = {
  // Fond principal avec dégradé maritime
  mainContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #002b5c 0%, #001529 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  // La carte blanche centrale
  loginCard: {
    p: 4,
    borderRadius: 4,
    bgcolor: 'rgba(255, 255, 255, 0.98)',
    boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
    textAlign: 'center',
  },
  // Le cercle bleu autour de l'ancre
  logoIconWrapper: {
    display: 'inline-flex',
    p: 2,
    borderRadius: '50%',
    bgcolor: 'primary.main',
    color: 'white',
    mb: 2,
    boxShadow: '0 4px 15px rgba(25, 118, 210, 0.4)',
  },
  // Style commun pour les champs de saisie
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
      transition: '0.3s',
      '&:hover': {
        bgcolor: 'rgba(25, 118, 210, 0.02)',
      },
    },
  },
  // Le bouton de connexion "Premium"
  submitButton: {
    mt: 4,
    py: 1.5,
    borderRadius: 3,
    fontWeight: 700,
    fontSize: '1rem',
    textTransform: 'none',
    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
    transition: '0.3s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(25, 118, 210, 0.4)',
    },
  },
  // Zone des comptes de test
  testAccountBox: {
    bgcolor: '#f0f4f8',
    p: 2,
    borderRadius: 3,
    border: '1px dashed #cbd5e0',
  },
};