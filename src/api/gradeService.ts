import api from './axios';
import type { GradeResponse, GradeRequest } from '../types/grade';

export const getGradesByStudent = async (studentId: number): Promise<GradeResponse[]> => {
  const response = await api.get(`/api/grades/student/${studentId}`);
  return response.data; // Tvoj backend ovde vraća direktno listu, nema onog ApiResponse omotača!
};

export const addGrade = async (data: GradeRequest): Promise<GradeResponse> => {
  const response = await api.post('/api/grades', data);
  return response.data;
};