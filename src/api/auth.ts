import instance from '@/api/instance';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth';

export const login = async (body: LoginRequest): Promise<AuthResponse> => {
  const { data } = await instance.post<AuthResponse>('/auth/login', body);
  return data;
};

export const register = async (body: RegisterRequest): Promise<AuthResponse> => {
  const { data } = await instance.post<AuthResponse>('/auth/register', body);
  return data;
};

export const kakaoLogin = (): void => {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/kakao`;
};
