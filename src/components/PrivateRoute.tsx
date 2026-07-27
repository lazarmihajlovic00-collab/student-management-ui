import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PrivateRoute — komponenta-čuvar za zaštićene rute.
 *
 * Ako je korisnik autentifikovan → prikazuje decu (children).
 * Ako nije → preusmerava na /login stranicu.
 *
 * Koristi se tako što obavija sadržaj zaštićene stranice:
 * <PrivateRoute>
 *   <DashboardPage />
 * </PrivateRoute>
 */

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Ako korisnik NIJE ulogovan, preusmeri ga na login stranicu
  // `replace` znači: zameni trenutnu stavku u browser istoriji,
  // da korisnik ne može da se vrati "nazad" na zaštićenu stranicu
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Ako JESTE ulogovan, prikaži ono što je zamotano unutar PrivateRoute
  return <>{children}</>;
};  