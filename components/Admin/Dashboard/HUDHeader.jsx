'use client';

import { FiClock, FiActivity } from 'react-icons/fi';

export default function HUDHeader({ uptime, textTitle, hudBg, hudBorder, isLight }) {
  const hudChipStyle = {
    display: 'flex', 
    alignItems: 'center', 
    gap: '20px',
    padding: '16px 24px', 
    borderRadius: '18px',
    backgroundColor: hudBg,
    border: `1px solid ${hudBorder}`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    transition: 'all 0.3s ease',
    boxShadow: isLight 
      ? 'inset 0 1px 0 rgba(255,255,255,0.9), 0 10px 25px rgba(0,0,0,0.03)' 
      : 'inset 0 1px 0 rgba(255,255,255,0.03), 0 10px 30px rgba(0,0,0,0.25)',
    flex: 1,
  };

  return (
    <div className="flex gap-3 sm:gap-6 w-full lg:w-auto">
      <div 
        style={hudChipStyle}
        className="hover:border-[var(--admin-accent)]/30 group"
      >
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[var(--admin-accent)]/10 flex items-center justify-center text-[var(--admin-accent)] group-hover:scale-105 transition-transform shrink-0" style={{ border: '1px solid rgba(var(--admin-accent-rgb), 0.15)' }}>
          <FiClock size={16} />
        </div>
        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Local Time</p>
          <p className="text-sm sm:text-lg font-black tracking-wider hud-text truncate" style={{ color: textTitle }}>{uptime}</p>
        </div>
      </div>

      <div 
        style={{
          ...hudChipStyle,
          boxShadow: isLight ? 'inset 0 1px 0 rgba(255,255,255,0.9), 0 10px 25px rgba(0,0,0,0.03)' : 'inset 0 1px 0 rgba(255,255,255,0.03), 0 10px 30px rgba(0,0,0,0.25)',
        }}
        className="hover:border-emerald-500/30 group"
      >
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-105 transition-transform shrink-0" style={{ border: '1px solid rgba(16, 185, 129, 0.15)' }}>
          <FiActivity size={16} />
        </div>
        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Session</p>
          <p className="text-sm sm:text-lg font-black tracking-wider text-emerald-500 hud-text" style={{ textShadow: '0 0 10px rgba(16,185,129,0.1)' }}>Active</p>
        </div>
      </div>
    </div>
  );
}