import { createContext, useContext } from 'react';

type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export type ToastContextType = {
  show: (message: string, variant?: ToastVariant, duration?: number) => void;
};

export const ToastContext = createContext<ToastContextType | null>(null);

export const useToastCtx = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast은 ToastProvider 내부에서 사용해야 합니다.');
  return ctx;
};