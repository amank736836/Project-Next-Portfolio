'use client';

import { useState, useEffect } from 'react';
import { 
  FiTrendingUp, FiLayers, FiMessageSquare, FiActivity, FiArrowUpRight, 
  FiCommand, FiCpu, FiGlobe, FiShield, FiClock, FiZap, 
  FiDatabase, FiGithub, FiExternalLink, FiPieChart 
} from 'react-icons/fi';
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
  const [matrixData, setMatrixData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [externalStatus, setExternalStatus] = useState({
    github: { status: 'Checking...', indicator: 'none' },
    vercel: { status: 'Checking...', indicator: 'none' },
    database: { status: 'Checking...' }
  });

  useEffect(() => {
    setMounted(true);
    setMatrixData(Array.from({ length: 48 }).map(() => Math.random() > 0.4));
    
    fetchStats();
    fetchExternalStatuses();

    const timer = setInterval(() => {
      const now = new Date();
      setUptime(now.toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
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

  const logs = [
    { action: 'AUTH_GATEWAY', details: 'Admin session established via Secure ID', time: '12s ago', type: 'auth' },
    { action: 'DB_SYNC', details: 'Project matrix synchronization completed', time: '1m ago', type: 'write' },
    { action: 'CACHE_PURGE', details: 'Global edge cache invalidated successfully', time: '5m ago', type: 'system' },
    { action: 'ENTRY_CREATED', details: 'New academy record injected into sector 7', time: '12m ago', type: 'write' },
    { action: 'SEC_AUDIT', details: 'Routine integrity check passed: 0 vulnerabilities', time: '1h ago', type: 'auth' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-[1700px] mx-auto pb-10">
      {/* HUD Header */}
      <div className="flex flex-col gap-4 mb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,1)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/80">System Online</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 opacity-60">Signal Stable // Encrypted</p>
        </div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-4xl font-black tracking-tighter !mb-1 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Core Telemetry</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400/60">Unified Portfolio Command Interface</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <FiClock size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Local Time</p>
                <p className="text-lg font-black tracking-tight hud-text">{uptime}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <FiActivity size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Session</p>
                <p className="text-lg font-black tracking-tight hud-text">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Projects', value: stats.projects, icon: FiLayers, color: 'indigo', desc: 'Total Nodes Active' },
          { label: 'Matrix', value: stats.skills, icon: FiTrendingUp, color: 'emerald', desc: 'Identified Skills' },
          { label: 'Logs', value: stats.experience, icon: FiMessageSquare, color: 'amber', desc: 'Experience Entries' },
          { label: 'Academy', value: stats.education, icon: FiGlobe, color: 'rose', desc: 'Education Data' }
        ].map((stat, i) => (
          <div key={i} className="telemetry-card group !min-h-[180px] hover:border-white/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon size={80} />
            </div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-400 border border-${stat.color}-500/20`}>
                <stat.icon size={18} />
              </div>
              <span className={`text-[10px] font-black text-${stat.color}-400 bg-${stat.color}-500/10 px-2 py-1 rounded-md uppercase tracking-[0.2em] border border-${stat.color}-500/10`}>
                {stat.label}
              </span>
            </div>

            <div className="relative z-10 mt-auto">
              {loading ? (
                <div className="h-10 w-24 bg-white/5 animate-pulse rounded-lg mb-2" />
              ) : error ? (
                <p className="text-xs font-bold text-rose-500/80 uppercase tracking-tighter">Signal Error</p>
              ) : (
                <p className="text-5xl font-black tracking-tighter text-white">{stat.value}</p>
              )}
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mt-4">{stat.desc}</p>
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

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column - High Density Data */}
        <div className="xl:col-span-8 space-y-6">
          {/* Operation Logs */}
          <section className="admin-card !p-0 overflow-hidden border-white/5">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05] bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <FiActivity size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Operation Logs</h3>
                  <p className="text-[10px] text-slate-500 font-bold tracking-tighter">Real-time system synchronization</p>
                </div>
              </div>
              <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300">Clear</button>
            </div>
            
            <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 p-4 space-y-3">
              {logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] group hover:bg-white/[0.04] transition-colors">
                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                    log.type === 'auth' ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 
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

          {/* Activity Matrix */}
          <section className="admin-card !p-8 border-white/5 bg-gradient-to-br from-indigo-500/[0.02] to-transparent">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Neural Activity Matrix</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-[10px] font-bold text-slate-500">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                  <span className="text-[10px] font-bold text-slate-500">Idle</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              {mounted && matrixData.map((isActive, i) => (
                <div 
                  key={i} 
                  className={`aspect-square rounded-sm transition-all duration-500 hover:scale-125 hover:z-10 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-500/20 hover:bg-indigo-500/40 shadow-[inset_0_0_10px_rgba(99,102,241,0.1)]' 
                      : 'bg-white/[0.03] hover:bg-white/[0.08]'
                  }`}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Right Column - Status */}
        <div className="xl:col-span-4 space-y-6">
          <section className="admin-card border-indigo-500/20 bg-indigo-500/[0.02]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FiZap size={20} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Status Report</h3>
                <p className="text-[10px] text-slate-500 font-bold">Priority Status</p>
              </div>
            </div>
            <div className="space-y-4">
              {/* GitHub Status */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 group hover:border-indigo-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FiGithub className="text-slate-400" size={14} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">GitHub Protocol</span>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${externalStatus.github.indicator === 'none' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 animate-pulse'}`} />
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-xs font-bold text-white truncate max-w-[150px]">{externalStatus.github.status}</p>
                  <span className="text-[8px] font-mono text-slate-600 uppercase tracking-tighter">Status.json</span>
                </div>
              </div>

              {/* Vercel Status */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 group hover:border-indigo-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FiGlobe className="text-slate-400" size={14} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vercel Edge</span>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${externalStatus.vercel.indicator === 'none' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 animate-pulse'}`} />
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-xs font-bold text-white truncate max-w-[150px]">{externalStatus.vercel.status}</p>
                  <span className="text-[8px] font-mono text-slate-600 uppercase tracking-tighter">Vercel-Status</span>
                </div>
              </div>

              {/* DB Status */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 group hover:border-indigo-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FiDatabase className="text-slate-400" size={14} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Supabase Instance</span>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${externalStatus.database.status === 'Operational' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 animate-pulse'}`} />
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-xs font-bold text-white">{externalStatus.database.status}</p>
                  <span className="text-[8px] font-mono text-slate-600 uppercase tracking-tighter">PostgreSQL v15</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 group hover:border-indigo-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Neural Link</span>
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i => <div key={i} className="w-1 h-1 rounded-full bg-emerald-500/40" />)}
                  </div>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-indigo-500 animate-pulse" />
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4">
            <div className="admin-card !p-6 border-white/5 bg-white/[0.01]">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Hits</p>
              <h4 className="text-2xl font-black text-white tracking-tighter">12.4K</h4>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}