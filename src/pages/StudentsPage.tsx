import React, { useEffect, useState } from 'react';
import { getStudents, addStudent, updateStudent, deleteStudent } from '../api/studentService';
import type { Student, StudentRequest } from '../types/student';
import './StudentsPage.css';

export const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Stanja za Modal kreiranja/izmene
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<StudentRequest>({ name: '', email: '', age: 18 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  
  // NOVO: Pamćenje greške koja se desila pri unosu forme
  const [modalError, setModalError] = useState<string | null>(null);

  // NOVO: Stanja za Modal potvrde brisanja
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchStudents();
  }, [page]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents(page, 10);
      setStudents(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Greška pri učitavanju studenata.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'age' ? Number(value) : value }));
  };

  const handleAddClick = () => {
    setFormData({ name: '', email: '', age: 18 });
    setEditingStudentId(null);
    setModalError(null); // Očisti stare greške
    setIsModalOpen(true);
  };

  const handleEditClick = (student: Student) => {
    setFormData({ name: student.name, email: student.email, age: student.age });
    setEditingStudentId(student.id);
    setModalError(null); // Očisti stare greške
    setIsModalOpen(true);
  };

  // NOVO: Klik na kantu sada samo otvara naš modal
  const confirmDelete = (id: number) => {
    setStudentToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // NOVO: Izvršavanje brisanja
  const handleDelete = async () => {
    if (studentToDelete) {
      try {
        await deleteStudent(studentToDelete);
        setIsDeleteModalOpen(false);
        fetchStudents(); 
      } catch (err) {
        setError("Greška pri brisanju studenta.");
        setIsDeleteModalOpen(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setModalError(null); // Resetuj grešku

      if (editingStudentId) {
        await updateStudent(editingStudentId, formData);
      } else {
        await addStudent(formData);
      }
      
      setIsModalOpen(false);
      fetchStudents();
    } catch (err: any) {
      // Ako backend vrati grešku, hvatamo je i prikazujemo U MODALU (umesto alert-a)
      // Ako ne nađemo poruku, prikazujemo našu generičku (verovatno zauzet email)
      const errorMessage = err.response?.data?.message || "Došlo je do greške! Da li ovaj Email već postoji?";
      setModalError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Studenti</h1>
        <button className="btn btn-primary" onClick={handleAddClick}>
          + Dodaj Studenta
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ime i Prezime</th>
              <th>Email</th>
              <th>Status</th>
              <th>Smer</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center">Učitavanje podataka...</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan={6} className="text-center">Nema pronađenih studenata.</td></tr>
            ) : (
              students.map((student) => (
                <tr key={student.id}>
                  <td>#{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td><span className={`status-badge status-${student.status.toLowerCase()}`}>{student.status}</span></td>
                  <td>{student.departmentName || '—'}</td>
                  <td>
                    <button className="btn-action" onClick={() => handleEditClick(student)} title="Izmeni">✎</button>
                    {/* AŽURIRANO: Poziva confirmDelete umesto direktnog brisanja */}
                    <button className="btn-action btn-delete" onClick={() => confirmDelete(student.id)} title="Obriši">🗑️</button>
                  </td>
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

      {/* MODAL ZA KREIRANJE/IZMENU */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingStudentId ? 'Izmeni Studenta' : 'Novi Student'}</h2>
            
            {/* Prikaz greške direktno u modalu */}
            {modalError && <div className="error-message" style={{marginBottom: '1rem'}}>{modalError}</div>}

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                {/* AŽURIRANO: Dodati htmlFor i id */}
                <label htmlFor="studentName">Ime i Prezime</label>
                <input type="text" id="studentName" name="name" required minLength={2} value={formData.name} onChange={handleChange} className="form-input" autoComplete="name" />
              </div>
              <div className="form-group">
                <label htmlFor="studentEmail">Email adresa</label>
                <input type="email" id="studentEmail" name="email" required value={formData.email} onChange={handleChange} className="form-input" autoComplete="email" />
              </div>
              <div className="form-group">
                <label htmlFor="studentAge">Godine</label>
                <input type="number" id="studentAge" name="age" required min={16} max={100} value={formData.age} onChange={handleChange} className="form-input" />
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

      {/* NOVO: MODAL ZA POTVRDU BRISANJA */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth: '300px', textAlign: 'center'}}>
            <h2 style={{color: 'var(--color-danger)'}}>Pažnja!</h2>
            <p style={{margin: 'var(--space-lg) 0', color: 'var(--color-text-secondary)'}}>
              Da li ste sigurni da želite trajno da obrišete ovog studenta?
            </p>
            <div className="modal-actions" style={{justifyContent: 'center'}}>
              <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>Odustani</button>
              <button className="btn btn-primary" style={{backgroundColor: 'var(--color-danger)'}} onClick={handleDelete}>
                Obriši
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};