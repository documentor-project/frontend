import {
  createContext,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

// ---- Types ----

type ItemEntry = { value: string; label: string; disabled: boolean };

type SelectContextType = {
  selectedValue: string;
  onChange: (val: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  itemsMap: React.MutableRefObject<Map<string, ItemEntry>>;
  focusedValue: string | null;
  setFocusedValue: React.Dispatch<React.SetStateAction<string | null>>;
  listboxId: string;
  labelId: string;
  hasLabel: boolean;
  setHasLabel: React.Dispatch<React.SetStateAction<boolean>>;
};

const SelectContext = createContext<SelectContextType | null>(null);

const useSelectCtx = () => {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error('Select 하위 컴포넌트는 Select 내부에서 사용해야 합니다.');
  return ctx;
};

// ---- Props ----

type SelectProps = {
  value: string;
  onChange: (val: string) => void;
  children: ReactNode;
  disabled?: boolean;
};

type TriggerProps = {
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

type ContentProps = {
  children: ReactNode;
  className?: string;
};

type ItemProps = {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
};

type LabelProps = {
  children: ReactNode;
  className?: string;
};

// ---- Helpers ----

function getFirstEnabled(map: Map<string, ItemEntry>): string | null {
  for (const [v, entry] of map) {
    if (!entry.disabled) return v;
  }
  return null;
}

function getLastEnabled(map: Map<string, ItemEntry>): string | null {
  let last: string | null = null;
  for (const [v, entry] of map) {
    if (!entry.disabled) last = v;
  }
  return last;
}

function getAdjacentEnabled(
  map: Map<string, ItemEntry>,
  current: string | null,
  direction: 'next' | 'prev',
): string | null {
  const enabled = [...map.entries()].filter(([, e]) => !e.disabled).map(([v]) => v);
  if (enabled.length === 0) return null;
  const idx = enabled.indexOf(current ?? '');
  if (direction === 'next') return enabled[Math.min(idx + 1, enabled.length - 1)];
  return enabled[Math.max(idx - 1, 0)];
}

// ---- Root ----

function SelectRoot({ value, onChange, children, disabled }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [focusedValue, setFocusedValue] = useState<string | null>(null);
  const [hasLabel, setHasLabel] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const itemsMap = useRef<Map<string, ItemEntry>>(new Map());
  const listboxId = useId();
  const labelId = useId();

  return (
    <SelectContext.Provider
      value={{
        selectedValue: value,
        onChange,
        open,
        setOpen,
        triggerRef,
        itemsMap,
        focusedValue,
        setFocusedValue,
        listboxId,
        labelId,
        hasLabel,
        setHasLabel,
      }}
    >
      <div className="relative" data-disabled={disabled || undefined}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

// ---- Label ----

function Label({ children, className = '' }: LabelProps) {
  const { labelId, setHasLabel } = useSelectCtx();

  useEffect(() => {
    setHasLabel(true);
    return () => setHasLabel(false);
  }, [setHasLabel]);

  return (
    <p id={labelId} className={`mb-2 text-sm font-semibold text-[var(--color-text)] ${className}`}>
      {children}
    </p>
  );
}

// ---- Trigger ----

function Trigger({ placeholder = '선택하세요', className = '', disabled }: TriggerProps) {
  const {
    selectedValue,
    open,
    setOpen,
    triggerRef,
    itemsMap,
    setFocusedValue,
    listboxId,
    labelId,
    hasLabel,
  } = useSelectCtx();

  const displayLabel = selectedValue
    ? (itemsMap.current.get(selectedValue)?.label ?? selectedValue)
    : null;

  const handleClick = () => {
    if (disabled) return;
    setOpen((prev) => {
      if (!prev) setFocusedValue(selectedValue || getFirstEnabled(itemsMap.current));
      return !prev;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
      setFocusedValue(selectedValue || getFirstEnabled(itemsMap.current));
    }
  };

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-controls={listboxId}
      aria-labelledby={hasLabel ? labelId : undefined}
      className={[
        'flex w-full items-center justify-between px-4 py-3',
        'rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-white)]',
        'text-sm transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      ].join(' ')}
    >
      <span
        className={displayLabel ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}
      >
        {displayLabel ?? placeholder}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`ml-2 shrink-0 text-[var(--color-text-muted)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}

// ---- Content ----

function Content({ children, className = '' }: ContentProps) {
  const {
    open,
    setOpen,
    triggerRef,
    itemsMap,
    focusedValue,
    setFocusedValue,
    onChange,
    listboxId,
  } = useSelectCtx();

  const contentRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (open) contentRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (
        !contentRef.current?.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [open, setOpen, triggerRef]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        break;
      case 'Tab':
        setOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedValue(getAdjacentEnabled(itemsMap.current, focusedValue, 'next'));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedValue(getAdjacentEnabled(itemsMap.current, focusedValue, 'prev'));
        break;
      case 'Home':
        e.preventDefault();
        setFocusedValue(getFirstEnabled(itemsMap.current));
        break;
      case 'End':
        e.preventDefault();
        setFocusedValue(getLastEnabled(itemsMap.current));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedValue) {
          onChange(focusedValue);
          setOpen(false);
          triggerRef.current?.focus();
        }
        break;
    }
  };

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      id={listboxId}
      role="listbox"
      tabIndex={-1}
      aria-activedescendant={focusedValue ? `${listboxId}-${focusedValue}` : undefined}
      onKeyDown={handleKeyDown}
      style={{ boxShadow: 'var(--shadow-md)' }}
      className={[
        'absolute left-0 top-full z-50 mt-1 w-full',
        'overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-white)]',
        'py-1 outline-none',
        'transition-all duration-150',
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}

// ---- Item ----

function Item({ value, children, disabled = false, className = '' }: ItemProps) {
  const {
    selectedValue,
    onChange,
    setOpen,
    triggerRef,
    itemsMap,
    focusedValue,
    setFocusedValue,
    listboxId,
  } = useSelectCtx();

  useEffect(() => {
    const map = itemsMap.current;
    const label = typeof children === 'string' ? children : value;
    map.set(value, { value, label, disabled });
    return () => {
      map.delete(value);
    };
  }, [value, children, disabled, itemsMap]);

  const isSelected = selectedValue === value;
  const isFocused = focusedValue === value;

  const handleSelect = () => {
    if (disabled) return;
    onChange(value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div
      id={`${listboxId}-${value}`}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
      onClick={handleSelect}
      onMouseEnter={() => !disabled && setFocusedValue(value)}
      className={[
        'flex w-full cursor-pointer select-none items-center justify-between px-4 py-3 text-sm',
        'text-[var(--color-text)] transition-colors',
        isFocused ? 'bg-[var(--color-gray-100)]' : 'bg-transparent',
        disabled ? 'pointer-events-none opacity-40' : '',
        className,
      ].join(' ')}
    >
      <span>{children}</span>
      {isSelected && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )}
    </div>
  );
}

// ---- Export ----

const Select = Object.assign(SelectRoot, { Trigger, Content, Item, Label });

export default Select;
