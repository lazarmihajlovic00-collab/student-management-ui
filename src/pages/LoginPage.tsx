import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  // 1. Lokalne promenljive za praćenje onoga što korisnik kuca u input polja
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 2. Izvlačenje funkcije za login iz našeg AuthContext-a i navigate za promenu rute
  const { login } = useAuth();
  const navigate = useNavigate();

  // 3. Funkcija koja se okida kada korisnik klikne na dugme ili pritisne Enter
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Sprečava klasično osvežavanje stranice
    setError('');

    try {
      await login({ username, password });
      // Ako login uspe, preusmeri korisnika na Dashboard
      navigate('/dashboard');
    } catch (err) {
      setError('Neispravno korisničko ime ili lozinka.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Prijava na sistem</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Korisničko ime:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Lozinka:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Prijavi se
        </button>
      </form>
    </div>
  );
};