import api from './axios';
import type { LoginRequest, AuthResponse } from '../types/auth';

export const loginApi = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};