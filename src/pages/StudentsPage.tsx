import React, { useEffect, useState } from 'react';
import {
  getStudents, addStudent, updateStudent, deleteStudent, assignDepartment, assignCourse,
  graduateStudent, suspendStudent, activateStudent, getStudentGPA, searchStudents
} from '../api/studentService'; import { getDepartments } from '../api/departmentService';
import { getCourses } from '../api/courseService';
import type { Student, StudentRequest } from '../types/student';
import type { Department } from '../types/department';
import type { Course } from '../types/course';
import './StudentsPage.css';

export const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<StudentRequest>({ name: '', email: '', age: 18 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);

  // NOVO: Stanja za Modal za UPRAVLJANJE
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [managingStudent, setManagingStudent] = useState<Student | null>(null);

  // Podaci za padajuće menije (učitaćemo ih kad se otvori Manage modal)
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [selectedDeptId, setSelectedDeptId] = useState<number | ''>('');
  const [selectedCourseId, setSelectedCourseId] = useState<number | ''>('');
  const [manageError, setManageError] = useState<string | null>(null);
  const [manageSuccess, setManageSuccess] = useState<string | null>(null);
  // NOVO: Stanja za pretragu
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'email'>('name');
  const [isSearching, setIsSearching] = useState(false);

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

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      fetchStudents();
      return;
    }
    try {
      setLoading(true);
      setIsSearching(true);
      const results = await searchStudents(searchQuery, searchType);
      setStudents(results || []);
      setTotalPages(1); // Kad tražimo, prikazujemo sve rezultate na jednoj strani
    } catch (err) {
      setError('Greška pri pretrazi.');
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
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (student: Student) => {
    setFormData({ name: student.name, email: student.email, age: student.age });
    setEditingStudentId(student.id);
    setModalError(null);
    setIsModalOpen(true);
  };

  const confirmDelete = (id: number) => {
    setStudentToDelete(id);
    setIsDeleteModalOpen(true);
  };

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
      setModalError(null);
      if (editingStudentId) {
        await updateStudent(editingStudentId, formData);
      } else {
        await addStudent(formData);
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Došlo je do greške! Da li ovaj Email već postoji?";
      setModalError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // NOVO: Otvaranje modala za upravljanje
  const handleManageClick = async (student: Student) => {
    setManagingStudent(student);
    setManageError(null);
    setManageSuccess(null);
    setIsManageModalOpen(true);

    // Učitavamo smerove i kurseve samo kada otvorimo ovaj modal
    try {
      const [deptData, courseData] = await Promise.all([
        getDepartments(0, 100),
        getCourses(0, 100)
      ]);
      setDepartments(deptData.content);
      setCourses(courseData.content);
      setSelectedDeptId('');
      setSelectedCourseId('');
    } catch (err) {
      setManageError("Greška pri učitavanju smerova/kurseva.");
    }
  };

  // NOVO: Dodela Smera
  const handleAssignDepartment = async () => {
    if (!managingStudent || selectedDeptId === '') return;
    try {
      setManageError(null);
      await assignDepartment(managingStudent.id, Number(selectedDeptId));
      setManageSuccess("Smer je uspešno dodeljen!");
      fetchStudents(); // Osveži tabelu u pozadini
    } catch (err: any) {
      setManageError(err.response?.data?.message || "Greška pri dodeli smera.");
      setManageSuccess(null);
    }
  };

  // NOVO: Upis Kursa
  const handleAssignCourse = async () => {
    if (!managingStudent || selectedCourseId === '') return;
    try {
      setManageError(null);
      await assignCourse(managingStudent.id, Number(selectedCourseId));
      setManageSuccess("Kurs je uspešno upisan!");
      fetchStudents();
    } catch (err: any) {
      // Ovde će Spring Boot vratiti grešku ako npr. student nema smer, ili su puni kapaciteti!
      setManageError(err.response?.data?.message || "Greška pri upisu kursa.");
      setManageSuccess(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Studenti</h1>
        <button className="btn btn-primary" onClick={handleAddClick}>+ Dodaj Studenta</button>
      </div>

      {error && <div className="error-message">{error}</div>}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', background: 'var(--color-bg-secondary)', padding: '15px', borderRadius: '8px' }}>
        <select className="form-input" style={{ width: 'auto' }} value={searchType} onChange={(e) => setSearchType(e.target.value as 'name' | 'email')}>
          <option value="name">Pretraga po imenu</option>
          <option value="email">Pretraga po email-u</option>
        </select>
        <input
          type="text"
          className="form-input"
          placeholder="Unesite termin za pretragu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn btn-primary" onClick={handleSearch}>Pretraži</button>
        {isSearching && <button className="btn btn-secondary" onClick={() => { setSearchQuery(''); setIsSearching(false); fetchStudents(); }}>Poništi</button>}
      </div>
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
                    {/* NOVO DUGME ZA UPRAVLJANJE */}
                    <button className="btn-action" onClick={() => handleManageClick(student)} title="Upravljanje studentom">⚙️</button>

                    <button className="btn-action" onClick={() => handleEditClick(student)} title="Izmeni">✎</button>
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
            {modalError && <div className="error-message" style={{ marginBottom: '1rem' }}>{modalError}</div>}
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
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

      {/* MODAL ZA POTVRDU BRISANJA */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '300px', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--color-danger)' }}>Pažnja!</h2>
            <p style={{ margin: 'var(--space-lg) 0', color: 'var(--color-text-secondary)' }}>
              Da li ste sigurni da želite trajno da obrišete ovog studenta?
            </p>
            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>Odustani</button>
              <button className="btn btn-primary" style={{ backgroundColor: 'var(--color-danger)' }} onClick={handleDelete}>
                Obriši
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOVO: MODAL ZA UPRAVLJANJE STUDENTOM */}
      {isManageModalOpen && managingStudent && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <h2>Upravljanje: {managingStudent.name}</h2>

            {manageError && <div className="error-message" style={{ marginBottom: '1rem' }}>{manageError}</div>}
            {manageSuccess && <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--color-success)', padding: '10px', borderRadius: 'var(--border-radius-sm)', marginBottom: '1rem', border: '1px solid var(--color-success)' }}>{manageSuccess}</div>}

            {/* SEkCIJA 1: DODELA SMERA */}
            <div style={{ background: 'var(--color-bg-main)', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
              <h3 style={{ marginBottom: '10px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>1. Dodeli Smer</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select className="form-input" value={selectedDeptId} onChange={(e) => setSelectedDeptId(e.target.value ? Number(e.target.value) : '')}>
                  <option value="">-- Izaberite smer --</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name} ({d.code})</option>)}
                </select>
                <button className="btn btn-primary" onClick={handleAssignDepartment} disabled={selectedDeptId === ''}>
                  Dodeli
                </button>
              </div>
              <small style={{ color: 'var(--color-text-muted)', display: 'block', marginTop: '5px' }}>
                Trenutni smer: {managingStudent.departmentName || 'Nije dodeljen'}
              </small>
            </div>

            {/* SEkCIJA 2: UPIS KURSA */}
            <div style={{ background: 'var(--color-bg-main)', padding: '15px', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '10px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>2. Upiši Kurs</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select className="form-input" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value ? Number(e.target.value) : '')}>
                  <option value="">-- Izaberite kurs --</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button className="btn btn-primary" onClick={handleAssignCourse} disabled={selectedCourseId === ''}>
                  Upiši
                </button>
              </div>
              <small style={{ color: 'var(--color-text-muted)', display: 'block', marginTop: '5px' }}>
                * Spring Boot će odbiti upis ako kurs ne pripada studentovom smeru!
              </small>
            </div>

            {/* SEKCIJA 3: STATUS STUDENTA */}
            <div style={{ background: 'var(--color-bg-main)', padding: '15px', borderRadius: '8px', marginTop: '15px' }}>
              <h3 style={{ marginBottom: '10px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>3. Promena Statusa</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn" style={{ background: '#10B981', color: 'white' }}
                  onClick={async () => {
                    try { await graduateStudent(managingStudent.id); setManageSuccess("Student je diplomirao!"); fetchStudents(); }
                    catch (err: any) { setManageError(err.response?.data?.message || "Greška pri diplomiranju"); }
                  }}>Diplomiraj</button>

                <button className="btn" style={{ background: '#F59E0B', color: 'white' }}
                  onClick={async () => {
                    try { await suspendStudent(managingStudent.id); setManageSuccess("Student je suspendovan!"); fetchStudents(); }
                    catch (err: any) { setManageError(err.response?.data?.message || "Greška pri suspenziji"); }
                  }}>Suspenduj</button>

                <button className="btn" style={{ background: '#3B82F6', color: 'white' }}
                  onClick={async () => {
                    try { await activateStudent(managingStudent.id); setManageSuccess("Student je ponovo aktivan!"); fetchStudents(); }
                    catch (err: any) { setManageError(err.response?.data?.message || "Greška pri aktivaciji"); }
                  }}>Aktiviraj</button>
              </div>
            </div>

            {/* SEKCIJA 4: PROSEK OCENA (GPA) */}
            <div style={{ background: 'var(--color-bg-main)', padding: '15px', borderRadius: '8px', marginTop: '15px' }}>
              <h3 style={{ marginBottom: '10px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>4. Akademski Uspesi</h3>
              <button className="btn btn-secondary" style={{ width: '100%' }} onClick={async () => {
                try {
                  const gpa = await getStudentGPA(managingStudent.id);
                  setManageSuccess(`Trenutni prosek ocena: ${gpa.toFixed(2)}`);
                } catch (err) {
                  setManageError("Student trenutno nema nijednu ocenu.");
                }
              }}>Izračunaj Prosek (GPA)</button>
            </div>

            <div className="modal-actions" style={{ marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsManageModalOpen(false)}>Zatvori</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};