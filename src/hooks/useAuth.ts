import { useMutation } from '@tanstack/react-query';
import { login, signUp } from '@/api/auth';
import type { LoginRequest, SignUpRequest } from '@/types/auth';

export const useLogin = () =>
  useMutation({
    mutationFn: (body: LoginRequest) => login(body),
  });

export const useRegister = () =>
  useMutation({
    mutationFn: (body: SignUpRequest) => signUp(body),
  });
