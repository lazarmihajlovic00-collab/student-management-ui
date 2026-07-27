import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PrivateRoute } from './components/PrivateRoute';
import { Layout } from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ako korisnik ode na pocetni URL (/), preusmeri ga na /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Javna ruta — dostupna svima */}
          <Route path="/login" element={<LoginPage />} />

          {/* Zaštićene rute — sve unutar Layout-a */}
          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* Ovde ćemo dodavati buduće stranice:
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/grades" element={<GradesPage />} />
            */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;