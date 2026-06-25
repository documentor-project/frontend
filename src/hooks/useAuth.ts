import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login, signUp, logout } from '@/api/auth';
import { ROUTES } from '@/constants/routes';
import type { LoginRequest, SignUpRequest } from '@/types/auth';

export const useLogin = () =>
  useMutation({
    mutationFn: (body: LoginRequest) => login(body),
  });

export const useRegister = () =>
  useMutation({
    mutationFn: (body: SignUpRequest) => signUp(body),
  });

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
    navigate(ROUTES.LOGIN, { replace: true });
  };
};
