import React, { createContext, useState, useContext, type ReactNode } from 'react';
import type { AuthResponse, LoginRequest } from '../types/auth';
import { loginApi } from '../api/authService';

// 1. Definišemo šta sve Context pruža celoj aplikaciji
interface AuthContextType {
  user: AuthResponse | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// 2. Kreiranje samog Contexta
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Provider komponenta koja obavija celu aplikaciju
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(() => {
    // Pri pokretanju, proveri da li već imamo sačuvan token i podatke u LocalStorage-u
    const savedToken = localStorage.getItem('jwt_token');
    const savedUsername = localStorage.getItem('username');
    const savedRole = localStorage.getItem('role');

    if (savedToken && savedUsername && savedRole) {
      return { token: savedToken, username: savedUsername, role: savedRole };
    }
    return null;
  });

  // Funkcija za prijavu
  const login = async (credentials: LoginRequest) => {
    const data = await loginApi(credentials);
    
    // Sačuvaj u pregledaču (da ostane ulogovan i ako osveži stranicu)
    localStorage.setItem('jwt_token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('role', data.role);

    // Ažuriranje React stanja
    setUser(data);
  };

  // Funkcija za odjavu
  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Custom Hook za lakše korišćenje u drugim komponentama
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth mora biti korišćen unutar AuthProvider-a');
  }
  return context;
};