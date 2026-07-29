'use client';

import '@/app/(admin)/admin.css';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Admin/Sidebar';
import Themes from '@/components/Themes/Themes';
import { usePathname } from 'next/navigation';
import { ToastProvider } from '@/components/Admin/Toast';
import { ConfirmProvider } from '@/components/Admin/ConfirmModal';
import { LoadingProvider } from '@/components/Admin/LoadingContext';
import { FiMenu } from 'react-icons/fi';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarState, setSidebarState] = useState({ open: false, path: '' });
  const [operatorName, setOperatorName] = useState('Operator');
  const [operatorInitials, setOperatorInitials] = useState('OP');
  const [sessionStartedAt, setSessionStartedAt] = useState(null);
  const [nowSeconds, setNowSeconds] = useState(() => Math.floor(Date.now() / 1000));

  const appVersionRaw = process.env.APP_VERSION || process.env.NEXT_PUBLIC_APP_VERSION || 'dev';
  const appVersion = String(appVersionRaw).replace(/^v/i, '');

  const toInitials = (name) => {
    if (!name || typeof name !== 'string') return 'OP';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'OP';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  const formatDuration = (totalSeconds) => {
    const safeSeconds = Math.max(0, Math.floor(totalSeconds));
    const hours = Math.floor(safeSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((safeSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (safeSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };
  
  // Extract active tab from pathname — normalize root '/admin' to 'dashboard'
  const pathSegments = pathname.split('/').filter(Boolean);
  const lastSegment = pathSegments.length ? pathSegments[pathSegments.length - 1] : '';
  const activeTab = (lastSegment === 'admin' || lastSegment === '') ? 'dashboard' : lastSegment;
  const isSidebarOpen = sidebarState.open && sidebarState.path === pathname;

  const closeSidebar = () => {
    setSidebarState((prev) => ({ ...prev, open: false }));
  };

  const openSidebar = () => {
    setSidebarState({ open: true, path: pathname });
  };

  const uptimeLabel = sessionStartedAt
    ? `UP: ${formatDuration(nowSeconds - sessionStartedAt)}`
    : 'UP: --:--:--';

  // Live session uptime ticker.
  useEffect(() => {
    if (!sessionStartedAt) return;

    const interval = setInterval(() => {
      setNowSeconds(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStartedAt]);

  // Periodic authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/validate');
        const data = await res.json();
        
        if (!data.authenticated) {
          // Redirect to logout page which will handle Scalekit logout and clear cookies
          window.location.href = '/api/auth/logout';
          return;
        }

        const resolvedName =
          data?.user?.name ||
          data?.user?.preferred_username ||
          data?.user?.email ||
          'Operator';

        setOperatorName(resolvedName);
        setOperatorInitials(toInitials(resolvedName));

        const startedAt = Number(data?.sessionStartedAt);
        if (Number.isFinite(startedAt) && startedAt > 0) {
          setSessionStartedAt(startedAt);
        }
      } catch (error) {
        console.error('[Auth] Check failed:', error);
      }
    };

    // Check every 60 seconds
    const interval = setInterval(checkAuth, 60000);
    
    // Initial check
    checkAuth();
    
    return () => clearInterval(interval);
  }, [pathname]);

  return (
    <div className="admin-root">
      <div className="scanline" />
      <div className="noise-overlay" />
      <svg className="hidden">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.05" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" mode="overlay" />
        </filter>
      </svg>
      <Themes />

      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} 
        onClick={closeSidebar} 
      />
      
      <Sidebar activeTab={activeTab} isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="admin-main custom-scrollbar z-10 relative">
        <header className="admin-header">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden relative group h-10 w-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white shadow-2xl transition-all hover:border-[var(--admin-accent)]/50"
              onClick={openSidebar}
              type="button"
              aria-label="Open admin sidebar"
            >
              <div className="absolute -inset-1 bg-[var(--admin-accent)] rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <FiMenu size={20} className="relative z-10" />
            </button>
            <div className="flex flex-col">
              <h3 className="text-xl font-black tracking-tighter capitalize flex items-center gap-3 leading-none text-[var(--admin-title)]">
                {activeTab} 
                <span className="flex gap-1">
                  <span className="w-1 h-1 bg-[var(--admin-accent)] rounded-full shadow-[0_0_10px_var(--admin-accent)] animate-pulse" />
                  <span className="w-1 h-1 bg-[var(--admin-accent)] rounded-full shadow-[0_0_10px_var(--admin-accent)] opacity-40" />
                </span>
              </h3>
              <div className="flex gap-4 mt-1 hidden sm:flex">
                <span className="text-[7px] font-black opacity-40 uppercase tracking-[0.2em]">Sector: Global_Admin</span>
                <span className="text-[7px] font-black opacity-40 uppercase tracking-[0.2em]">Priority: Alpha_Clearance</span>
                <span className="text-[7px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                  <span className="w-0.5 h-0.5 bg-emerald-500 rounded-full" /> Encrypted_Link
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="admin-operator-panel text-right hidden md:block">
              <p className="text-[8px] font-black text-[var(--first-color)] uppercase tracking-[0.3em] mb-0.5">Authenticated Operator</p>
              <div className="flex items-center justify-end gap-3">
                 <span className="text-[7px] font-bold text-emerald-500/60 hud-text uppercase">{uptimeLabel}</span>
                 <p className="text-xs font-black tracking-tight">{operatorName}</p>
              </div>
            </div>
            <div className="relative group admin-avatar-chip">
              <div className="absolute -inset-1 bg-[var(--first-color)] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative h-10 w-10 rounded-xl bg-[var(--container-color)] border border-[var(--border-color)] flex items-center justify-center font-black text-xs shadow-2xl">
                {operatorInitials}
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content-inner">
          <ToastProvider>
            <ConfirmProvider>
              <LoadingProvider>
                {children}
              </LoadingProvider>
            </ConfirmProvider>
          </ToastProvider>
          
          <footer className="mt-20 pb-12 text-center">
            <p className="text-[9px] font-bold opacity-30 uppercase tracking-[0.5em]">
              Portfolio Control Systems // v{appVersion}
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
