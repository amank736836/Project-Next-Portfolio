'use client';

import { useState, useEffect } from 'react';
import { 
  FiTrendingUp, FiLayers, FiMessageSquare, FiActivity, FiArrowUpRight, 
  FiCommand, FiCpu, FiGlobe, FiShield, FiClock, FiZap, 
  FiDatabase, FiGithub, FiExternalLink, FiPieChart, FiSun, FiMoon 
} from 'react-icons/fi';
import { themes } from '@/data';
import QuickActions from './QuickActions';
import { Card } from '@/components/ui';

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    education: 0,
    experience: 0
  });
  const [uptime, setUptime] = useState('00:00:00');
  const [mounted, setMounted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [externalStatus, setExternalStatus] = useState({
    github: { status: 'Checking...', indicator: 'none' },
    vercel: { status: 'Checking...', indicator: 'none' },
    database: { status: 'Checking...' }
  });

  const [themeSettings, setThemeSettings] = useState({
    color: 'Blue',
    mode: 'dark-theme'
  });
  const [savingTheme, setSavingTheme] = useState(false);
  const [success, setSuccess] = useState('');

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

  const fetchExternalStatuses = async () => {
    // GitHub Status
    try {
      const ghRes = await fetch('https://www.githubstatus.com/api/v2/status.json');
      const ghData = await ghRes.json();
      setExternalStatus(prev => ({ 
        ...prev, 
        github: { 
          status: ghData.status.description, 
          indicator: ghData.status.indicator 
        } 
      }));
    } catch (e) {
      setExternalStatus(prev => ({ ...prev, github: { status: 'Protocol Offline', indicator: 'minor' } }));
    }

    // Vercel Status
    try {
      const vRes = await fetch('https://www.vercel-status.com/api/v2/status.json');
      const vData = await vRes.json();
      setExternalStatus(prev => ({ 
        ...prev, 
        vercel: { 
          status: vData.status.description, 
          indicator: vData.status.indicator 
        } 
      }));
    } catch (e) {
      setExternalStatus(prev => ({ ...prev, vercel: { status: 'Edge Offline', indicator: 'minor' } }));
    }
  };

  const fetchStats = async () => {
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
      setExternalStatus(prev => ({ ...prev, database: { status: 'Operational' } }));
      setError(null);
    } catch (err) {
      console.error('Stats fetch failed', err);
      setError('Failed to connect to the matrix server.');
      setExternalStatus(prev => ({ ...prev, database: { status: 'Degraded' } }));
    } finally {
      setLoading(false);
    }
  };

  const fetchThemeSettings = async () => {
    try {
      const res = await fetch('/api/admin/info');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) {
        const color = data.find(item => item.key === 'default_theme_color')?.description || 'Blue';
        const mode = data.find(item => item.key === 'default_theme_mode')?.description || 'dark-theme';
        setThemeSettings({ color, mode });
      }
    } catch (err) {
      console.error('Failed to fetch theme settings', err);
    }
  };

  const saveThemeSettings = async (color, mode) => {
    setSavingTheme(true);
    setSuccess('');
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
        setThemeSettings({ color, mode });
        
        // Force apply to current session immediately for the admin
        localStorage.setItem("color", color);
        localStorage.setItem("theme", mode);
        document.documentElement.style.setProperty("--first-color", color);
        document.documentElement.className = mode;
        window.dispatchEvent(new Event("themeChange"));

        setSuccess('Theme updated across the matrix');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Failed to save theme settings', err);
    } finally {
      setSavingTheme(false);
    }
  };

  const logs = [
    { action: 'AUTH_GATEWAY', details: 'Admin session established via Secure ID', time: '12s ago', type: 'auth' },
    { action: 'DB_SYNC', details: 'Project matrix synchronization completed', time: '1m ago', type: 'write' },
    { action: 'CACHE_PURGE', details: 'Global edge cache invalidated successfully', time: '5m ago', type: 'system' },
    { action: 'ENTRY_CREATED', details: 'New academy record injected into sector 7', time: '12m ago', type: 'write' },
    { action: 'SEC_AUDIT', details: 'Routine integrity check passed: 0 vulnerabilities', time: '1h ago', type: 'auth' },
  ];

  return (
    <div className="space-y-12 animate-fade-in max-w-[1700px] mx-auto pb-20">
      {/* HUD Header */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,1)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/80">System Online</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 opacity-60">Signal Stable // Encrypted</p>
        </div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-white/5 pb-10">
          <div>
            <h2 className="text-4xl font-black tracking-tighter !mb-1 text-[var(--admin-title)]">Core Telemetry</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--admin-accent)] opacity-60">Unified Portfolio Command Interface</p>
          </div>

          <div className="flex flex-wrap gap-8 mb-4">
            <div className="flex items-center gap-5 p-5 px-6 rounded-2xl bg-[var(--admin-card)] border border-[var(--admin-border)] backdrop-blur-md transition-all hover:border-[var(--admin-accent)]/30 group/hud">
              <div className="w-11 h-11 rounded-xl bg-[var(--admin-accent)]/10 flex items-center justify-center text-[var(--admin-accent)] group-hover/hud:scale-110 transition-transform">
                <FiClock size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Local Time</p>
                <p className="text-xl font-black tracking-tight hud-text">{uptime}</p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-5 px-6 rounded-2xl bg-[var(--admin-card)] border border-[var(--admin-border)] backdrop-blur-md transition-all hover:border-emerald-500/30 group/hud">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover/hud:scale-110 transition-transform">
                <FiActivity size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Session</p>
                <p className="text-xl font-black tracking-tight hud-text">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {[
          { label: 'Projects', value: stats.projects, icon: FiLayers, color: 'indigo', desc: 'Total Nodes Active' },
          { label: 'Matrix', value: stats.skills, icon: FiTrendingUp, color: 'emerald', desc: 'Identified Skills' },
          { label: 'Logs', value: stats.experience, icon: FiMessageSquare, color: 'amber', desc: 'Experience Entries' },
          { label: 'Academy', value: stats.education, icon: FiGlobe, color: 'rose', desc: 'Education Data' }
        ].map((stat, i) => (
          <div key={i} className="telemetry-card group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <stat.icon size={120} />
            </div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-400 border border-${stat.color}-500/20`}>
                <stat.icon size={22} />
              </div>
              <span className={`text-[10px] font-black text-${stat.color}-400 bg-${stat.color}-500/10 px-3 py-1.5 rounded-lg uppercase tracking-[0.2em] border border-${stat.color}-500/10`}>
                {stat.label}
              </span>
            </div>

            <div className="relative z-10 mt-8">
              {loading ? (
                <div className="h-12 w-24 bg-white/5 animate-pulse rounded-xl mb-2" />
              ) : error ? (
                <p className="text-xs font-bold text-rose-500/80 uppercase tracking-tighter">Signal Error</p>
              ) : (
                <p className="text-6xl font-black tracking-tighter text-[var(--admin-title)]">{stat.value}</p>
              )}
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mt-4 flex items-center gap-2">
                <span className={`w-1 h-1 rounded-full bg-${stat.color}-500`} />
                {stat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex items-center gap-4 animate-fade-in">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
            <FiShield size={20} />
          </div>
          <div>
            <p className="text-sm font-black text-rose-400 uppercase tracking-widest">Protocol Override Required</p>
            <p className="text-xs font-bold text-slate-400 opacity-80">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="ml-auto px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Retry Connection
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 gap-y-16">
        {/* Left Column - High Density Data */}
        <div className="xl:col-span-8 space-y-6">
          {/* Operation Logs */}
          <section className="admin-card !p-0 overflow-hidden border-[var(--admin-border)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--admin-border)] bg-[var(--admin-accent)]/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--admin-accent)]/10 flex items-center justify-center text-[var(--admin-accent)]">
                  <FiActivity size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--admin-title)] uppercase tracking-wider">Operation Logs</h3>
                  <p className="text-[10px] text-slate-500 font-bold tracking-tighter">Real-time system synchronization</p>
                </div>
              </div>
              <button className="text-[10px] font-black text-[var(--admin-accent)] uppercase tracking-widest hover:opacity-80 transition-opacity">Clear</button>
            </div>
            
            <div className="max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 p-4 space-y-3">
              {logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] group hover:bg-white/[0.04] transition-colors">
                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                    log.type === 'auth' ? 'bg-[var(--admin-accent)] shadow-[0_0_15px_var(--admin-accent-glow)]' : 
                    log.type === 'write' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                    'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                  }`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{log.action}</span>
                      <span className="text-[9px] font-medium text-slate-500 font-mono">{log.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed group-hover:whitespace-normal transition-all">{log.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Theme Settings */}
          <section className="admin-card border-[var(--admin-border)] bg-[var(--admin-card)] p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <FiZap size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--admin-title)] uppercase tracking-wider">Global Aesthetics</h3>
                <p className="text-[10px] text-slate-500 font-bold tracking-tighter">Set default theme for new users</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Color Selector */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Primary Signature</p>
                <div className="flex flex-wrap gap-4">
                  {themes.map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => saveThemeSettings(t.color, themeSettings.mode)}
                      className={`w-7 h-7 transition-all hover:scale-110 active:scale-95 ${
                        themeSettings.color === t.color 
                          ? 'border-2 border-white shadow-[0_0_15px_var(--first-color)] scale-125' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ 
                        backgroundColor: t.color,
                        borderRadius: '50% 50% 50% 0',
                        transform: 'rotate(-45deg)',
                        margin: '6px'
                      }}
                      title={t.color}
                    />
                  ))}
                </div>
              </div>

              {/* Mode Selector */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] protocol-panel">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Visual Protocol</p>
                  <p className="text-sm font-bold text-[var(--admin-title)] capitalize">{themeSettings.mode.split('-')[0]} Mode</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => saveThemeSettings(themeSettings.color, themeSettings.mode === 'dark-theme' ? 'light-theme' : 'dark-theme')}
                    aria-label="Toggle theme"
                    title="Toggle theme"
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${themeSettings.mode === 'dark-theme' ? 'bg-[var(--admin-accent)] text-white' : 'bg-[var(--admin-card)] text-[var(--admin-title)] hover:bg-[color-mix(in srgb, var(--admin-card) 85%, white 15%)]'}`}
                  >
                    {themeSettings.mode === 'dark-theme' ? <FiMoon size={18} /> : <FiSun size={18} />}
                  </button>
                </div>
              </div>

              {success && (
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest text-center animate-bounce">{success}</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column - Status */}
        <div className="xl:col-span-4 space-y-8">
          <section className="admin-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[var(--admin-accent)]/20 flex items-center justify-center text-[var(--admin-accent)]">
                <FiZap size={20} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--admin-title)] uppercase tracking-wider">Status Report</h3>
                <p className="text-[10px] text-slate-500 font-bold">Priority Status</p>
              </div>
            </div>
            <div className="space-y-4">
              {/* GitHub Status */}
              <div className="p-4 rounded-2xl bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] group hover:border-[var(--admin-accent)]/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FiGithub className="text-slate-400" size={14} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">GitHub Protocol</span>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${externalStatus.github.indicator === 'none' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-[var(--admin-accent)] shadow-[0_0_8px_var(--admin-accent-glow)]'}`} />
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-xs font-bold text-[var(--admin-title)] truncate max-w-[150px]">{externalStatus.github.status}</p>
                  <span className="text-[8px] font-mono text-slate-600 uppercase tracking-tighter">Status.json</span>
                </div>
              </div>

              {/* Vercel Status */}
              <div className="p-4 rounded-2xl bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] group hover:border-[var(--admin-accent)]/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FiGlobe className="text-slate-400" size={14} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vercel Edge</span>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${externalStatus.vercel.indicator === 'none' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-[var(--admin-accent)] shadow-[0_0_8px_var(--admin-accent-glow)]'}`} />
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-xs font-bold text-[var(--admin-title)] truncate max-w-[150px]">{externalStatus.vercel.status}</p>
                  <span className="text-[8px] font-mono text-slate-600 uppercase tracking-tighter">Vercel-Status</span>
                </div>
              </div>

              {/* DB Status */}
              <div className="p-4 rounded-2xl bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] group hover:border-[var(--admin-accent)]/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FiDatabase className="text-slate-400" size={14} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Supabase Instance</span>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${externalStatus.database.status === 'Operational' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 animate-pulse'}`} />
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-xs font-bold text-[var(--admin-title)]">{externalStatus.database.status}</p>
                  <span className="text-[8px] font-mono text-slate-600 uppercase tracking-tighter">PostgreSQL v15</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] group hover:border-[var(--admin-accent)]/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Neural Link</span>
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i => <div key={i} className="w-1 h-1 rounded-full bg-emerald-500/40" />)}
                  </div>
                </div>
                <div className="h-1.5 w-full bg-[var(--admin-title)]/5 rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-[var(--admin-accent)] rounded-full shadow-[0_0_10px_var(--admin-accent-glow)]" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4">
            <div className="admin-card !p-6 border-[var(--admin-border)] bg-[var(--admin-card)]">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Hits</p>
              <h4 className="text-2xl font-black text-[var(--admin-title)] tracking-tighter">12.4K</h4>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}