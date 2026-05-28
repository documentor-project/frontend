import instance from '@/api/instance';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/constants/auth';
import type {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@/types/auth';

export const login = async (body: LoginRequest): Promise<LoginResponse> => {
  const { data } = await instance.post<LoginResponse>('/api/auth/login', body);
  localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  return data;
};

export const signUp = async (body: SignUpRequest): Promise<SignUpResponse> => {
  const { data } = await instance.post<SignUpResponse>('/api/auth/signup', body);
  return data;
};

export const refreshToken = async (body: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
  const { data } = await instance.post<RefreshTokenResponse>('/api/auth/refresh', body);
  localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  return data;
};

export const logout = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const kakaoLogin = (): void => {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/kakao`;
};
