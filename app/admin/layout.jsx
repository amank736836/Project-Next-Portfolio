'use client';

import '../admin.css';
import Sidebar from '@/components/Admin/Sidebar';
import Themes from '@/components/Themes/Themes';
import { usePathname } from 'next/navigation';
import { ToastProvider } from '@/components/Admin/Toast';
import { ConfirmProvider } from '@/components/Admin/ConfirmModal';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  
  // Extract active tab from pathname
  const activeTab = pathname.split('/').pop() || 'dashboard';

  return (
    <div className="admin-root">
      <div className="scanline" />
      <Themes />

      <Sidebar activeTab={activeTab} />

      <div className="admin-main custom-scrollbar z-10 relative">
        <header className="admin-header">
          <div className="flex flex-col">
            <h3 className="text-2xl font-black tracking-tighter capitalize flex items-center gap-4">
              {activeTab} <span className="w-1.5 h-1.5 bg-[var(--first-color)] rounded-full shadow-[0_0_15px_var(--first-color)]" />
            </h3>
            <div className="flex gap-4 mt-1">
              <span className="text-[8px] font-bold opacity-40 uppercase tracking-widest">Sector: Global</span>
              <span className="text-[8px] font-bold opacity-40 uppercase tracking-widest">Priority: Alpha</span>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-right hidden sm:block">
              <p className="text-[9px] font-black text-[var(--first-color)] uppercase tracking-[0.4em] mb-1">Authenticated Operator</p>
              <div className="flex items-center justify-end gap-3">
                 <span className="text-[8px] font-bold text-emerald-500/60 hud-text uppercase">UP: 12:44:02</span>
                 <p className="text-sm font-black tracking-tight">AMAN KUMAR</p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-[var(--first-color)] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative h-12 w-12 rounded-2xl bg-[var(--container-color)] border border-[var(--border-color)] flex items-center justify-center font-black text-sm shadow-2xl">
                AK
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content-inner">
          <ToastProvider>
            <ConfirmProvider>
              {children}
            </ConfirmProvider>
          </ToastProvider>
          
          <footer className="mt-20 pb-12 text-center">
            <p className="text-[9px] font-bold opacity-30 uppercase tracking-[0.5em]">
              Portfolio Control Systems // v4.2.0
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
