import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import store from './store/store';
import App from './App';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0a3d62' },
    secondary: { main: '#e58e26' },
    background: { default: '#f4f6f8' }
  },
  shape: { borderRadius: 10 }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);
