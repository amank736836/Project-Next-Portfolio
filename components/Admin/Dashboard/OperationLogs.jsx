'use client';

import { FiActivity } from 'react-icons/fi';
import { OPERATION_LOGS } from './data/operationLogs';

export default function OperationLogs({ hoveredLog, setHoveredLog, isLight, textTitle, textSub, textDesc, cardBg, cardBorder, cardInset }) {
  return (
    <section 
      style={{
        backgroundColor: cardBg,
        border: `1px solid ${cardBorder}`,
        boxShadow: `0 10px 30px ${isLight ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.2)'}, ${cardInset}`,
      }}
      className="relative overflow-hidden rounded-2xl backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.05] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--admin-accent)]/10 flex items-center justify-center text-[var(--admin-accent)] border border-[var(--admin-accent)]/15">
            <FiActivity size={15} />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider" style={{ color: textTitle }}>Operation Logs</h3>
            <p className="text-[9px] font-bold uppercase tracking-widest mt-0.5" style={{ color: textSub }}>Real-time system diagnostics</p>
          </div>
        </div>
        <button className="text-[10px] font-black text-[var(--admin-accent)] uppercase tracking-widest hover:opacity-85 transition-all border border-[var(--admin-accent)]/15 bg-[var(--admin-accent)]/5 hover:bg-[var(--admin-accent)]/10 px-4 py-2 rounded-xl">
          Clear
        </button>
      </div>
      
      <div 
        className="max-h-[380px] overflow-y-auto scrollbar-thin p-5"
        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        {OPERATION_LOGS.map((log, idx) => {
          const isHovered = hoveredLog === idx;
          
          const logStyle = {
            display: 'flex', alignItems: 'start', gap: '16px',
            padding: '14px 18px', borderRadius: '14px',
            backgroundColor: isHovered 
              ? (isLight ? 'rgba(0,0,0,0.025)' : 'rgba(255,255,255,0.04)') 
              : (isLight ? 'rgba(0,0,0,0.005)' : 'rgba(255,255,255,0.01)'),
            border: isHovered 
              ? (isLight ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(255,255,255,0.08)') 
              : (isLight ? '1px solid rgba(0,0,0,0.02)' : '1px solid rgba(255,255,255,0.04)'),
            transition: 'all 0.2s ease',
            cursor: 'default'
          };

          let dotColor = '#6366f1';
          if (log.type === 'write') dotColor = '#10b981';
          if (log.type === 'system') dotColor = '#f59e0b';

          return (
            <div 
              key={idx} 
              style={logStyle}
              onMouseEnter={() => setHoveredLog(idx)}
              onMouseLeave={() => setHoveredLog(null)}
            >
              <div 
                className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 transition-transform" 
                style={{ 
                  backgroundColor: dotColor,
                  boxShadow: `0 0 10px ${dotColor}`,
                  transform: isHovered ? 'scale(1.3)' : 'scale(1)'
                }} 
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: isLight ? '#334155' : '#cbd5e1' }}>{log.action}</span>
                  <span className="text-[9px] font-bold font-mono" style={{ color: textSub }}>{log.time}</span>
                </div>
                <p className="text-xs leading-relaxed font-semibold" style={{ color: textDesc }}>{log.details}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}