import api from './axios';
import type { Department, DepartmentRequest } from '../types/department';
import type { PageResponse } from '../types/student';

// Dohvatanje svih smerova (sa paginacijom)
export const getDepartments = async (page = 0, size = 10): Promise<PageResponse<Department>> => {
  const response = await api.get(`/api/departments?page=${page}&size=${size}`);
  return response.data;
};

// Kreiranje novog smera
export const addDepartment = async (data: DepartmentRequest): Promise<void> => {
  await api.post('/api/departments', data);
};