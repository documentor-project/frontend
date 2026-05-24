import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'kakao' | 'outline' | 'danger' | 'ghost' | 'chip';
type ButtonSize = 'sm' | 'md' | 'lg';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  selected?: boolean;
  isLoading?: boolean;
};

const BASE_STYLE =
  'inline-flex items-center justify-center font-medium transition-colors duration-150 focus:outline-none disabled:cursor-not-allowed';

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'h-9 min-w-[80px] px-6 text-[length:var(--font-size-sm)]',
  md: 'h-11 min-w-[100px] px-6 text-[length:var(--font-size-base)]',
  lg: 'h-[52px] px-8 text-[length:var(--font-size-lg)] font-semibold',
};

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-primary)] text-[color:var(--color-white)] rounded-[var(--radius-lg)] border-none hover:bg-[var(--color-primary-hover)] disabled:bg-[var(--color-primary-muted)]',
  kakao:
    'bg-[#FEE500] text-[color:var(--color-text)] rounded-[var(--radius-lg)] border-none hover:bg-[#F0D800] disabled:opacity-60',
  outline:
    'border border-[var(--color-gray-300)] text-[color:var(--color-text)] bg-[var(--color-white)] rounded-[var(--radius-md)] hover:bg-[var(--color-gray-50)] disabled:opacity-50',
  danger:
    'border border-[#EF4444] text-[#EF4444] bg-[var(--color-white)] rounded-[var(--radius-md)] hover:bg-[#FEF2F2] disabled:opacity-50',
  ghost:
    'bg-[var(--color-gray-100)] text-[color:var(--color-text)] rounded-[var(--radius-md)] border border-[var(--color-gray-300)] hover:bg-[var(--color-gray-200)] disabled:opacity-50',
  chip: 'h-9 min-w-[50px] border rounded-[var(--radius-md)] text-sm leading-normal px-4 py-2',
};

const CHIP_SELECTED =
  'bg-[var(--color-primary)] text-[color:var(--color-white)] border-[var(--color-primary)]';
const CHIP_UNSELECTED =
  'bg-[var(--color-white)] text-[color:var(--color-gray-500)] border-[var(--color-gray-300)] hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]';

const Button = ({
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  selected = false,
  isLoading = false,
  className = '',
  children,
  disabled,
  ...rest
}: Props) => {
  const sizeStyle = variant === 'chip' ? '' : SIZE_STYLES[size];

  const variantStyle =
    variant === 'chip'
      ? `${VARIANT_STYLES.chip} ${selected ? CHIP_SELECTED : CHIP_UNSELECTED}`
      : VARIANT_STYLES[variant];

  const widthStyle = fullWidth ? 'w-full' : 'w-auto self-start';

  return (
    <button
      disabled={disabled || isLoading}
      className={`${BASE_STYLE} ${sizeStyle} ${variantStyle} ${widthStyle} ${className}`}
      {...rest}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
