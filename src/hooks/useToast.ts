import { useToastCtx } from '@/contexts/ToastContext';

const useToast = () => {
  const { show } = useToastCtx();

  return {
    success: (message: string, duration?: number) => show(message, 'success', duration),
    error: (message: string, duration?: number) => show(message, 'error', duration),
    info: (message: string, duration?: number) => show(message, 'info', duration),
    warning: (message: string, duration?: number) => show(message, 'warning', duration),
  };
};

export default useToast;
