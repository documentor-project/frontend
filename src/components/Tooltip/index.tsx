import { createContext, useContext, useRef, useState, type ReactNode } from 'react';

// ---- Types ----

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

type TooltipContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  placement: TooltipPlacement;
  tooltipId: string;
};

// ---- Context ----

const TooltipContext = createContext<TooltipContextType | null>(null);

const useTooltipCtx = () => {
  const ctx = useContext(TooltipContext);
  if (!ctx) throw new Error('Tooltip 하위 컴포넌트는 Tooltip 내부에서 사용해야 합니다.');
  return ctx;
};

// ---- Props ----

type TooltipProps = {
  children: ReactNode;
  placement?: TooltipPlacement;
};

type TriggerProps = {
  children: ReactNode;
  className?: string;
};

type ContentProps = {
  children: ReactNode;
  className?: string;
};

// ---- Position helpers ----

const PLACEMENT_CLASSES: Record<TooltipPlacement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

// ---- Root ----

let idCounter = 0;

function TooltipRoot({ children, placement = 'top' }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [tooltipId] = useState(() => `tooltip-${++idCounter}`);

  return (
    <TooltipContext.Provider value={{ open, setOpen, triggerRef, placement, tooltipId }}>
      <div className="relative inline-block">{children}</div>
    </TooltipContext.Provider>
  );
}

// ---- Trigger ----

function Trigger({ children, className = '' }: TriggerProps) {
  const { setOpen, triggerRef, tooltipId } = useTooltipCtx();

  return (
    <span
      ref={triggerRef as React.RefObject<HTMLSpanElement>}
      aria-describedby={tooltipId}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      className={`inline-block ${className}`}
    >
      {children}
    </span>
  );
}

// ---- Content ----

function Content({ children, className = '' }: ContentProps) {
  const { open, placement, tooltipId } = useTooltipCtx();

  return (
    <div
      id={tooltipId}
      role="tooltip"
      style={{ pointerEvents: open ? 'auto' : 'none' }}
      className={[
        'absolute z-50 w-max max-w-xs',
        PLACEMENT_CLASSES[placement],
        'transition-all duration-200',
        open ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
        className,
      ].join(' ')}
    >
      {/* Bubble */}
      <div
        style={{
          backgroundColor: '#5b4ee8',
          borderRadius: 'var(--radius-lg)',
          fontSize: 'var(--font-size-sm)',
          boxShadow: 'var(--shadow-md)',
          color: '#ffffff',
        }}
        className="px-4 py-2 leading-snug whitespace-nowrap"
      >
        {children}
      </div>
    </div>
  );
}

// ---- Export ----

const Tooltip = Object.assign(TooltipRoot, { Trigger, Content });

export default Tooltip;
