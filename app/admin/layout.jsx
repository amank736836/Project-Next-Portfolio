'use client';

import '../admin.css';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Admin/Sidebar';
import Themes from '@/components/Themes/Themes';
import { usePathname } from 'next/navigation';
import { ToastProvider } from '@/components/Admin/Toast';
import { ConfirmProvider } from '@/components/Admin/ConfirmModal';
import { FiMenu, FiX } from 'react-icons/fi';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Extract active tab from pathname
  const activeTab = pathname.split('/').pop() || 'dashboard';

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Periodic authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/validate');
        const data = await res.json();
        
        if (!data.authenticated) {
          console.log('[Auth] Token expired or session invalid, triggering logout');
          // Redirect to logout page which will handle Scalekit logout and clear cookies
          window.location.href = '/api/auth/logout';
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
        onClick={() => setIsSidebarOpen(false)} 
      />
      
      <Sidebar activeTab={activeTab} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="admin-main custom-scrollbar z-10 relative">
        <header className="admin-header">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden relative group h-10 w-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white shadow-2xl transition-all hover:border-indigo-500/50"
              onClick={() => setIsSidebarOpen(true)}
            >
              <div className="absolute -inset-1 bg-indigo-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <FiMenu size={20} className="relative z-10" />
            </button>
            <div className="flex flex-col">
              <h3 className="text-xl font-black tracking-tighter capitalize flex items-center gap-3 leading-none">
                {activeTab} 
                <span className="flex gap-1">
                  <span className="w-1 h-1 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,1)] animate-pulse" />
                  <span className="w-1 h-1 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,1)] opacity-40" />
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
            <div className="text-right hidden md:block">
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
