import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type ModalSize = 'sm' | 'md';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
};

const SIZE_STYLES: Record<ModalSize, string> = {
  sm: 'w-full max-w-sm',
  md: 'w-full max-w-md',
};

const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }: Props) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // body 스크롤 잠금
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

      {/* 다이얼로그 */}
      <div
        ref={dialogRef}
        className={`relative flex flex-col bg-[var(--color-white)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] ${SIZE_STYLES[size]}`}
      >
        {/* 헤더 */}
        {title && (
          <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b border-[var(--color-border)]">
            <h2 id="modal-title" className="text-[20px] font-bold text-[var(--color-text)]">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 transition-colors duration-150 rounded-[var(--radius-md)] text-[var(--color-gray-400)] hover:bg-[var(--color-gray-100)] hover:text-[var(--color-text)]"
              aria-label="닫기"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* 본문 */}
        <div className="px-8 py-6 text-[15px] text-[var(--color-text)] leading-relaxed">
          {children}
        </div>

        {/* 푸터 */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-8 pt-4 pb-7">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
