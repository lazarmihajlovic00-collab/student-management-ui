import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Glavna tabla (Dashboard)</h1>
      
      {user && (
        <div style={{ backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
          <p><strong>Ulogovani korisnik:</strong> {user.username}</p>
          <p><strong>Uloga (Role):</strong> {user.role}</p>
        </div>
      )}

      <button 
        onClick={handleLogout}
        style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Odjavi se
      </button>
    </div>
  );
};