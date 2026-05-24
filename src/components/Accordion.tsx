import { createContext, useContext, useState } from 'react';

type AccordionContextType = {
  openItem: string | null;
  toggle: (value: string) => void;
};

type ItemContextType = {
  value: string;
  isOpen: boolean;
};

const AccordionContext = createContext<AccordionContextType | null>(null);
const ItemContext = createContext<ItemContextType | null>(null);

const useAccordion = () => {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('Accordion 하위 컴포넌트는 Accordion 내부에서 사용해야 합니다.');
  return ctx;
};

const useItem = () => {
  const ctx = useContext(ItemContext);
  if (!ctx) throw new Error('Trigger/Content는 Accordion.Item 내부에서 사용해야 합니다.');
  return ctx;
};

type AccordionProps = {
  children: React.ReactNode;
  defaultOpen?: string;
  className?: string;
};

type ItemProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
};

type TriggerProps = {
  children: React.ReactNode;
  className?: string;
};

type ContentProps = {
  children: React.ReactNode;
  className?: string;
};

function AccordionRoot({ children, defaultOpen, className = '' }: AccordionProps) {
  const [openItem, setOpenItem] = useState<string | null>(defaultOpen ?? null);

  const toggle = (value: string) => {
    setOpenItem((prev) => (prev === value ? null : value));
  };

  return (
    <AccordionContext.Provider value={{ openItem, toggle }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
}

function Item({ value, children, className = '' }: ItemProps) {
  const { openItem } = useAccordion();
  const isOpen = openItem === value;

  return (
    <ItemContext.Provider value={{ value, isOpen }}>
      <div
        className={`border-b border-[var(--border)] ${className}`}
        data-state={isOpen ? 'open' : 'closed'}
      >
        {children}
      </div>
    </ItemContext.Provider>
  );
}

function Trigger({ children, className = '' }: TriggerProps) {
  const { toggle } = useAccordion();
  const { value, isOpen } = useItem();

  return (
    <button
      type="button"
      onClick={() => toggle(value)}
      aria-expanded={isOpen}
      className={`flex w-full items-center justify-between py-4 text-left text-sm font-medium text-[var(--text-h)] transition-colors hover:underline ${className}`}
    >
      {children}
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
        className={`shrink-0 text-[var(--text)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}

function Content({ children, className = '' }: ContentProps) {
  const { isOpen } = useItem();

  return (
    <div
      className="grid transition-[grid-template-rows] duration-200"
      style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
    >
      <div className="overflow-hidden">
        <div className={`pb-4 pt-0 text-sm text-[var(--text)] ${className}`}>{children}</div>
      </div>
    </div>
  );
}

const Accordion = Object.assign(AccordionRoot, {
  Item,
  Trigger,
  Content,
});

export default Accordion;
