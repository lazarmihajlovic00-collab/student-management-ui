import React, { useEffect, useState } from 'react';
import { getDepartments, addDepartment } from '../api/departmentService';
import type { Department, DepartmentRequest } from '../types/department';
import './StudentsPage.css'; // Koristimo iste stilove — tabela, modali, paginacija su identični

export const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal stanja
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<DepartmentRequest>({ name: '', code: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, [page]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await getDepartments(page, 10);
      setDepartments(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Greška pri učitavanju smerova.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setFormData({ name: '', code: '' });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setModalError(null);
      await addDepartment(formData);
      setIsModalOpen(false);
      fetchDepartments();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Greška! Da li ovaj kod smera već postoji?';
      setModalError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Smerovi</h1>
        <button className="btn btn-primary" onClick={handleAddClick}>+ Dodaj Smer</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Naziv smera</th>
              <th>Kod</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="text-center">Učitavanje podataka...</td></tr>
            ) : departments.length === 0 ? (
              <tr><td colSpan={3} className="text-center">Nema pronađenih smerova.</td></tr>
            ) : (
              departments.map((dept) => (
                <tr key={dept.id}>
                  <td>#{dept.id}</td>
                  <td>{dept.name}</td>
                  <td><span className="status-badge status-active">{dept.code}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && totalPages > 1 && (
        <div className="pagination">
          <button className="btn" disabled={page === 0} onClick={() => setPage(page - 1)}>Prethodna</button>
          <span>Strana {page + 1} od {totalPages}</span>
          <button className="btn" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Sledeća</button>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Novi Smer</h2>
            {modalError && <div className="error-message" style={{ marginBottom: '1rem' }}>{modalError}</div>}
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="deptName">Naziv smera</label>
                <input type="text" id="deptName" name="name" required minLength={3} maxLength={100} value={formData.name} onChange={handleChange} className="form-input" placeholder="Informatika" autoComplete="off" />
              </div>
              <div className="form-group">
                <label htmlFor="deptCode">Kod smera</label>
                <input type="text" id="deptCode" name="code" required minLength={2} maxLength={10} value={formData.code} onChange={handleChange} className="form-input" placeholder="INF" autoComplete="off" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Otkaži</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Čuvanje...' : 'Sačuvaj'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};