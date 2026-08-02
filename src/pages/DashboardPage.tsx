import React, { useEffect, useState } from 'react';
import './DashboardPage.css';
import api from '../api/axios';

interface DashboardStats {
  students: number;
  courses: number;
  departments: number;
  grades: number;
}

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Greška pri učitavanju statistike:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dobrodošli! 👋</h1>
        <p>Pregled sistema za upravljanje studentima</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>👨‍🎓</div>
          <div className="stat-info">
            <h3>{loading ? '...' : stats?.students}</h3>
            <p>Studenata</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>📖</div>
          <div className="stat-info">
            <h3>{loading ? '...' : stats?.courses}</h3>
            <p>Kurseva</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>🏛️</div>
          <div className="stat-info">
            <h3>{loading ? '...' : stats?.departments}</h3>
            <p>Smerova</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>📝</div>
          <div className="stat-info">
            <h3>{loading ? '...' : stats?.grades}</h3>
            <p>Ocena</p>
          </div>
        </div>
      </div>
    </div>
  );
};