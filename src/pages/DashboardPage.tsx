import React from 'react';
import './DashboardPage.css';

export const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-welcome">
        <h1 className="dashboard-title">Dobrodošli! 👋</h1>
        <p className="dashboard-subtitle">
          Pregled sistema za upravljanje studentima
        </p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon stat-icon-students">👨‍🎓</div>
          <div className="stat-info">
            <span className="stat-value">—</span>
            <span className="stat-label">Studenata</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-courses">📖</div>
          <div className="stat-info">
            <span className="stat-value">—</span>
            <span className="stat-label">Kurseva</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-departments">🏛️</div>
          <div className="stat-info">
            <span className="stat-value">—</span>
            <span className="stat-label">Smerova</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-grades">📝</div>
          <div className="stat-info">
            <span className="stat-value">—</span>
            <span className="stat-label">Ocena</span>
          </div>
        </div>
      </div>
    </div>
  );
};