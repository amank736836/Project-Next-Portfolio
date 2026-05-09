'use client';

import { useState, useEffect } from 'react';
import { FiTrendingUp, FiLayers, FiMessageSquare, FiActivity, FiArrowUpRight, FiCommand, FiCpu, FiGlobe, FiShield, FiClock } from 'react-icons/fi';
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const responses = await Promise.all([
          fetch('/api/admin/projects'),
          fetch('/api/admin/skills'),
          fetch('/api/admin/education'),
          fetch('/api/admin/experience'),
        ]);

        // Check for 401s
        const unauthorized = responses.find(r => r.status === 401);
        if (unauthorized) {
          setError('Authentication failed. Please log in again.');
          return;
        }

        const [p, s, ed, ex] = await Promise.all(responses.map(r => r.json()));

        console.log('Admin Stats Debug:', { projects: p, skills: s, education: ed, experience: ex });

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
    };
    fetchStats();

    const timer = setInterval(() => {
      const now = new Date();
      setUptime(now.toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-12 animate-fade-in max-w-[1700px] mx-auto pb-10">
      {/* HUD Header */}
      <div className="flex flex-col gap-8 mb-12">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,1)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/80">System Online</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 opacity-60">Signal Stable // Encrypted</p>
        </div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-white/5 pb-8">
          <div>
            <h2 className="text-5xl font-black tracking-tighter !mb-2 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Core Telemetry</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-400/60">Unified Portfolio Command Interface</p>
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
          <Card key={i} className="group relative overflow-hidden min-h-[160px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon size={80} />
            </div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-400 border border-${stat.color}-500/20`}>
                <stat.icon size={18} />
              </div>
              <span className={`text-[9px] font-black text-${stat.color}-400 bg-${stat.color}-500/10 px-2 py-1 rounded-md uppercase tracking-[0.2em] border border-${stat.color}-500/10`}>
                {stat.label}
              </span>
            </div>

            <div className="relative z-10">
              {loading ? (
                <div className="h-10 w-24 bg-white/5 animate-pulse rounded-lg mb-2" />
              ) : error ? (
                <p className="text-xs font-bold text-rose-500/80 uppercase tracking-tighter">Signal Error</p>
              ) : (
                <p className="text-4xl font-black tracking-tighter text-white">{stat.value}</p>
              )}
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mt-1">{stat.desc}</p>
            </div>
          </Card>
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

      {/* System Logs and Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* System Logs */}
        <div className="xl:col-span-7">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold tracking-tighter flex items-center gap-3">
                <FiCommand className="text-[var(--first-color)]" /> Operation Logs
              </h3>
              <div className="flex items-center gap-3">
                <div className="h-1 w-20 bg-indigo-500/10 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-indigo-500 animate-[shimmer_2s_infinite]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest opacity-50">Live Feed</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <div className="flex items-center gap-3 py-2 px-3 rounded-lg border border-white/20 hover:bg-white/5">
                <span className="text-xs font-bold text-slate-500">14:16:55</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                  <p className="text-xs font-medium">API Node Handshake successful</p>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Verified</span>
              </div>
              <div className="flex items-center gap-3 py-2 px-3 rounded-lg border border-white/20 hover:bg-white/5">
                <span className="text-xs font-bold text-slate-500">14:15:22</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/20" />
                  <p className="text-xs font-medium">Showcase database synchronized</p>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Info</span>
              </div>
              <div className="flex items-center gap-3 py-2 px-3 rounded-lg border border-white/20 hover:bg-white/5">
                <span className="text-xs font-bold text-slate-500">14:12:30</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/20" />
                  <p className="text-xs font-medium">Matrix Refactoring Node #9021</p>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Info</span>
              </div>
              <div className="flex items-center gap-3 py-2 px-3 rounded-lg border border-white/20 hover:bg-white/5">
                <span className="text-xs font-bold text-slate-500">14:08:45</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500/20" />
                  <p className="text-xs font-medium">Security Packet verification</p>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Info</span>
              </div>
              <div className="flex items-center gap-3 py-2 px-3 rounded-lg border border-white/20 hover:bg-white/5">
                <span className="text-xs font-bold text-slate-500">13:55:12</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/20" />
                  <p className="text-xs font-medium">System telemetry update</p>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Info</span>
              </div>
              <div className="flex items-center gap-3 py-2 px-3 rounded-lg border border-white/20 hover:bg-white/5">
                <span className="text-xs font-bold text-slate-500">13:42:01</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                  <p className="text-xs font-medium">Identity sequence validated</p>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Verified</span>
              </div>
              <div className="flex items-center gap-3 py-2 px-3 rounded-lg border border-white/20 hover:bg-white/5">
                <span className="text-xs font-bold text-slate-500">13:15:55</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/20" />
                  <p className="text-xs font-medium">Node version 4.2.0 active</p>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Info</span>
              </div>
              <div className="flex items-center gap-3 py-2 px-3 rounded-lg border border-white/20 hover:bg-white/5">
                <span className="text-xs font-bold text-slate-500">13:30:15</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                  <p className="text-xs font-medium">Cloudinary Uplink established</p>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Verified</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions + Security */}
        <div className="xl:col-span-5 space-y-6">
          <QuickActions />

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <FiGlobe size={14} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Network</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-lg font-bold tracking-tighter">Vercel</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Edge</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400">Active</span>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <FiShield size={14} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Security</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider">Auth Status</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Protected</p>
                </div>
                <div className="h-1 w-full bg-indigo-500/20 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-indigo-500" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}