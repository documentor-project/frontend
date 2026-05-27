import { useMutation } from '@tanstack/react-query';
import { login, register } from '@/api/auth';
import type { LoginRequest, RegisterRequest } from '@/types/auth';

export const useLogin = () =>
  useMutation({
    mutationFn: (body: LoginRequest) => login(body),
  });

export const useRegister = () =>
  useMutation({
    mutationFn: (body: RegisterRequest) => register(body),
  });
