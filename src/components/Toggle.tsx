import { useId } from 'react';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
};

export default function Toggle({ checked, onChange, label, disabled = false, id }: Props) {
  const generatedId = useId();
  const toggleId = id ?? generatedId;

  return (
    <div className="toggle">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={label ? `${toggleId}-label` : undefined}
        id={toggleId}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={[
          'toggle__track',
          checked ? 'toggle__track--on' : '',
          disabled ? 'toggle__track--disabled' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className={`toggle__thumb${checked ? ' toggle__thumb--on' : ''}`} />
      </button>

      {label && (
        <span
          id={`${toggleId}-label`}
          className={`toggle__label${disabled ? ' toggle__label--disabled' : ''}`}
        >
          {label}
        </span>
      )}

      <span className={`toggle__state${checked ? ' toggle__state--on' : ''}`}>
        {checked ? 'ON' : 'OFF'}
      </span>
    </div>
  );
}
