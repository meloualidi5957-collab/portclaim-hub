import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

// Composants
import Sidebar from './components/Sidebar';
import { logout } from './store/actions/authActions';

// Cette fonction définit la structure de l'app une fois connecté
function Layout({ children }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    window.location.href = '/login';
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Notre nouvelle Sidebar "Tech" */}
      <Sidebar user={user} onLogout={handleLogout} />
      
      {/* Le contenu principal qui va changer selon la route */}
      <Box sx={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>
        {children}
      </Box>
    </Box>
  );
}

export default function App() {
  const token = useSelector(state => state.auth.token);

  return (
    <Routes>
      {/* Route publique */}
      <Route path="/login" element={<LoginPage />} />

      {/* Routes protégées par le Layout et le Token */}
      <Route 
        path="/" 
        element={
          token ? (
            <Layout>
              <DashboardPage />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        } 
      />

      {/* Redirection par défaut */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}