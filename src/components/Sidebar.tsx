import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PiUploadSimple, PiListChecks, PiBell, PiSignOut, PiList } from 'react-icons/pi';
import Logo from '@/components/Logo';
import { ROUTES } from '@/constants/routes';
import { useLogout } from '@/hooks/useAuth';

type NavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
};

// 질문 생성 설정은 특정 documentId가 필요한 화면이므로 정적 nav 링크에서 제외하고,
// 문서 업로드(분석 완료) 후 해당 문서 id로 진입한다.
const NAV_ITEMS: NavItem[] = [
  { label: '문서 업로드', path: ROUTES.DOCUMENT_UPLOAD, icon: <PiUploadSimple size={18} /> },
  { label: '질문 리스트', path: ROUTES.QUESTION_SETS, icon: <PiListChecks size={18} /> },
  { label: '알림 설정', path: ROUTES.NOTIFICATION_SETTINGS, icon: <PiBell size={18} /> },
];

const SidebarContent = ({ onClose }: { onClose?: () => void }) => {
  const { pathname } = useLocation();
  const logout = useLogout();

  const handleLogout = () => {
    onClose?.();
    logout();
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
      }}
    >
      <div className="px-5 py-5">
        <Logo />
      </div>

      <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                color: isActive ? 'var(--color-white)' : 'var(--color-text-muted)',
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div
        className="px-3 py-4 flex flex-col gap-1"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors w-full text-left"
          style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none' }}
        >
          <PiSignOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* 모바일 햄버거 버튼 */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg"
        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        onClick={() => setMobileOpen(true)}
        aria-label="메뉴 열기"
      >
        <PiList size={22} />
      </button>

      {/* 모바일 오버레이 */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* 모바일 드로어 */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-full transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: 'var(--sidebar-width)' }}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

      {/* 데스크탑 고정 사이드바 */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 sticky top-0 h-screen"
        style={{ width: 'var(--sidebar-width)' }}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
