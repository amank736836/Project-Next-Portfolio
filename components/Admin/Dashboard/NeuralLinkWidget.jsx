'use client';

export default function NeuralLinkWidget({ isLight, cardBg, cardBorder, textTitle, textDesc }) {
  return (
    <div 
      className="transition-all duration-300"
      style={{
        padding: '22px 26px',
        borderRadius: '16px',
        border: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
        backgroundColor: isLight ? 'rgba(0,0,0,0.005)' : 'rgba(255,255,255,0.005)'
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Neural Link</span>
        <div className="flex gap-1">
          {[1,2,3,4].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" style={{ animationDelay: `${i*150}ms` }} />)}
        </div>
      </div>
      <div className="h-1.5 w-full bg-black/[0.04] dark:bg-white/[0.04] rounded-full overflow-hidden mt-4 relative">
        <div 
          className="h-full rounded-full transition-all duration-500 animate-pulse" 
          style={{ 
            width: '85%',
            backgroundColor: 'var(--admin-accent)',
            boxShadow: '0 0 10px var(--admin-accent-glow), 0 0 4px var(--admin-accent)'
          }} 
        />
      </div>
    </div>
  );
}