import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  // On retire le Content-Type forcé en JSON pour laisser Axios gérer les fichiers (FormData)
});

// Ce code ajoute automatiquement ton Token JWT à chaque appel API
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;