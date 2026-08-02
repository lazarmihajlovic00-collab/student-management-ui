import api from './axios';
import type { Student, PageResponse, StudentRequest } from '../types/student';

// Funkcija za dohvatanje svih studenata (sa ugrađenom paginacijom)
export const getStudents = async (page = 0, size = 10): Promise<PageResponse<Student>> => {
  // Axios dodaje Bearer token iz interceptora, a vraćamo raspakovan 'data'
  const response = await api.get(`/api/students?page=${page}&size=${size}`);
  return response.data;
};

// Kreiranje novog studenta
export const addStudent = async (studentData: StudentRequest): Promise<void> => {
  await api.post('/api/students', studentData);
};

// Izmena postojećeg studenta (PUT)
export const updateStudent = async (id: number, studentData: StudentRequest): Promise<void> => {
  await api.put(`/api/students/${id}`, studentData);
};

// Brisanje studenta (DELETE)
export const deleteStudent = async (id: number): Promise<void> => {
  await api.delete(`/api/students/${id}`);
};

// Dodela smera studentu
export const assignDepartment = async (studentId: number, departmentId: number): Promise<void> => {
  await api.patch(`/api/students/${studentId}/department/${departmentId}`);
};

// Upis kursa studentu
export const assignCourse = async (studentId: number, courseId: number): Promise<void> => {
  await api.patch(`/api/students/${studentId}/course/${courseId}`);
};

// --- NOVE FUNKCIJE ZA FAZU 4 ---

export const graduateStudent = async (id: number): Promise<void> => {
  await api.patch(`/api/students/${id}/graduate`);
};

export const suspendStudent = async (id: number): Promise<void> => {
  await api.patch(`/api/students/${id}/suspend`);
};

export const activateStudent = async (id: number): Promise<void> => {
  await api.patch(`/api/students/${id}/activate`);
};

export const getStudentGPA = async (id: number): Promise<number> => {
  // Pošto ovaj endpoint vraća samo broj (Double) a ne naš standardni omotač, presretač ga drugačije vraća
  const response = await api.get(`/api/students/${id}/gpa`);
  return response.data;
};

export const searchStudents = async (query: string, type: 'name' | 'email'): Promise<Student[]> => {
  const response = await api.get(`/api/students/search/${type}?${type}=${query}`);
  // Lista se vraća u response (ili response.data zavisno od interceptora)
  return Array.isArray(response) ? response : response.data;
};