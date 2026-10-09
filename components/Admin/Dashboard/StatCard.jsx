'use client';

import { useMemo } from 'react';
import CountUp from '@/components/ui/CountUp';

export default function StatCard({ stat, loading, error, isHovered, onMouseEnter, onMouseLeave, STAT_THEMES, textTitle, textDesc, isLight, cardBg, cardBorder, cardInset }) {
  const t = useMemo(() => STAT_THEMES[stat.color] ?? STAT_THEMES.indigo, [stat.color, STAT_THEMES]);

  const cardStyle = useMemo(() => ({
    position: 'relative',
    padding: '16px',
    borderRadius: '20px',
    backgroundColor: cardBg,
    backdropFilter: 'blur(28px) saturate(220%)',
    WebkitBackdropFilter: 'blur(28px) saturate(220%)',
    border: isHovered ? `1px solid ${t.borderHover[isLight ? 'light' : 'dark']}` : `1px solid ${cardBorder}`,
    boxShadow: isHovered 
      ? `${t.glowShadow[isLight ? 'light' : 'dark']}, 0 20px 45px -10px ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.5)'}, ${cardInset}` 
      : `0 10px 25px -5px ${isLight ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.3)'}, ${cardInset}`,
    transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
    transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
    overflow: 'hidden',
    cursor: 'default'
  }), [isHovered, t, isLight, cardBg, cardBorder, cardInset]);

  return (
    <div 
      style={cardStyle}
      data-spotlight
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div 
        className="absolute -bottom-6 -right-6 opacity-[0.02] pointer-events-none transition-all duration-500"
        style={{ 
          transform: isHovered ? 'scale(1.18) rotate(-12deg)' : 'scale(1) rotate(0deg)',
          opacity: isHovered ? 0.07 : 0.02,
          color: t.text[isLight ? 'light' : 'dark']
        }}
      >
        <stat.icon size={135} />
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <div 
          className="w-9 h-9 sm:w-[46px] sm:h-[46px] rounded-xl flex items-center justify-center transition-all duration-300"
          style={{
            backgroundColor: t.bg[isLight ? 'light' : 'dark'],
            border: `1px solid ${t.border[isLight ? 'light' : 'dark']}`,
            color: t.text[isLight ? 'light' : 'dark'],
            transform: isHovered ? 'scale(1.1) rotate(3deg)' : 'scale(1)',
          }}
        >
          <stat.icon size={16} />
        </div>
        <span 
          style={{
            fontSize: '8px', fontWeight: 900,
            color: t.text[isLight ? 'light' : 'dark'],
            backgroundColor: t.badgeBg[isLight ? 'light' : 'dark'],
            border: `1px solid ${t.badgeBorder[isLight ? 'light' : 'dark']}`,
            padding: '4px 8px', borderRadius: '8px',
            textTransform: 'uppercase', letterSpacing: '0.15em',
          }}
        >
          {stat.label}
        </span>
      </div>

      <div className="relative z-10 mt-5 sm:mt-8">
        {loading ? (
          <div className="h-10 sm:h-14 w-16 sm:w-20 bg-black/5 dark:bg-white/5 animate-pulse rounded-xl mb-2" />
        ) : error ? (
          <p className="text-xs font-black text-rose-500/80 uppercase tracking-tighter">Signal Error</p>
        ) : (
          <p className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: textTitle, textShadow: isLight ? 'none' : '0 2px 10px rgba(0,0,0,0.3)' }}>
            {Number.isFinite(Number(stat.value)) ? (
              <CountUp value={Number(stat.value)} duration={900} />
            ) : (
              stat.value
            )}
          </p>
        )}
        
        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mt-3 sm:mt-4 flex items-center gap-2" style={{ color: textDesc }}>
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: t.bullet[isLight ? 'light' : 'dark'], boxShadow: `0 0 8px ${t.bullet[isLight ? 'light' : 'dark']}` }} />
          <span className="truncate">{stat.desc}</span>
        </p>
      </div>
    </div>
  );
}