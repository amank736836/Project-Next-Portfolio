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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [p, s, ed, ex] = await Promise.all([
          fetch('/api/api/admin/projects').then(r => r.json()),
          fetch('/api/api/admin/skills').then(r => r.json()),
          fetch('/api/api/admin/education').then(r => r.json()),
          fetch('/api/api/admin/experience').then(r => r.json()),
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
    <div className="space-y-8 animate-fade-in max-w-[1700px] mx-auto pb-10">
      {/* HUD Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">System Online</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tighter !mb-0">Core Telemetry</h2>
        <p className="text-sm font-bold uppercase tracking-wider text-slate-500 opacity-75">Unified Command Interface // Signal Stable</p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 border border-white/20">
            <FiClock className="h-4 w-4 text-emerald-400" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Local Time</p>
              <p className="text-sm font-bold">{uptime}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 border border-white/20">
            <FiActivity className="h-4 w-4 text-emerald-400" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Uptime</p>
              <p className="text-sm font-bold">12:44:02</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 border border-white/20">
            <FiCpu className="h-4 w-4 text-emerald-400" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">System Load</p>
              <p className="text-sm font-bold">1.24%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="flex items-start">
          <Card className="flex h-[120px] items-start">
            <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center bg-emerald-500/20 rounded-lg">
              <FiLayers className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="ml-4 flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Nodes</span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">+2</span>
              </div>
              <p className="text-2xl font-bold tracking-tighter text-white flex items-center">
                {stats.projects}
                <span className="ml-2 h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse" />
              </p>
            </div>
          </Card>
        </div>
        <div className="flex items-start">
          <Card className="flex h-[120px] items-start">
            <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center bg-emerald-500/20 rounded-lg">
              <FiTrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="ml-4 flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Matrix Skills</span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">+5</span>
              </div>
              <p className="text-2xl font-bold tracking-tighter text-white flex items-center">
                {stats.skills}
                <span className="ml-2 h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse" />
              </p>
            </div>
          </Card>
        </div>
        <div className="flex items-start">
          <Card className="flex h-[120px] items-start">
            <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center bg-emerald-500/20 rounded-lg">
              <FiMessageSquare className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="ml-4 flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mission Logs</span>
                <span className="text-xs font-bold uppercase tracking-wider">Stable</span>
              </div>
              <p className="text-2xl font-bold tracking-tighter text-white flex items-center">
                {stats.experience}
                <span className="ml-2 h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse" />
              </p>
            </div>
          </Card>
        </div>
        <div className="flex items-start">
          <Card className="flex h-[120px] items-start">
            <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center bg-emerald-500/20 rounded-lg">
              <FiActivity className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="ml-4 flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Academy Data</span>
                <span className="text-xs font-bold uppercase tracking-wider">Static</span>
              </div>
              <p className="text-2xl font-bold tracking-tighter text-white flex items-center">
                {stats.education}
                <span className="ml-2 h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse" />
              </p>
            </div>
          </Card>
        </div>
      </div>

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