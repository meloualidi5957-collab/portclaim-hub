import React, { useState, useEffect } from 'react';
import axios from '../api/client';
import { useSelector } from 'react-redux';
import { Box, Typography, Grid, Paper, Card, CardContent } from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';

// Icônes
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutorenewIcon from '@mui/icons-material/Autorenew';

export default function DashboardPage() {
  const user = useSelector(state => state.auth.user);
  const [stats, setStats] = useState({
    totalUtilisateurs: 0, totalClients: 0, totalAgents: 0,
    totalReclamations: 0, reclamationsOuvertes: 0, reclamationsEnCours: 0, reclamationsResolues: 0
  });

  useEffect(() => {
    // On ne charge les statistiques globales que si c'est un Administrateur
    if (user?.role === 'ADMIN') {
      axios.get('/reclamations/stats')
        .then(res => setStats(res.data))
        .catch(err => console.error("Erreur de chargement des stats", err));
    }
  }, [user]);

  // Si ce n'est pas un Admin, on affiche un message d'accueil simple (tu pourras l'améliorer plus tard)
  if (user?.role !== 'ADMIN') {
    return (
      <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a' }}>
          Bienvenue, {user?.prenom} !
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', mt: 1 }}>
          Accédez à vos réclamations via le menu latéral.
        </Typography>
      </Box>
    );
  }

  // --- Préparation des données pour les graphiques Recharts ---
  
  const dataReclamations = [
    { name: 'Ouvertes', value: stats.reclamationsOuvertes },
    { name: 'En Cours', value: stats.reclamationsEnCours },
    { name: 'Résolues', value: stats.reclamationsResolues }
  ];

  const dataUtilisateurs = [
    { name: 'Clients', value: stats.totalClients },
    { name: 'Agents', value: stats.totalAgents }
  ];

  // Couleurs pour le graphique en camembert (PieChart)
  const COLORS = ['#8b5cf6', '#0ea5e9'];

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a' }}>
          Tableau de bord administrateur
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Vue d'ensemble et pilotage du système PortClaim.
        </Typography>
      </Box>

      {/* --- CARTES KPI (Indicateurs clés) --- */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        {/* Carte Total Utilisateurs */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderLeft: '5px solid #8b5cf6' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="overline" sx={{ fontWeight: 'bold', color: '#64748b' }}>Total Utilisateurs</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a' }}>{stats.totalUtilisateurs}</Typography>
              </Box>
              <PeopleAltIcon sx={{ fontSize: 40, color: '#8b5cf6', opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Carte Total Réclamations */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderLeft: '5px solid #0ea5e9' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="overline" sx={{ fontWeight: 'bold', color: '#64748b' }}>Total Réclamations</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a' }}>{stats.totalReclamations}</Typography>
              </Box>
              <AssignmentIcon sx={{ fontSize: 40, color: '#0ea5e9', opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Carte Réclamations en cours */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderLeft: '5px solid #f59e0b' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="overline" sx={{ fontWeight: 'bold', color: '#64748b' }}>En cours de traitement</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a' }}>{stats.reclamationsEnCours}</Typography>
              </Box>
              <AutorenewIcon sx={{ fontSize: 40, color: '#f59e0b', opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Carte Réclamations Résolues */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderLeft: '5px solid #10b981' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="overline" sx={{ fontWeight: 'bold', color: '#64748b' }}>Réclamations Résolues</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a' }}>{stats.reclamationsResolues}</Typography>
              </Box>
              <CheckCircleIcon sx={{ fontSize: 40, color: '#10b981', opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* --- SECTION GRAPHIQUES --- */}
      <Grid container spacing={3}>
        
        {/* Graphique en Barres : État des réclamations */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: 400 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: '#0f172a' }}>
              Répartition des Réclamations par Statut
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={dataReclamations} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Graphique Circulaire : Types d'utilisateurs */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: 400 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: '#0f172a' }}>
              Base Utilisateurs (Clients vs Agents)
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={dataUtilisateurs}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataUtilisateurs.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

      </Grid>

    </Box>
  );
}