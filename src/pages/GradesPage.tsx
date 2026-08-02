import React, { useEffect, useState } from 'react';
import { getGradesByStudent, addGrade } from '../api/gradeService';
import { getStudents } from '../api/studentService';
import { getCourses } from '../api/courseService';
import type { GradeResponse, GradeRequest } from '../types/grade';
import type { Student } from '../types/student';
import type { Course } from '../types/course';
import './StudentsPage.css';

export const GradesPage: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<number | ''>('');

    const [grades, setGrades] = useState<GradeResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Modal stanja
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<GradeRequest>({ studentId: 0, courseId: 0, value: 5, examDate: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);

    // Na početku učitavamo sve studente i kurseve (za padajuće menije)
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [studentsData, coursesData] = await Promise.all([
                    getStudents(0, 1000), // Uzimamo veliku stranicu da bismo dobili sve
                    getCourses(0, 1000)
                ]);
                setStudents(studentsData.content);
                setCourses(coursesData.content);
            } catch (err) {
                setError('Greška pri učitavanju studenata ili kurseva.');
            }
        };
        fetchDropdownData();
    }, []);

    // Kad god se promeni izabrani student, učitaj njegove ocene
    useEffect(() => {
        if (selectedStudentId !== '') {
            fetchGrades(Number(selectedStudentId));
        } else {
            setGrades([]); // Očisti tabelu ako niko nije izabran
        }
    }, [selectedStudentId]);

    const fetchGrades = async (studentId: number) => {
        try {
            setLoading(true);
            setError(null);
            const data = await getGradesByStudent(studentId);
            setGrades(data);
        } catch (err) {
            setError('Greška pri učitavanju ocena.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        if (selectedStudentId === '') return;
        setFormData({
            studentId: Number(selectedStudentId),
            courseId: courses.length > 0 ? courses[0].id : 0,
            value: 6,
            examDate: new Date().toISOString().split('T')[0] // Današnji datum u YYYY-MM-DD
        });
        setModalError(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            setModalError(null);
            await addGrade(formData);
            setIsModalOpen(false);
            if (selectedStudentId !== '') {
                fetchGrades(Number(selectedStudentId));
            }
        } catch (err: any) {
            setModalError(err.response?.data?.message || 'Greška pri čuvanju ocene!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Ocene</h1>
                <button
                    className="btn btn-primary"
                    onClick={handleAddClick}
                    disabled={selectedStudentId === '' || courses.length === 0}
                >
                    + Dodaj Ocenu
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* NOVO: Izbor Studenta */}
            <div style={{ marginBottom: '20px', background: 'var(--color-bg-card)', padding: '16px', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--color-border)' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>Izaberite studenta za pregled ocena:</label>
                <select
                    className="form-input"
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value ? Number(e.target.value) : '')}        >
                    <option value="">-- Izaberite studenta --</option>
                    {students.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                    ))}
                </select>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Student</th>
                            <th>Kurs</th>
                            <th>Ocena</th>
                            <th>Datum Polaganja</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedStudentId === '' ? (
                            <tr><td colSpan={5} className="text-center">Izaberite studenta iz padajućeg menija.</td></tr>
                        ) : loading ? (
                            <tr><td colSpan={5} className="text-center">Učitavanje ocena...</td></tr>
                        ) : grades.length === 0 ? (
                            <tr><td colSpan={5} className="text-center">Ovaj student još nema unetih ocena.</td></tr>
                        ) : (
                            grades.map((grade) => (
                                <tr key={grade.id}>
                                    <td>#{grade.id}</td>
                                    <td>{grade.studentName}</td>
                                    <td>{grade.courseName}</td>
                                    <td>
                                        <span className={`status-badge ${grade.value > 5 ? 'status-active' : 'status-danger'}`}>
                                            {grade.value}
                                        </span>
                                    </td>
                                    <td>{grade.examDate}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal za dodavanje ocene */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Dodaj Ocenu</h2>
                        {modalError && <div className="error-message" style={{ marginBottom: '1rem' }}>{modalError}</div>}
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Kurs</label>
                                <select
                                    className="form-input"
                                    value={formData.courseId}
                                    onChange={(e) => setFormData({ ...formData, courseId: Number(e.target.value) })}
                                    required
                                >
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Ocena</label>
                                <input type="number" min={5} max={10} required value={formData.value} onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })} className="form-input" />
                            </div>
                            <div className="form-group">
                                <label>Datum polaganja</label>
                                <input type="date" required value={formData.examDate} onChange={(e) => setFormData({ ...formData, examDate: e.target.value })} className="form-input" />
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