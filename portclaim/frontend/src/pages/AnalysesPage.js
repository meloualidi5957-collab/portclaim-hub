import React, { useState, useEffect } from 'react';
import axios from '../api/client';
import { useSelector } from 'react-redux';
import { 
  Box, Typography, Grid, Paper, Card, CardContent, CircularProgress, 
  Divider, useTheme 
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

// Icônes
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function AnalysesPage() {
  const user = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUtilisateurs: 0, totalClients: 0, totalAgents: 0,
    totalReclamations: 0, reclamationsOuvertes: 0, reclamationsEnCours: 0, reclamationsResolues: 0,
    parPriorite: {}, tempsMoyenResolution: 0, evolutionData: []
  });

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      axios.get('/reclamations/stats')
        .then(res => {
          setStats(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Erreur de chargement des analyses", err);
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // --- Préparation des données ---
  const dataStatut = [
    { name: 'Ouvertes', value: stats.reclamationsOuvertes, color: '#6366f1' },
    { name: 'En Cours', value: stats.reclamationsEnCours, color: '#f59e0b' },
    { name: 'Résolues', value: stats.reclamationsResolues, color: '#10b981' }
  ];

  const dataPriorite = Object.entries(stats.parPriorite || {}).map(([key, val]) => ({
    name: key,
    value: val
  }));

  const dataUtilisateurs = [
    { name: 'Clients', value: stats.totalClients },
    { name: 'Agents', value: stats.totalAgents }
  ];

  const COLORS_ROLES = ['#8b5cf6', '#0ea5e9'];
  const PRIORITY_COLORS = {
    CRITIQUE: '#ef4444',
    HAUTE: '#f97316',
    NORMALE: '#10b981',
    BASSE: '#94a3b8'
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a' }}>
          Analyses Avancées
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Pilotage des performances et suivi des indicateurs PortClaim.
        </Typography>
      </Box>

      {/* --- CARTES KPI --- */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, borderLeft: '5px solid #8b5cf6', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="overline" sx={{ fontWeight: 'bold', color: '#64748b' }}>Utilisateurs</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>{stats.totalUtilisateurs}</Typography>
              </Box>
              <PeopleAltIcon sx={{ fontSize: 40, color: '#8b5cf6', opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, borderLeft: '5px solid #0ea5e9', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="overline" sx={{ fontWeight: 'bold', color: '#64748b' }}>Total Réclamations</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>{stats.totalReclamations}</Typography>
              </Box>
              <AssignmentIcon sx={{ fontSize: 40, color: '#0ea5e9', opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, borderLeft: '5px solid #10b981', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="overline" sx={{ fontWeight: 'bold', color: '#64748b' }}>Taux de Résolution</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                  {stats.totalReclamations > 0 ? Math.round((stats.reclamationsResolues / stats.totalReclamations) * 100) : 0}%
                </Typography>
              </Box>
              <CheckCircleIcon sx={{ fontSize: 40, color: '#10b981', opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, borderLeft: '5px solid #f43f5e', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="overline" sx={{ fontWeight: 'bold', color: '#64748b' }}>Temps Moyen (H)</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>{stats.tempsMoyenResolution}</Typography>
              </Box>
              <AccessTimeFilledIcon sx={{ fontSize: 40, color: '#f43f5e', opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* --- GRAPHIQUES --- */}
      <Grid container spacing={3}>
        
        {/* 1. Évolution Temporelle (Pics de réclamations) */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3, height: 350, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <TrendingUpIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Évolution des dépôts (7 derniers jours)</Typography>
            </Box>
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={stats.evolutionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* 2. Volume par Statut */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, height: 400, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Volume par Statut</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={dataStatut}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {dataStatut.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* 3. Volume par Priorité */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, height: 400, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Analyse des Priorités</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={dataPriorite} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {dataPriorite.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name] || '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* 4. Répartition des Rôles */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, height: 400, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Répartition des Rôles</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie data={dataUtilisateurs} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                  {dataUtilisateurs.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_ROLES[index % COLORS_ROLES.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
}