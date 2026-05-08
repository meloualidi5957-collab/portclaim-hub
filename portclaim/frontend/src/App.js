import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';
import axios from './api/client'; // --- AJOUT : Import d'axios pour le logout ---

// Pages
import LoginPage from './pages/LoginPage';
import ReclamationsPage from './pages/ReclamationsPage'; 
import ReclamationDetailsPage from './pages/ReclamationDetailsPage'; 
import NotificationsPage from './pages/NotificationsPage';
import UsersManagementPage from './pages/UsersManagementPage';
import AnalysesPage from './pages/AnalysesPage';
import AuditPage from './pages/AuditPage'; 

// Composants
import Sidebar from './components/Sidebar';
import { logout } from './store/actions/authActions';

function Layout({ children }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  // --- MODIFIÉ : handleLogout devient asynchrone pour l'Audit ---
  const handleLogout = async () => {
    try {
      // 1. On prévient le backend pour enregistrer l'action LOGOUT
      await axios.post('/auth/logout'); 
    } catch (err) {
      // On log l'erreur en console mais on continue la déconnexion locale
      console.error("Erreur lors de l'enregistrement du logout", err);
    } finally {
      // 2. Nettoyage local (LocalStorage + Redux) et redirection
      localStorage.clear();
      dispatch(logout());
      window.location.href = '/login';
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar user={user} onLogout={handleLogout} />
      <Box sx={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>
        {children}
      </Box>
    </Box>
  );
}

export default function App() {
  const token = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Route par défaut vers les réclamations */}
      <Route 
        path="/" 
        element={token ? <Layout><ReclamationsPage /></Layout> : <Navigate to="/login" />} 
      />
      
      <Route 
        path="/reclamations" 
        element={token ? <Layout><ReclamationsPage /></Layout> : <Navigate to="/login" />} 
      />
      
      <Route 
        path="/reclamations/:id" 
        element={token ? <Layout><ReclamationDetailsPage /></Layout> : <Navigate to="/login" />} 
      />
      
      <Route 
        path="/notifications" 
        element={token ? <Layout><NotificationsPage /></Layout> : <Navigate to="/login" />} 
      />

      <Route 
        path="/analyses" 
        element={
          token && user?.role === 'ADMIN' 
            ? <Layout><AnalysesPage /></Layout> 
            : <Navigate to="/reclamations" />
        } 
      />

      <Route 
        path="/utilisateurs" 
        element={
          token && user?.role === 'ADMIN' 
            ? <Layout><UsersManagementPage /></Layout> 
            : <Navigate to="/reclamations" />
        } 
      />

      <Route 
        path="/audit" 
        element={
          token && user?.role === 'ADMIN' 
            ? <Layout><AuditPage /></Layout> 
            : <Navigate to="/reclamations" />
        } 
      />

      <Route path="*" element={<Navigate to="/reclamations" />} />
    </Routes>
  );
}