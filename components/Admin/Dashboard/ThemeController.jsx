'use client';

import { FiZap, FiMoon, FiSun } from 'react-icons/fi';
import { themes } from '@/data';

export default function ThemeController({ themeSettings, savingTheme, success, onSaveTheme, isLight, textTitle, textSub, cardBg, cardBorder, cardInset, themeHovered, setThemeHovered, toggleHovered, setToggleHovered }) {
  return (
    <section 
      style={{
        backgroundColor: cardBg,
        border: `1px solid ${cardBorder}`,
        boxShadow: `0 10px 30px ${isLight ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.2)'}, ${cardInset}`,
      }}
      className="rounded-2xl p-8 backdrop-blur-2xl"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
          <FiZap size={18} />
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider" style={{ color: textTitle }}>Global Aesthetics</h3>
          <p className="text-[9px] font-bold uppercase tracking-widest mt-0.5" style={{ color: textSub }}>Configure system-wide style signature</p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: textSub }}>Primary Signature</p>
          <div className="flex flex-wrap gap-5">
            {themes.map((t, idx) => {
              const isSelected = themeSettings.color === t.color;
              const isHovered = themeHovered === idx;
              
              return (
                <button
                  key={idx}
                  onClick={() => onSaveTheme(t.color, themeSettings.mode)}
                  onMouseEnter={() => setThemeHovered(idx)}
                  onMouseLeave={() => setThemeHovered(null)}
                  className="w-8 h-8 transition-all relative outline-none cursor-pointer"
                  style={{ 
                    backgroundColor: t.color,
                    borderRadius: '50% 50% 50% 0',
                    transform: isSelected 
                      ? 'rotate(-45deg) scale(1.2)' 
                      : isHovered 
                        ? 'rotate(-45deg) scale(1.1)' 
                        : 'rotate(-45deg)',
                    boxShadow: isSelected 
                      ? `0 0 15px ${t.color}, inset 0 2px 4px rgba(255,255,255,0.4)` 
                      : '0 4px 10px rgba(0,0,0,0.15)',
                    margin: '6px',
                    border: isSelected ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.15)'
                  }}
                  title={t.color}
                  aria-label={`Select theme color ${t.color}`}
                />
              );
            })}
          </div>
        </div>

        <div 
          className="flex items-center justify-between p-5 rounded-2xl border transition-all duration-300"
          style={{
            backgroundColor: toggleHovered 
              ? (isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)') 
              : (isLight ? 'rgba(0,0,0,0.005)' : 'rgba(255,255,255,0.005)'),
            borderColor: toggleHovered 
              ? (isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)') 
              : (isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)'),
          }}
          onMouseEnter={() => setToggleHovered(true)}
          onMouseLeave={() => setToggleHovered(false)}
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-0.5" style={{ color: textSub }}>Visual Protocol</p>
            <p className="text-sm font-black capitalize" style={{ color: textTitle }}>{themeSettings.mode.split('-')[0]} Mode</p>
          </div>
          <div>
            <button
              onClick={() => onSaveTheme(themeSettings.color, themeSettings.mode === 'dark-theme' ? 'light-theme' : 'dark-theme')}
              aria-label="Toggle visual protocol"
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-lg cursor-pointer"
              style={{ 
                backgroundColor: isLight ? '#ffffff' : 'var(--admin-accent)',
                color: isLight ? '#0f172a' : '#ffffff',
                boxShadow: isLight 
                  ? '0 4px 15px rgba(0,0,0,0.08)' 
                  : '0 4px 15px rgba(var(--admin-accent-rgb), 0.3)',
                border: `2px solid var(--admin-accent)`,
              }}
            >
              {themeSettings.mode === 'dark-theme' ? <FiMoon size={18} /> : <FiSun size={18} />}
            </button>
          </div>
        </div>

        {success && (
          <p className="text-[10px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-widest text-center animate-pulse" style={{ textShadow: '0 0 8px rgba(16,185,129,0.2)' }}>
            {success}
          </p>
        )}
      </div>
    </section>
  );
}