import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ToastContext } from '@/contexts/ToastContext';

// ---- Types ----

type ToastVariant = 'success' | 'error' | 'info' | 'warning';

type ToastItem = {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
};

// ---- Constants ----

const VARIANT_STYLES: Record<ToastVariant, { border: string; icon: string }> = {
  success: { border: '#059669', icon: '#059669' },
  error: { border: '#ef4444', icon: '#ef4444' },
  info: { border: '#5b4ee8', icon: '#5b4ee8' },
  warning: { border: '#f59e0b', icon: '#f59e0b' },
};

const ICON_PATHS: Record<ToastVariant, ReactNode> = {
  success: (
    <>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4 12 14.01l-3-3" />
    </>
  ),
  error: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6M9 9l6 6" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </>
  ),
  warning: (
    <>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4M12 17h.01" />
    </>
  ),
};

const DEFAULT_DURATION = 3000;

// ---- ToastItem Component ----

type ToastItemProps = {
  item: ToastItem;
  onRemove: (id: string) => void;
};

function ToastItemComponent({ item, onRemove }: ToastItemProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    setTimeout(() => onRemove(item.id), 300);
  }, [item.id, onRemove]);

  useEffect(() => {
    timerRef.current = setTimeout(dismiss, item.duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dismiss, item.duration]);

  const pauseTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const resumeTimer = () => {
    timerRef.current = setTimeout(dismiss, item.duration);
  };

  const variantStyle = VARIANT_STYLES[item.variant];

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      style={{
        boxShadow: 'var(--shadow-md)',
        borderLeft: `4px solid ${variantStyle.border}`,
      }}
      className={[
        'flex w-full max-w-sm items-start gap-3 rounded-[var(--radius-lg)] px-4 py-3',
        'bg-[var(--color-surface)] border border-[var(--color-border)]',
        'transition-all duration-300',
        visible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0',
      ].join(' ')}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke={variantStyle.icon}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 mt-0.5"
        aria-hidden="true"
      >
        {ICON_PATHS[item.variant]}
      </svg>
      <p className="flex-1 text-[var(--font-size-sm)] leading-snug text-[var(--color-text)]">
        {item.message}
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="알림 닫기"
        className="shrink-0 text-[var(--color-text-muted)] opacity-60 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] rounded"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ---- Provider ----

type ToastProviderProps = {
  children: ReactNode;
};

function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback(
    (message: string, variant: ToastVariant = 'info', duration = DEFAULT_DURATION) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, message, variant, duration }]);
    },
    [],
  );

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {createPortal(
        <div
          aria-label="알림 목록"
          className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-2"
        >
          {toasts.map((item) => (
            <ToastItemComponent key={item.id} item={item} onRemove={remove} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

export default ToastProvider;
