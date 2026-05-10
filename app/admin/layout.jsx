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

      <Sidebar activeTab={activeTab} />

      <div className="admin-main custom-scrollbar z-10 relative">
        <header className="admin-header">
          <div className="flex flex-col">
            <h3 className="text-xl font-black tracking-tighter capitalize flex items-center gap-3 leading-none">
              {activeTab} 
              <span className="flex gap-1">
                <span className="w-1 h-1 bg-[var(--first-color)] rounded-full shadow-[0_0_10px_var(--first-color)] animate-pulse" />
                <span className="w-1 h-1 bg-[var(--first-color)] rounded-full shadow-[0_0_10px_var(--first-color)] opacity-40" />
              </span>
            </h3>
            <div className="flex gap-4 mt-1">
              <span className="text-[7px] font-black opacity-40 uppercase tracking-[0.2em]">Sector: Global_Admin</span>
              <span className="text-[7px] font-black opacity-40 uppercase tracking-[0.2em]">Priority: Alpha_Clearance</span>
              <span className="text-[7px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                <span className="w-0.5 h-0.5 bg-emerald-500 rounded-full" /> Encrypted_Link
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[8px] font-black text-[var(--first-color)] uppercase tracking-[0.3em] mb-0.5">Authenticated Operator</p>
              <div className="flex items-center justify-end gap-3">
                 <span className="text-[7px] font-bold text-emerald-500/60 hud-text uppercase">UP: 12:44:02</span>
                 <p className="text-xs font-black tracking-tight">AMAN KUMAR</p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-[var(--first-color)] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative h-10 w-10 rounded-xl bg-[var(--container-color)] border border-[var(--border-color)] flex items-center justify-center font-black text-xs shadow-2xl">
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
