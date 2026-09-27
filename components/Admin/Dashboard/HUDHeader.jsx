'use client';

import { FiClock, FiActivity } from 'react-icons/fi';

export default function HUDHeader({ uptime, textTitle, hudBg, hudBorder, isLight }) {
  const hudChipStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px 18px',
    borderRadius: '14px',
    backgroundColor: hudBg,
    border: `1px solid ${hudBorder}`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    transition: 'all 0.3s ease',
    boxShadow: isLight
      ? 'inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 20px rgba(0,0,0,0.03)'
      : 'inset 0 1px 0 rgba(255,255,255,0.03), 0 8px 24px rgba(0,0,0,0.2)',
    flex: 1,
  };

  return (
    <div className="flex gap-2 sm:gap-4 w-full md:w-[360px] md:min-w-0 md:mr-14 lg:mr-10">
      <div
        style={hudChipStyle}
        className="hover:border-[var(--admin-accent)]/30 group"
      >
        <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-[var(--admin-accent)]/10 flex items-center justify-center text-[var(--admin-accent)] group-hover:scale-105 transition-transform shrink-0" style={{ border: '1px solid rgba(var(--admin-accent-rgb), 0.15)' }}>
          <FiClock size={14} />
        </div>
        <div className="min-w-0">
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Local Time</p>
          <p className="text-xs sm:text-base font-black tracking-wider hud-text truncate" style={{ color: textTitle }}>{uptime}</p>
        </div>
      </div>

      <div
        style={{
          ...hudChipStyle,
          boxShadow: isLight ? 'inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 20px rgba(0,0,0,0.03)' : 'inset 0 1px 0 rgba(255,255,255,0.03), 0 8px 24px rgba(0,0,0,0.2)',
        }}
        className="hover:border-emerald-500/30 group"
      >
        <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-105 transition-transform shrink-0" style={{ border: '1px solid rgba(16, 185, 129, 0.15)' }}>
          <FiActivity size={14} />
        </div>
        <div className="min-w-0">
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Session</p>
          <p className="text-xs sm:text-base font-black tracking-wider text-emerald-500 hud-text" style={{ textShadow: '0 0 8px rgba(16,185,129,0.1)' }}>Active</p>
        </div>
      </div>
    </div>
  );
}
