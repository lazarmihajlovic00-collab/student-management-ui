import axios from 'axios';

// Osnovna konfiguracija ka Spring Boot backendu
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Kasnije ovde ide Render URL
  headers: {
    'Content-Type': 'json',
  },
});

// Interceptor: Pre nego što pošalje bilo koji zahtev, proveri ima li token u memoriji
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;