import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerApi } from '../api/authService';
import './LoginPage.css'; // Koristimo isti CSS kao za login

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await registerApi({ name, email, password });
      // Nakon uspešne registracije, šaljemo ga na login
      navigate('/login', { state: { message: 'Uspešna registracija! Sada se prijavite.' } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Greška pri registraciji. Možda email već postoji?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '450px' }}>
        <div className="login-header">
          <div className="login-icon">🎓</div>
          <h1 className="login-title">Registracija</h1>
          <p className="login-subtitle">Napravite novi nalog</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name" className="input-label">Ime i Prezime</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input-field" autoComplete="name" />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="input-label">Email adresa</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" autoComplete="email" />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="input-label">Lozinka</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={4} className="input-field" autoComplete="new-password" />
          </div>

          <button type="submit" disabled={isLoading} className="btn btn-primary login-btn">
            {isLoading ? 'Registrovanje...' : 'Registruj se'}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Već imate nalog? </span>
            <Link to="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 'bold' }}>Prijavite se</Link>
          </div>
        </form>
      </div>
    </div>
  );
};