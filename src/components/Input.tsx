import type { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  suffix?: React.ReactNode;
};

const BASE_INPUT =
  'w-full px-4 py-2 h-9 text-[length:var(--font-size-base)] text-[color:var(--color-text)] bg-[var(--color-white)] border border-[var(--color-border)] rounded-[var(--radius-md)] outline-none transition-colors duration-150 placeholder:text-[color:var(--color-gray-400)] focus:border-[var(--color-primary)] disabled:bg-[var(--color-gray-100)] disabled:text-[color:var(--color-gray-500)] disabled:cursor-not-allowed';

const ERROR_INPUT = 'border-[#EF4444] focus:border-[#EF4444]';

const Input = ({ label, error, suffix, id, className = '', ...rest }: Props) => {
  const inputId = id ?? label?.replace(/\s+/g, '-').toLowerCase();
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-[var(--spacing-sm)] w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[length:var(--font-size-base)] font-semibold text-[color:var(--color-text)]"
        >
          {label}
        </label>
      )}
      <div className="flex items-center gap-2 w-full">
        <input
          id={inputId}
          className={`${BASE_INPUT} ${hasError ? ERROR_INPUT : ''} ${className}`}
          {...rest}
        />
        {suffix && <div className="flex-shrink-0">{suffix}</div>}
      </div>
      {hasError && (
        <span className="text-[length:var(--font-size-sm)] text-[#EF4444]">{error}</span>
      )}
    </div>
  );
};

export default Input;
