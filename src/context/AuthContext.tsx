import React, { createContext, useState, useContext, type ReactNode } from 'react';
import type { LoginRequest, UserPayload } from '../types/auth';
import { loginApi, logoutApi } from '../api/authService';
import {jwtDecode} from 'jwt-decode'; 

// 1. Definišemo šta sve Context pruža celoj aplikaciji
interface AuthContextType {
  token: string | null;
  user: UserPayload | null; //Cela app ima info o korisniku
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// 2. Kreiranje samog Contexta
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Provider komponenta koja obavija celu aplikaciju
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    // Pri pokretanju, proveri da li već imamo sačuvan token u LocalStorage-u
    return localStorage.getItem('jwt_token');
  });

  //Dodavanje posebnog stanja za trenutnog korisnika, koje se inicijalizuje iz tokena ako postoji
  const [user, setUser] = useState<UserPayload | null>(() => {
    const savedToken = localStorage.getItem('jwt_token');
    if (savedToken) {
      try {
        //Ako postoji token pri učitavanju, odmah ga dekodiraj i postavi user state
        return jwtDecode<UserPayload>(savedToken);
      } catch (error) {
        return null; // Ako je token nevažeći, vrati null 
      }
    }
    return null;
  });
    

  // Funkcija za prijavu
  const login = async (credentials: LoginRequest) => {
    const data = await loginApi(credentials);
    
    // Sačuvaj tokene u pregledaču
    localStorage.setItem('jwt_token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);

    // Ažuriranje React stanja
    setToken(data.accessToken);

    //Dekodiranje tokena na licu mesta i čuvamo podatke korisnika
    const decodeUser = jwtDecode<UserPayload>(data.accessToken);
    setUser(decodeUser); 
  };

  // Funkcija za odjavu
    const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    
    // 1. Prvo javi backendu da uništi token u bazi (ako postoji)
    if (refreshToken) {
      try {
        await logoutApi(refreshToken);
      } catch (error) {
        console.error("Greška pri odjavi na serveru", error);
      }
    }

    // 2. Zatim ga izbriši iz browsera i očisti stanje
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user,login, logout, isAuthenticated: !!token }}>
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