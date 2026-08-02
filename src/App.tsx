import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PrivateRoute } from './components/PrivateRoute';
import { Layout } from './components/Layout';
import { StudentsPage } from './pages/StudentsPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { CoursesPage } from './pages/CoursesPage';
import { GradesPage } from './pages/GradesPage';
import { RegisterPage } from './pages/RegisterPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ako korisnik ode na pocetni URL (/), preusmeri ga na /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Javna ruta — dostupna svima */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Zaštićene rute — sve unutar Layout-a */}
          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/grades" element={<GradesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;