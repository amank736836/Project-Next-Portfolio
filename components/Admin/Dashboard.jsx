'use client';

import { useState, useEffect } from 'react';
import { FiTrendingUp, FiLayers, FiMessageSquare, FiActivity, FiArrowUpRight, FiCommand, FiCpu, FiGlobe, FiShield, FiClock } from 'react-icons/fi';

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    education: 0,
    experience: 0
  });
  const [uptime, setUptime] = useState('00:00:00');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [p, s, ed, ex] = await Promise.all([
          fetch('/api/admin/projects').then(r => r.json()),
          fetch('/api/admin/skills').then(r => r.json()),
          fetch('/api/admin/education').then(r => r.json()),
          fetch('/api/admin/experience').then(r => r.json()),
        ]);
        setStats({
          projects: Array.isArray(p) ? p.length : 0,
          skills: Array.isArray(s) ? s.length : 0,
          education: Array.isArray(ed) ? ed.length : 0,
          experience: Array.isArray(ex) ? ex.length : 0,
        });
      } catch (err) {
        console.error('Stats fetch failed', err);
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
    <div className="space-y-10 animate-fade-in max-w-[1600px] mx-auto">
      {/* HUD Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 mb-12">
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">System Online</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter !mb-0">Core Telemetry</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3 opacity-60">Unified Command Interface // Signal Stable</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <HUDWidget label="Local Time" value={uptime} icon={<FiClock />} />
          <HUDWidget label="Uptime" value="12:44:02" icon={<FiActivity />} />
          <HUDWidget label="System Load" value="1.24%" icon={<FiCpu />} />
        </div>
      </div>

      {/* Main Stats Grid - ENSURING 4 COLUMNS ON LG */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <TelemetryCard 
          icon={<FiLayers />} 
          label="Project Nodes" 
          value={stats.projects} 
          trend="+2"
          sparkline={[20, 40, 35, 50, 45, 60]}
        />
        <TelemetryCard 
          icon={<FiTrendingUp />} 
          label="Matrix Skills" 
          value={stats.skills} 
          trend="+5"
          sparkline={[30, 25, 45, 40, 55, 50]}
        />
        <TelemetryCard 
          icon={<FiMessageSquare />} 
          label="Mission Logs" 
          value={stats.experience} 
          trend="Stable"
          sparkline={[50, 50, 50, 50, 50, 50]}
        />
        <TelemetryCard 
          icon={<FiActivity />} 
          label="Academy Data" 
          value={stats.education} 
          trend="Static"
          sparkline={[10, 20, 15, 25, 20, 30]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* System Logs */}
        <div className="lg:col-span-8 admin-card !p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black tracking-tighter flex items-center gap-4">
              <FiCommand className="text-[var(--first-color)]" /> Operation Logs
            </h3>
            <div className="flex items-center gap-4">
               <div className="h-1 w-20 bg-indigo-500/10 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-indigo-500 animate-[shimmer_2s_infinite]" />
               </div>
               <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Live Feed</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
            <LogEntry time="14:16:55" event="API Node Handshake successful" status="emerald" />
            <LogEntry time="14:15:22" event="Showcase database synchronized" status="indigo" />
            <LogEntry time="14:12:30" event="Matrix Refactoring Node #9021" status="indigo" />
            <LogEntry time="14:08:45" event="Security Packet verification" status="emerald" />
            <LogEntry time="13:55:12" event="System telemetry update" status="amber" />
            <LogEntry time="13:42:01" event="Identity sequence validated" status="emerald" />
            <LogEntry time="13:30:15" event="Node version 4.2.0 active" status="indigo" />
            <LogEntry time="13:15:55" event="Cloudinary Uplink established" status="emerald" />
          </div>
        </div>

        {/* Security / Status */}
        <div className="lg:col-span-4 space-y-6">
          <div className="admin-card deep-glass !p-8 glow-border border-none shadow-[0_0_50px_rgba(var(--admin-accent-rgb),0.15)] relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <FiShield className="text-7xl text-[var(--first-color)] floating-icon" />
             </div>
             <h3 className="text-xl font-black tracking-tight mb-2">Security Node</h3>
             <p className="text-xs font-medium opacity-60 leading-relaxed mb-8 relative z-10">
               Encryption active (AES-256). All admin routes are protected by encrypted handshake sessions.
             </p>
             <div className="flex items-center justify-between mb-2">
                <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Auth Status</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500 animate-pulse">Protected</span>
             </div>
             <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
             </div>
          </div>

          <div className="admin-card !p-8 bg-white/[0.01]">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <FiGlobe size={14} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Network Node</span>
             </div>
             <div className="flex justify-between items-end">
                <div>
                   <p className="text-xl font-black tracking-tighter">Vercel Edge</p>
                   <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Primary Gateway</p>
                </div>
                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-1 bg-emerald-500/10 px-2 py-1 rounded">Active</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TelemetryCard({ icon, label, value, trend, sparkline }) {
  return (
    <div className="admin-card holographic-card group hover:glow-border !p-6 transition-all duration-500 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-[var(--first-color)] border border-white/5 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-white/5 border border-white/5 ${trend === 'Stable' || trend === 'Static' ? 'text-slate-500' : 'text-emerald-500'}`}>
          {trend}
        </span>
      </div>
      
      <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">{label}</p>
      <h4 className="text-3xl font-black tracking-tighter text-[var(--admin-title)] mb-4">{value}</h4>
      
      <div className="sparkline-container !h-8">
        <svg viewBox="0 0 100 40" className="w-full h-full">
          <defs>
             <linearGradient id="glowGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--first-color)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--first-color)" stopOpacity="0" />
             </linearGradient>
          </defs>
          <path
            d={`M 0 ${40 - sparkline[0]} ${sparkline.map((v, i) => `L ${(i * 100) / (sparkline.length - 1)} ${40 - v}`).join(' ')}`}
            fill="none"
            stroke="var(--first-color)"
            strokeWidth="3"
            strokeLinecap="round"
            className="opacity-20 group-hover:opacity-100 transition-opacity"
            style={{ filter: 'drop-shadow(0 0 8px var(--first-color))' }}
          />
        </svg>
      </div>
    </div>
  );
}

function HUDWidget({ label, value, icon }) {
  return (
    <div className="flex items-center gap-4 deep-glass p-5 rounded-2xl border border-white/5 shadow-2xl">
      <div className="text-[var(--first-color)] opacity-60 floating-icon">
        {icon}
      </div>
      <div>
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-sm font-black tracking-tight hud-text leading-none">{value}</p>
      </div>
    </div>
  );
}

function LogEntry({ time, event, status }) {
  const colors = {
    emerald: 'text-emerald-500 bg-emerald-500/10',
    indigo: 'text-indigo-500 bg-indigo-500/10',
    amber: 'text-amber-500 bg-amber-500/10'
  };
  
  return (
    <div className="flex items-center gap-6 py-3 border-b border-[var(--border-color)] last:border-0 hover:bg-white/[0.02] transition-colors px-2 rounded-lg group">
      <span className="text-[10px] font-bold text-slate-500 hud-text">{time}</span>
      <div className="flex-1 flex items-center gap-3">
        <div className={`w-1.5 h-1.5 rounded-full ${colors[status].split(' ')[0]}`} />
        <p className="text-xs font-medium text-[var(--admin-title)] group-hover:translate-x-1 transition-transform">{event}</p>
      </div>
      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${colors[status]}`}>
        {status === 'emerald' ? 'Verified' : 'Info'}
      </span>
    </div>
  );
}
