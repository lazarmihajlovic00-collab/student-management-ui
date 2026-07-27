import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

/**
 * Layout — Glavni kostur aplikacije nakon logovanja.
 *
 * Sadrži:
 * - Sidebar sa navigacionim linkovima
 * - Top header sa korisničkim informacijama
 * - Main content oblast gde se renderuju dete-rute (<Outlet />)
 */
export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      {/* ---- SIDEBAR ---- */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">🎓</span>
            <span className="sidebar-logo-text">StudentMS</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-link-icon">📊</span>
            Glavna tabla
          </NavLink>

          <NavLink
            to="/students"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-link-icon">👨‍🎓</span>
            Studenti
          </NavLink>

          <NavLink
            to="/courses"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-link-icon">📖</span>
            Kursevi
          </NavLink>

          <NavLink
            to="/departments"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-link-icon">🏛️</span>
            Smerovi
          </NavLink>

          <NavLink
            to="/grades"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-link-icon">📝</span>
            Ocene
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="sidebar-logout">
            <span className="sidebar-link-icon">🚪</span>
            Odjavi se
          </button>
        </div>
      </aside>

            {/* ---- MAIN AREA ---- */}
      <div className="main-wrapper">
        <header className="top-header">
          <h2 className="top-header-title">Student Management System</h2>
          
          <div className="top-header-user">
            {/* Prvo slovo imena korisnika (ili 'U' ako ime nije poznato) */}
            <div className="user-avatar">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
            <div className="user-info">
              {/* Pravo ime korisnika iz tokena */}
              <span className="user-name">{user?.name || 'Nepoznat Korisnik'}</span>
              
              {/* Prevodjenje role u čitljiv format */}
              <span className="user-role">
                {user?.role === 'ADMIN' ? 'Administrator' : 'Student'}
              </span>
            </div>
          </div>
        </header>

        <main className="main-content">
          {/* Ovde React Router renderuje trenutnu dete-stranicu */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};