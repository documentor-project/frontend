import { type ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';

type Props = { children: ReactNode };

const Layout = ({ children }: Props) => (
  <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
    <Sidebar />
    <main className="flex-1 min-w-0 overflow-auto">
      <div className="px-8 py-8 lg:px-10 lg:py-10 pt-16 lg:pt-10">{children}</div>
    </main>
  </div>
);

export default Layout;
