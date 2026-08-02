import api from './axios';
import type { LoginRequest, AuthResponse, RegisterRequest } from '../types/auth';

export const loginApi = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

export const registerApi = async (data: RegisterRequest): Promise<void> => {
  await api.post('/auth/register', data);
};

//Šaljemo refresh token backendu kako bi ga uništio u bazi
export const logoutApi = async (refreshToken: string): Promise<void> => {
  await api.post('/auth/logout', { refreshToken });
};