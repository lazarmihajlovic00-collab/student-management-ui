import axios from 'axios';

const api = axios.create({
  // Ako postoji produkcijska URL adresa koristi nju, a ako radimo lokalno koristi localhost
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080', 
  headers: {
    'Content-Type': 'application/json',
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

// Response Interceptor: Otpakivanje "koverte" pri prijemu odgovora
api.interceptors.response.use(
  (response) => {
    // Axios pakuje odgovor u svoje 'data' polje.
    // Naš Spring Boot backend to dodatno pakuje u svoje 'data' polje { success, message, data: {...} }.
    // Zato proveravamo da li postoji response.data.data i ako postoji, vraćamo ga direktno!
    if (response.data && response.data.data) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Ako smo dobili 401, a nismo već pokušali da osvežimo token 
    // (_retry služi da ne uđemo u beskonačnu petlju)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          // Pokušavamo da osvežimo token!
          // Koristimo običan axios (ne naš 'api') da ne bismo okinuli iste interceptore u krug
          const refreshResponse = await axios.post('/auth/refresh', { refreshToken: refreshToken });
          // Običan axios ne otpakuje kovertu, pa moramo sami .data.data
          const newTokens = refreshResponse.data.data;

          // Sačuvaj nove tokene u LocalStorage
          localStorage.setItem('jwt_token', newTokens.accessToken);
          localStorage.setItem('refresh_token', newTokens.refreshToken);

          // Ažuriraj propali (originalni) zahtev novim tokenom i ponovi ga!
          originalRequest.headers['Authorization'] = `Bearer ${newTokens.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Ako je i Refresh Token istekao ili nevažeći, onda definitivno izbacujemo korisnika
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      } else {
        // Nema refresh tokena uopšte, odmah izbacuj
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    // NOVO: Ako je status 403, znači da korisnik nema ulogu (Role.ADMIN) za tu akciju
    if (error.response?.status === 403) {
      if (!error.response.data) {
        error.response.data = {};
      }
      error.response.data.message = "Nemate privilegije za ovu akciju (Samo Admin).";
    }

    return Promise.reject(error);
  }
);

export default api;