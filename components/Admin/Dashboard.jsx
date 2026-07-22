'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  FiTrendingUp, FiLayers, FiMessageSquare, FiActivity, 
  FiCommand, FiCpu, FiGlobe, FiShield, FiClock, FiZap, 
  FiDatabase, FiGithub, FiSun, FiMoon 
} from 'react-icons/fi';
import { themes } from '@/data';
import { syncThemeCssVars } from '@/lib/utils';

// Static log entries — defined outside component to avoid recreation on every render
const OPERATION_LOGS = [
  { action: 'AUTH_GATEWAY', details: 'Admin session established via Secure ID', time: '12s ago', type: 'auth' },
  { action: 'DB_SYNC', details: 'Project matrix synchronization completed', time: '1m ago', type: 'write' },
  { action: 'CACHE_PURGE', details: 'Global edge cache invalidated successfully', time: '5m ago', type: 'system' },
  { action: 'ENTRY_CREATED', details: 'New academy record injected into sector 7', time: '12m ago', type: 'write' },
  { action: 'SEC_AUDIT', details: 'Routine integrity check passed: 0 vulnerabilities', time: '1h ago', type: 'auth' },
];

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, skills: 0, education: 0, experience: 0 });
  const [uptime, setUptime] = useState('00:00:00');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [externalStatus, setExternalStatus] = useState({
    github: { status: 'Operational', indicator: 'none', latency: '14ms', uptime: '99.98%' },
    vercel: { status: 'Operational', indicator: 'none', latency: '8ms', uptime: '100.0%' },
    database: { status: 'Operational', latency: '19ms', uptime: '99.95%' }
  });

  const [pinging, setPinging] = useState({ github: false, vercel: false, database: false });

  const [themeSettings, setThemeSettings] = useState({
    color: 'Blue',
    mode: 'dark-theme'
  });
  const [savingTheme, setSavingTheme] = useState(false);
  const [success, setSuccess] = useState('');

  // Interactive Hover & Focus State Anchors
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredLog, setHoveredLog] = useState(null);
  const [hoveredStatus, setHoveredStatus] = useState(null);
  const [themeHovered, setThemeHovered] = useState(null);
  const [toggleHovered, setToggleHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchStats();
    fetchExternalStatuses();
    fetchThemeSettings();

    const handleThemeChange = () => {
      const color = localStorage.getItem("color") || 'Blue';
      const mode = localStorage.getItem("theme") || 'dark-theme';
      setThemeSettings({ color, mode });
    };

    window.addEventListener("themeChange", handleThemeChange);

    const timer = setInterval(() => {
      const now = new Date();
      setUptime(now.toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => {
      clearInterval(timer);
      window.removeEventListener("themeChange", handleThemeChange);
    };
  }, []);

  async function fetchExternalStatuses() {
    try {
      const ghRes = await fetch('https://www.githubstatus.com/api/v2/status.json');
      const ghData = await ghRes.json();
      setExternalStatus(prev => ({ 
        ...prev, 
        github: { 
          status: ghData.status.description, 
          indicator: ghData.status.indicator,
          latency: '15ms',
          uptime: '99.98%'
        } 
      }));
    } catch (e) {
      setExternalStatus(prev => ({ ...prev, github: { status: 'Protocol Offline', indicator: 'minor', latency: '--', uptime: '99.2%' } }));
    }

    try {
      const vRes = await fetch('https://www.vercel-status.com/api/v2/status.json');
      const vData = await vRes.json();
      setExternalStatus(prev => ({ 
        ...prev, 
        vercel: { 
          status: vData.status.description, 
          indicator: vData.status.indicator,
          latency: '9ms',
          uptime: '100.0%'
        } 
      }));
    } catch (e) {
      setExternalStatus(prev => ({ ...prev, vercel: { status: 'Edge Offline', indicator: 'minor', latency: '--', uptime: '99.7%' } }));
    }
  }

  async function fetchStats() {
    setLoading(true);
    try {
      const responses = await Promise.all([
        fetch('/api/admin/projects', { cache: 'no-store' }),
        fetch('/api/admin/skills', { cache: 'no-store' }),
        fetch('/api/admin/education', { cache: 'no-store' }),
        fetch('/api/admin/experience', { cache: 'no-store' }),
      ]);

      const unauthorized = responses.find(r => r.status === 401);
      if (unauthorized) {
        setError('Authentication failed. Please log in again.');
        return;
      }

      const [p, s, ed, ex] = await Promise.all(responses.map(r => r.json()));

      setStats({
        projects: Array.isArray(p) ? p.length : 0,
        skills: Array.isArray(s) ? s.length : 0,
        education: Array.isArray(ed) ? ed.length : 0,
        experience: Array.isArray(ex) ? ex.length : 0,
      });
      setError(null);
    } catch (err) {
      console.error('Stats fetch failed', err);
      setError('Failed to connect to the matrix server.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchThemeSettings() {
    const savedColor = localStorage.getItem("color");
    const savedMode = localStorage.getItem("theme");
    
    if (savedColor && savedMode) {
      setThemeSettings({ color: savedColor, mode: savedMode });
      return;
    }

    try {
      const res = await fetch('/api/admin/info');
      if (!res.ok) {
        const fallbackColor = savedColor || 'Blue';
        const fallbackMode = savedMode || 'dark-theme';
        setThemeSettings({ color: fallbackColor, mode: fallbackMode });
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        const color = data.find(item => item.key === 'default_theme_color')?.description || 'Blue';
        const mode = data.find(item => item.key === 'default_theme_mode')?.description || 'dark-theme';
        setThemeSettings({ color, mode });
        localStorage.setItem("color", color);
        localStorage.setItem("theme", mode);
      }
    } catch (err) {
      console.error('Failed to fetch theme settings', err);
      const fallbackColor = savedColor || 'Blue';
      const fallbackMode = savedMode || 'dark-theme';
      setThemeSettings({ color: fallbackColor, mode: fallbackMode });
    }
  }

  const saveThemeSettings = async (color, mode) => {
    setSavingTheme(true);
    setSuccess('');
    
    // Snappy optimistic update: immediately update client UI and local theme
    setThemeSettings({ color, mode });
    localStorage.setItem("color", color);
    localStorage.setItem("theme", mode);
    syncThemeCssVars(color);
    document.documentElement.className = mode;
    window.dispatchEvent(new Event("themeChange"));

    try {
      const payload = [
        { key: 'default_theme_color', title: 'Default Theme Color', description: color },
        { key: 'default_theme_mode', title: 'Default Theme Mode', description: mode }
      ];
      const res = await fetch('/api/admin/info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSuccess('Theme updated across the matrix');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Failed to save theme settings to database', err);
    } finally {
      setSavingTheme(false);
    }
  };

  const handlePing = (key) => {
    if (pinging[key]) return;
    setPinging(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      const randomLatency = Math.floor(Math.random() * 15 + 6) + 'ms';
      setExternalStatus(prev => ({
        ...prev,
        [key]: { ...prev[key], latency: randomLatency }
      }));
      setPinging(prev => ({ ...prev, [key]: false }));
    }, 850);
  };

  const logs = OPERATION_LOGS;

  // Helper variables for adaptive Light/Dark mode
  const isLight = themeSettings.mode === 'light-theme';

  const { cardBg, cardBorder, cardInset, textTitle, textDesc, textSub, hudBg, hudBorder, STAT_THEMES } = useMemo(() => {
    const light = isLight;
    return {
      cardBg: light ? 'rgba(255, 255, 255, 0.45)' : 'rgba(10, 14, 28, 0.72)',
      cardBorder: light ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.08)',
      cardInset: light ? 'inset 0 1px 0 rgba(255, 255, 255, 0.8)' : 'inset 0 1px 0 rgba(255, 255, 255, 0.03)',
      textTitle: light ? '#0f172a' : '#ffffff',
      textDesc: light ? '#475569' : '#94a3b8',
      textSub: light ? '#64748b' : '#64748b',
      hudBg: light ? 'rgba(255, 255, 255, 0.65)' : 'rgba(15, 23, 42, 0.45)',
      hudBorder: light ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.08)',
      STAT_THEMES: {
        indigo: {
          bg: light ? 'rgba(79, 70, 229, 0.05)' : 'rgba(99, 102, 241, 0.06)',
          text: light ? '#4f46e5' : '#818cf8',
          border: light ? 'rgba(79, 70, 229, 0.12)' : 'rgba(99, 102, 241, 0.16)',
          borderHover: light ? 'rgba(79, 70, 229, 0.38)' : 'rgba(99, 102, 241, 0.45)',
          bullet: light ? '#4f46e5' : '#6366f1',
          badgeBg: light ? 'rgba(79, 70, 229, 0.07)' : 'rgba(99, 102, 241, 0.12)',
          badgeBorder: light ? 'rgba(79, 70, 229, 0.18)' : 'rgba(99, 102, 241, 0.25)',
          glowShadow: light ? '0 10px 30px rgba(79, 70, 229, 0.08)' : '0 0 25px rgba(99, 102, 241, 0.18)',
        },
        emerald: {
          bg: light ? 'rgba(5, 150, 105, 0.05)' : 'rgba(16, 185, 129, 0.06)',
          text: light ? '#059669' : '#34d399',
          border: light ? 'rgba(5, 150, 105, 0.12)' : 'rgba(16, 185, 129, 0.16)',
          borderHover: light ? 'rgba(5, 150, 105, 0.38)' : 'rgba(16, 185, 129, 0.45)',
          bullet: light ? '#059669' : '#10b981',
          badgeBg: light ? 'rgba(5, 150, 105, 0.07)' : 'rgba(16, 185, 129, 0.12)',
          badgeBorder: light ? 'rgba(5, 150, 105, 0.18)' : 'rgba(16, 185, 129, 0.25)',
          glowShadow: light ? '0 10px 30px rgba(5, 150, 105, 0.08)' : '0 0 25px rgba(16, 185, 129, 0.18)',
        },
        amber: {
          bg: light ? 'rgba(217, 119, 6, 0.05)' : 'rgba(245, 158, 11, 0.06)',
          text: light ? '#b45309' : '#fbbf24',
          border: light ? 'rgba(217, 119, 6, 0.12)' : 'rgba(245, 158, 11, 0.16)',
          borderHover: light ? 'rgba(217, 119, 6, 0.38)' : 'rgba(245, 158, 11, 0.45)',
          bullet: light ? '#d97706' : '#f59e0b',
          badgeBg: light ? 'rgba(217, 119, 6, 0.07)' : 'rgba(245, 158, 11, 0.12)',
          badgeBorder: light ? 'rgba(217, 119, 6, 0.18)' : 'rgba(245, 158, 11, 0.25)',
          glowShadow: light ? '0 10px 30px rgba(217, 119, 6, 0.08)' : '0 0 25px rgba(245, 158, 11, 0.18)',
        },
        rose: {
          bg: light ? 'rgba(225, 29, 72, 0.05)' : 'rgba(244, 63, 94, 0.06)',
          text: light ? '#e11d48' : '#fb7185',
          border: light ? 'rgba(225, 29, 72, 0.12)' : 'rgba(244, 63, 94, 0.16)',
          borderHover: light ? 'rgba(225, 29, 72, 0.38)' : 'rgba(244, 63, 94, 0.45)',
          bullet: light ? '#e11d48' : '#f43f5e',
          badgeBg: light ? 'rgba(225, 29, 72, 0.07)' : 'rgba(244, 63, 94, 0.12)',
          badgeBorder: light ? 'rgba(225, 29, 72, 0.18)' : 'rgba(244, 63, 94, 0.25)',
          glowShadow: light ? '0 10px 30px rgba(225, 29, 72, 0.08)' : '0 0 25px rgba(244, 63, 94, 0.18)',
        },
      },
    };
  }, [isLight]);

  return (
    <div 
      className="animate-fade-in max-w-[1700px] mx-auto pb-20 px-4 md:px-6"
      style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}
    >
      
      {/* ── 1. HUD COMMAND HEADER ── */}
      <div className="flex flex-col gap-6 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,1)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500" style={{ textShadow: '0 0 10px rgba(16,185,129,0.2)' }}>
              System Online
            </span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 opacity-60">
            Signal Stable // Encrypted
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-black/[0.05] dark:border-white/[0.06] pb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight !mb-1" style={{ color: textTitle }}>
              Core Telemetry
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--admin-accent)] opacity-85" style={{ letterSpacing: '0.25em' }}>
              Unified Portfolio Command Interface
            </p>
          </div>

          {/* HUD chips (Clock & Session status) */}
          <div className="flex gap-3 sm:gap-6 w-full lg:w-auto">
            <div 
              style={{
                ...hudChipStyle(isLight, hudBg, hudBorder),
                flex: 1,
                boxShadow: isLight ? 'inset 0 1px 0 rgba(255,255,255,0.9), 0 10px 25px rgba(0,0,0,0.03)' : 'inset 0 1px 0 rgba(255,255,255,0.03), 0 10px 30px rgba(0,0,0,0.25)',
              }}
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
                ...hudChipStyle(isLight, hudBg, hudBorder),
                flex: 1,
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
        </div>
      </div>

      {/* ── 2. TELEMETRY STATS GRID (Cyber-Luxe Overhaul) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {[
          { label: 'Projects', value: stats.projects, icon: FiLayers, color: 'indigo', desc: 'Total Nodes Active' },
          { label: 'Matrix', value: stats.skills, icon: FiTrendingUp, color: 'emerald', desc: 'Identified Skills' },
          { label: 'Logs', value: stats.experience, icon: FiMessageSquare, color: 'amber', desc: 'Experience Entries' },
          { label: 'Academy', value: stats.education, icon: FiGlobe, color: 'rose', desc: 'Education Data' }
        ].map((stat, i) => {
          const t = STAT_THEMES[stat.color] ?? STAT_THEMES.indigo;
          const isHovered = hoveredCard === i;

          const cardStyle = {
            position: 'relative',
            padding: '16px',
            borderRadius: '20px',
            backgroundColor: cardBg,
            backdropFilter: 'blur(28px) saturate(220%)',
            WebkitBackdropFilter: 'blur(28px) saturate(220%)',
            border: isHovered ? `1px solid ${t.borderHover}` : `1px solid ${cardBorder}`,
            boxShadow: isHovered 
              ? `${t.glowShadow}, 0 20px 45px -10px ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.5)'}, ${cardInset}` 
              : `0 10px 25px -5px ${isLight ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.3)'}, ${cardInset}`,
            transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
            transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
            overflow: 'hidden',
            cursor: 'default'
          };

          return (
            <div 
              key={i} 
              style={cardStyle}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Decorative background shape */}
              <div 
                className="absolute -bottom-6 -right-6 opacity-[0.02] pointer-events-none transition-all duration-500"
                style={{ 
                  transform: isHovered ? 'scale(1.18) rotate(-12deg)' : 'scale(1) rotate(0deg)',
                  opacity: isHovered ? 0.07 : 0.02,
                  color: t.text
                }}
              >
                <stat.icon size={135} />
              </div>

              {/* Card Header */}
              <div className="relative z-10 flex items-center justify-between">
                <div 
                  className="w-9 h-9 sm:w-[46px] sm:h-[46px] rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: t.bg,
                    border: `1px solid ${t.border}`,
                    color: t.text,
                    transform: isHovered ? 'scale(1.1) rotate(3deg)' : 'scale(1)',
                  }}
                >
                  <stat.icon size={16} />
                </div>
                <span 
                  style={{
                    fontSize: '8px', fontWeight: 900,
                    color: t.text,
                    backgroundColor: t.badgeBg,
                    border: `1px solid ${t.badgeBorder}`,
                    padding: '4px 8px', borderRadius: '8px',
                    textTransform: 'uppercase', letterSpacing: '0.15em',
                  }}
                >
                  {stat.label}
                </span>
              </div>

              {/* Card Main Value */}
              <div className="relative z-10 mt-5 sm:mt-8">
                {loading ? (
                  <div className="h-10 sm:h-14 w-16 sm:w-20 bg-black/5 dark:bg-white/5 animate-pulse rounded-xl mb-2" />
                ) : error ? (
                  <p className="text-xs font-black text-rose-500/80 uppercase tracking-tighter">Signal Error</p>
                ) : (
                  <p className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: textTitle, textShadow: isLight ? 'none' : '0 2px 10px rgba(0,0,0,0.3)' }}>
                    {stat.value}
                  </p>
                )}
                
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mt-3 sm:mt-4 flex items-center gap-2" style={{ color: textDesc }}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: t.bullet, boxShadow: `0 0 8px ${t.bullet}` }} />
                  <span className="truncate">{stat.desc}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connection Errors Overlay */}
      {error && (
        <div className="p-5 rounded-2xl bg-rose-500/[0.03] border border-rose-500/20 flex flex-col sm:flex-row items-center gap-4 animate-fade-in shadow-[0_10px_30px_rgba(239,68,68,0.05)]">
          <div className="w-11 h-11 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/25 shrink-0">
            <FiShield size={20} />
          </div>
          <div>
            <p className="text-sm font-black text-rose-400 uppercase tracking-widest">Protocol Override Required</p>
            <p className="text-xs font-bold text-slate-400 opacity-80 mt-0.5">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="sm:ml-auto w-full sm:w-auto px-5 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest transition-all border border-rose-500/20 active:scale-95"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* ── 3. DATA TELEMETRY MATRIX GRID ── */}
      <div 
        className="grid grid-cols-1 xl:grid-cols-12"
        style={{ display: 'grid', gap: '40px' }}
      >
        
        {/* ── LEFT SECTION: Operations & Theme (Col-Span 8) ── */}
        <div 
          className="xl:col-span-8"
          style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}
        >
          
          {/* Operation Logs Diagnostics Terminal */}
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
              {logs.map((log, idx) => {
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

          {/* Global Aesthetics Theme Controller */}
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
              {/* Color Signature Selector */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: textSub }}>Primary Signature</p>
                <div className="flex flex-wrap gap-5">
                  {themes.map((t, idx) => {
                    const isSelected = themeSettings.color === t.color;
                    const isHovered = themeHovered === idx;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => saveThemeSettings(t.color, themeSettings.mode)}
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

              {/* Mode Toggle Deck */}
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
                    onClick={() => saveThemeSettings(themeSettings.color, themeSettings.mode === 'dark-theme' ? 'light-theme' : 'dark-theme')}
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
        </div>

        {/* ── RIGHT SECTION: Status Reports (Col-Span 4) ── */}
        <div 
          className="xl:col-span-4"
          style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}
        >
          
          {/* Diagnostic status check list */}
          <section 
            style={{
              backgroundColor: cardBg,
              border: `1px solid ${cardBorder}`,
              boxShadow: `0 10px 30px ${isLight ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.2)'}, ${cardInset}`,
            }}
            className="rounded-2xl p-8 backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3" style={{ marginBottom: '32px' }}>
              <div className="w-10 h-10 rounded-xl bg-[var(--admin-accent)]/15 flex items-center justify-center text-[var(--admin-accent)] border border-[var(--admin-accent)]/20">
                <FiZap size={18} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider" style={{ color: textTitle }}>Status Report</h3>
                <p className="text-[9px] font-bold uppercase tracking-widest mt-0.5" style={{ color: textSub }}>Interactive Telemetry</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* GitHub Status check widget */}
              <div 
                className="transition-all duration-300 cursor-pointer group"
                style={{
                  padding: '22px 26px',
                  borderRadius: '16px',
                  border: hoveredStatus === 'gh' 
                    ? `1px solid ${isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)'}` 
                    : `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
                  backgroundColor: hoveredStatus === 'gh' 
                    ? (isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)') 
                    : (isLight ? 'rgba(0,0,0,0.005)' : 'rgba(255,255,255,0.005)'),
                  transform: hoveredStatus === 'gh' ? 'translateX(3px)' : 'none',
                  boxShadow: hoveredStatus === 'gh'
                    ? (isLight ? '0 8px 24px rgba(0,0,0,0.02)' : '0 8px 24px rgba(0,0,0,0.12)')
                    : 'none'
                }}
                onMouseEnter={() => setHoveredStatus('gh')}
                onMouseLeave={() => setHoveredStatus(null)}
                onClick={() => handlePing('github')}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FiGithub className="text-slate-400 group-hover:text-indigo-400 transition-colors" size={13} />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">GitHub API</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {pinging.github && <div className="w-2.5 h-2.5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mr-1" />}
                    <div 
                      className="w-2 h-2 rounded-full transition-all duration-500" 
                      style={{ 
                        backgroundColor: externalStatus.github.indicator === 'none' ? '#10b981' : '#f59e0b',
                        boxShadow: externalStatus.github.indicator === 'none' ? '0 0 10px #10b981' : '0 0 10px #f59e0b'
                      }} 
                    />
                  </div>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <div>
                    <p className="text-xs font-black" style={{ color: textTitle }}>{externalStatus.github.status}</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Uptime: {externalStatus.github.uptime}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold font-mono" style={{ color: textDesc }}>{externalStatus.github.latency}</span>
                    <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Click to ping</p>
                  </div>
                </div>
              </div>

              {/* Vercel Status check widget */}
              <div 
                className="transition-all duration-300 cursor-pointer group"
                style={{
                  padding: '22px 26px',
                  borderRadius: '16px',
                  border: hoveredStatus === 'v' 
                    ? `1px solid ${isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)'}` 
                    : `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
                  backgroundColor: hoveredStatus === 'v' 
                    ? (isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)') 
                    : (isLight ? 'rgba(0,0,0,0.005)' : 'rgba(255,255,255,0.005)'),
                  transform: hoveredStatus === 'v' ? 'translateX(3px)' : 'none',
                  boxShadow: hoveredStatus === 'v'
                    ? (isLight ? '0 8px 24px rgba(0,0,0,0.02)' : '0 8px 24px rgba(0,0,0,0.12)')
                    : 'none'
                }}
                onMouseEnter={() => setHoveredStatus('v')}
                onMouseLeave={() => setHoveredStatus(null)}
                onClick={() => handlePing('vercel')}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FiGlobe className="text-slate-400 group-hover:text-emerald-400 transition-colors" size={13} />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Vercel Edge</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {pinging.vercel && <div className="w-2.5 h-2.5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mr-1" />}
                    <div 
                      className="w-2 h-2 rounded-full transition-all duration-500" 
                      style={{ 
                        backgroundColor: externalStatus.vercel.indicator === 'none' ? '#10b981' : '#f59e0b',
                        boxShadow: externalStatus.vercel.indicator === 'none' ? '0 0 10px #10b981' : '0 0 10px #f59e0b'
                      }} 
                    />
                  </div>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <div>
                    <p className="text-xs font-black" style={{ color: textTitle }}>{externalStatus.vercel.status}</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Uptime: {externalStatus.vercel.uptime}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold font-mono" style={{ color: textDesc }}>{externalStatus.vercel.latency}</span>
                    <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Click to ping</p>
                  </div>
                </div>
              </div>

              {/* Supabase Status check widget */}
              <div 
                className="transition-all duration-300 cursor-pointer group"
                style={{
                  padding: '22px 26px',
                  borderRadius: '16px',
                  border: hoveredStatus === 'db' 
                    ? `1px solid ${isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)'}` 
                    : `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
                  backgroundColor: hoveredStatus === 'db' 
                    ? (isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)') 
                    : (isLight ? 'rgba(0,0,0,0.005)' : 'rgba(255,255,255,0.005)'),
                  transform: hoveredStatus === 'db' ? 'translateX(3px)' : 'none',
                  boxShadow: hoveredStatus === 'db'
                    ? (isLight ? '0 8px 24px rgba(0,0,0,0.02)' : '0 8px 24px rgba(0,0,0,0.12)')
                    : 'none'
                }}
                onMouseEnter={() => setHoveredStatus('db')}
                onMouseLeave={() => setHoveredStatus(null)}
                onClick={() => handlePing('database')}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FiDatabase className="text-slate-400 group-hover:text-amber-400 transition-colors" size={13} />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Supabase DB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {pinging.database && <div className="w-2.5 h-2.5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mr-1" />}
                    <div 
                      className="w-2 h-2 rounded-full transition-all duration-500" 
                      style={{ 
                        backgroundColor: externalStatus.database.status === 'Operational' ? '#10b981' : '#ef4444',
                        boxShadow: externalStatus.database.status === 'Operational' ? '0 0 10px #10b981' : '0 0 10px #ef4444'
                      }} 
                    />
                  </div>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <div>
                    <p className="text-xs font-black" style={{ color: textTitle }}>{externalStatus.database.status}</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Uptime: {externalStatus.database.uptime}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold font-mono" style={{ color: textDesc }}>{externalStatus.database.latency}</span>
                    <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Click to ping</p>
                  </div>
                </div>
              </div>

              {/* Neural Link pulsing loader line */}
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
                {/* Glowing Laser Progress Line */}
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
            </div>
          </section>

          {/* Total Hits Panel */}
          <section 
            style={{
              backgroundColor: cardBg,
              border: `1px solid ${cardBorder}`,
              boxShadow: `0 10px 30px ${isLight ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.2)'}, ${cardInset}`,
            }}
            className="rounded-2xl p-8 backdrop-blur-2xl"
          >
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Total Command hits</p>
            <h4 className="text-3xl font-black tracking-tight hud-text" style={{ color: textTitle, textShadow: isLight ? 'none' : '0 0 15px rgba(255,255,255,0.1)' }}>
              12.4K
            </h4>
          </section>
        </div>

      </div>
    </div>
  );
}

function hudChipStyle(isLight, hudBg, hudBorder) {
  return {
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
  };
}