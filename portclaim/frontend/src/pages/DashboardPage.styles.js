// Nom du fichier : DashboardPage.styles.js
export const dashStyles = {
  mainBox: {
    p: 4,
    bgcolor: '#f8fafc', // Gris très clair pour le fond
    minHeight: '100vh'
  },
  // En-tête avec titre et boutons d'export
  headerSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 5
  },
  // Cartes de statistiques style "Analytics"
  statCard: (accentColor) => ({
    p: 1,
    borderRadius: 4,
    bgcolor: 'white',
    boxShadow: 'none',
    border: '1px solid #e2e8f0',
    position: 'relative',
    overflow: 'hidden',
    transition: '0.3s',
    '&:hover': { boxShadow: '0 10px 25px rgba(0,0,0,0.05)', transform: 'translateY(-2px)' },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '4px',
      height: '100%',
      bgcolor: accentColor
    }
  }),
  // Section des filtres (comme ENSA Reports)
  filterPaper: {
    p: 3,
    mb: 4,
    borderRadius: 4,
    border: '1px solid #e2e8f0',
    boxShadow: 'none',
    bgcolor: 'white'
  },
  // Tableau épuré
  tablePaper: {
    borderRadius: 4,
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    boxShadow: 'none',
    bgcolor: 'white'
  },
  tableHeader: {
    bgcolor: '#f1f5f9',
    '& th': {
      color: '#64748b',
      fontWeight: 700,
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    }
  },
  // Bouton Cyan "Tech"
  techBtn: {
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 700,
    px: 3,
    bgcolor: '#0ea5e9',
    '&:hover': { bgcolor: '#0284c7' }
  }
};