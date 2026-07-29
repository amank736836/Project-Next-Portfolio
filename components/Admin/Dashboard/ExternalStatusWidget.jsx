'use client';

export default function ExternalStatusWidget({ 
  icon, label, status, pinging, onPing, hovered, onHover, onLeave, 
  isLight, textTitle, textDesc, textSub, cardBg, cardBorder 
}) {
  return (
    <div 
      className="transition-all duration-300 cursor-pointer group"
      style={{
        padding: '22px 26px',
        borderRadius: '16px',
        border: hovered 
          ? `1px solid ${isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)'}` 
          : `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
        backgroundColor: hovered 
          ? (isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)') 
          : (isLight ? 'rgba(0,0,0,0.005)' : 'rgba(255,255,255,0.005)'),
        transform: hovered ? 'translateX(3px)' : 'none',
        boxShadow: hovered
          ? (isLight ? '0 8px 24px rgba(0,0,0,0.02)' : '0 8px 24px rgba(0,0,0,0.12)')
          : 'none'
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onPing}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 group-hover:text-indigo-400 transition-colors">{icon}</span>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {pinging && <div className="w-2.5 h-2.5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mr-1" />}
          <div 
            className="w-2 h-2 rounded-full transition-all duration-500" 
            style={{ 
              backgroundColor: status.indicator === 'none' ? '#10b981' : '#f59e0b',
              boxShadow: status.indicator === 'none' ? '0 0 10px #10b981' : '0 0 10px #f59e0b'
            }} 
          />
        </div>
      </div>
      <div className="flex items-end justify-between mt-4">
        <div>
          <p className="text-xs font-black" style={{ color: textTitle }}>{status.status}</p>
          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Uptime: {status.uptime}</p>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-bold font-mono" style={{ color: textDesc }}>{status.latency}</span>
          <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Click to ping</p>
        </div>
      </div>
    </div>
  );
}