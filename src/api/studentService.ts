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