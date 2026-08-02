import React, { useEffect, useState } from 'react';
import { getCourses, addCourse } from '../api/courseService';
import type { Course, CourseRequest } from '../types/course';
import './StudentsPage.css';
import { getDepartments } from '../api/departmentService';
import type { Department } from '../types/department';

export const CoursesPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [departments, setDepartments] = useState<Department[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<CourseRequest>({ name: '', code: '', credits: 6, maxStudents: 30, departmentId: 0 }); const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);

    useEffect(() => {
        fetchCourses();
        getDepartments(0, 100).then(res => setDepartments(res.content));
    }, [page]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await getCourses(page, 10);
            setCourses(data.content);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError('Greška pri učitavanju kurseva.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const numericFields = ['credits', 'maxStudents', 'departmentId'];
        setFormData(prev => ({
            ...prev,
            [name]: numericFields.includes(name) ? Number(value) : value,
        }));
    };

    const handleAddClick = () => {
        setFormData({
            name: '', code: '', credits: 6, maxStudents: 30,
            departmentId: departments.length > 0 ? departments[0].id : 0
        });
        setModalError(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            setModalError(null);
            await addCourse(formData);
            setIsModalOpen(false);
            fetchCourses();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Greška! Da li ovaj kod kursa već postoji?';
            setModalError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Kursevi</h1>
                <button className="btn btn-primary" onClick={handleAddClick}>+ Dodaj Kurs</button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Naziv kursa</th>
                            <th>Kod</th>
                            <th>Krediti (ESPB)</th>
                            <th>Max studenata</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="text-center">Učitavanje podataka...</td></tr>
                        ) : courses.length === 0 ? (
                            <tr><td colSpan={5} className="text-center">Nema pronađenih kurseva.</td></tr>
                        ) : (
                            courses.map((course) => (
                                <tr key={course.id}>
                                    <td>#{course.id}</td>
                                    <td>{course.name}</td>
                                    <td><span className="status-badge status-active">{course.code}</span></td>
                                    <td>{course.credits}</td>
                                    <td>{course.maxStudents}</td>
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
                        <h2>Novi Kurs</h2>
                        {modalError && <div className="error-message" style={{ marginBottom: '1rem' }}>{modalError}</div>}
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <div className="form-group">
                                    <label>Smer</label>
                                    <select className="form-input" name="departmentId" value={formData.departmentId} onChange={handleChange} required>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                                <label htmlFor="courseName">Naziv kursa</label>
                                <input type="text" id="courseName" name="name" required minLength={2} maxLength={100} value={formData.name} onChange={handleChange} className="form-input" placeholder="Programiranje 1" autoComplete="off" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="courseCode">Kod kursa</label>
                                <input type="text" id="courseCode" name="code" required minLength={2} maxLength={10} value={formData.code} onChange={handleChange} className="form-input" placeholder="PRG1" autoComplete="off" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="courseCredits">Broj kredita (ESPB)</label>
                                <input type="number" id="courseCredits" name="credits" required min={1} max={30} value={formData.credits} onChange={handleChange} className="form-input" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="courseMaxStudents">Maksimalan broj studenata</label>
                                <input type="number" id="courseMaxStudents" name="maxStudents" required min={5} max={300} value={formData.maxStudents} onChange={handleChange} className="form-input" />
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