import api from './axios';
import type { Course, CourseRequest } from '../types/course';
import type { PageResponse } from '../types/student';

export const getCourses = async (page = 0, size = 10): Promise<PageResponse<Course>> => {
  const response = await api.get(`/api/courses?page=${page}&size=${size}`);
  return response.data;
};

export const addCourse = async (data: CourseRequest): Promise<void> => {
  await api.post('/api/courses', data);
};