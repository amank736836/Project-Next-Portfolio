import Link from 'next/link';
import { FiGrid, FiUser, FiCode, FiLogOut, FiPieChart, FiExternalLink, FiBook, FiBriefcase, FiTerminal, FiX, FiSettings } from 'react-icons/fi';

export default function Sidebar({ activeTab, isOpen, onClose }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiPieChart />, path: '/admin' },
    { id: 'showcase', label: 'Showcase', icon: <FiGrid />, path: '/admin/showcase' },
    { id: 'identity', label: 'Identity', icon: <FiUser />, path: '/admin/identity' },
    { id: 'matrix', label: 'Matrix', icon: <FiCode />, path: '/admin/matrix' },
    { id: 'academy', label: 'Academy', icon: <FiBook />, path: '/admin/academy' },
    { id: 'logbook', label: 'Logbook', icon: <FiBriefcase />, path: '/admin/logbook' },
    { id: 'settings', label: 'Settings', icon: <FiSettings />, path: '/admin/settings' },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      const data = await response.json();
      window.location.href = data.logoutUrl || '/';
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = '/';
    }
  };

  return (
    <div className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="mb-12 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative">
            <div className="absolute -inset-2 bg-[var(--admin-accent)]/20 rounded-2xl blur-lg group-hover:bg-[var(--admin-accent)]/40 transition duration-500"></div>
            <div className="relative bg-[var(--admin-accent)] border border-[var(--admin-accent)]/30 w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 duration-500 shadow-2xl">
              <FiTerminal className="text-xl text-black" />
            </div>
          </div>
          <div className="overflow-hidden">
            <h1 className="text-xl font-black tracking-tighter text-[var(--admin-title)] leading-none">CORE.OS</h1>
            <p className="text-[9px] font-black text-[var(--admin-accent)] tracking-[0.3em] uppercase mt-1">Admin Node v4.2</p>
          </div>
        </div>

        <button 
          className="lg:hidden text-slate-500 hover:text-white transition-colors"
          onClick={onClose}
          type="button"
          aria-label="Close admin sidebar"
        >
          <FiX size={24} />
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.path}
            className={`nav-item w-full ${activeTab === tab.id ? 'active' : ''}`}
          >
            <div className="icon-box">
              {tab.icon}
            </div>
            <span className="truncate">{tab.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-8 pt-8 border-t border-white/5 space-y-2 px-2">
        <div className="status-hud mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Sync Status</span>
            <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Active</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-4">
            <div className="h-full w-[85%] bg-[var(--admin-accent)] animate-pulse" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
             <div>
                <p className="text-[7px] font-black text-slate-600 uppercase mb-1">Memory</p>
                <p className="text-[10px] font-bold hud-text">1.2GB</p>
             </div>
             <div>
                <p className="text-[7px] font-black text-slate-600 uppercase mb-1">Signal</p>
                <p className="text-[10px] font-bold hud-text">Optimum</p>
             </div>
          </div>
        </div>

        <a 
          href="/about" 
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open live portfolio page in a new tab"
          className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-[var(--admin-accent)] transition-all text-[10px] font-bold uppercase tracking-widest group"
        >
          <FiExternalLink className="text-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          <span>Live Link</span>
        </a>
        
        <button 
          onClick={handleLogout}
          type="button"
          aria-label="Log out of admin dashboard"
          className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-red-400 transition-all text-[10px] font-bold uppercase tracking-widest group w-full"
        >
          <FiLogOut className="text-lg group-hover:-translate-x-1 transition-transform" />
          <span>Eject</span>
        </button>
      </div>
    </div>
  );
}

