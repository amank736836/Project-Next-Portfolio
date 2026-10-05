'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FiClock, FiActivity, FiGithub, FiGlobe, FiDatabase, FiZap, FiShield,
  FiLayers, FiTrendingUp, FiMessageSquare
} from 'react-icons/fi';
import { syncThemeCssVars } from '@/lib/utils';
import { useLoading } from './LoadingContext';
import OperationLogs from './Dashboard/OperationLogs';
import ThemeController from './Dashboard/ThemeController';
import StatCard from './Dashboard/StatCard';
import HUDHeader from './Dashboard/HUDHeader';
import ExternalStatusWidget from './Dashboard/ExternalStatusWidget';
import NeuralLinkWidget from './Dashboard/NeuralLinkWidget';
import { OPERATION_LOGS } from './Dashboard/data/operationLogs';
import { STAT_THEMES, STATS } from './Dashboard/data/dashboardData';

const ICON_MAP = {
  FiLayers,
  FiTrendingUp,
  FiMessageSquare,
  FiGlobe,
};

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

  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredLog, setHoveredLog] = useState(null);
  const [hoveredStatus, setHoveredStatus] = useState(null);
  const [themeHovered, setThemeHovered] = useState(null);
  const [toggleHovered, setToggleHovered] = useState(false);

  const { startLoading, stopLoading } = useLoading();

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

  const fetchExternalStatuses = useCallback(async () => {
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
  }, []);

  const fetchStats = useCallback(async () => {
    startLoading();
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
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  const fetchThemeSettings = useCallback(async () => {
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
  }, []);

  const saveThemeSettings = useCallback(async (color, mode) => {
    setSavingTheme(true);
    setSuccess('');

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
  }, []);

  const handlePing = useCallback((key) => {
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
  }, []);

  const isLight = themeSettings.mode === 'light-theme';

  const { cardBg, cardBorder, cardInset, textTitle, textDesc, textSub, hudBg, hudBorder } = useMemo(() => {
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
    };
  }, [isLight]);

  const statItems = useMemo(() => STATS.map(s => ({
    ...s,
    icon: ICON_MAP[s.icon],
    value: stats[s.label.toLowerCase() === 'projects' ? 'projects' : s.label.toLowerCase() === 'matrix' ? 'skills' : s.label.toLowerCase() === 'logs' ? 'experience' : 'education']
  })), [stats]);

  return (
    <div
      className="admin-dashboard animate-fade-in max-w-[1700px] mx-auto pb-20 px-4 md:px-6"
      style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
    >

      <div className="flex flex-col gap-4">
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

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:pr-16 border-b border-black/[0.05] dark:border-white/[0.06] pb-5">

          <div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight !mb-1" style={{ color: textTitle }}>
              Core Telemetry
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--admin-accent)] opacity-85" style={{ letterSpacing: '0.25em' }}>
              Unified Portfolio Command Interface
            </p>
          </div>
          <HUDHeader
            uptime={uptime}
            isLight={isLight}
            textTitle={textTitle}
            hudBg={hudBg}
            hudBorder={hudBorder}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {statItems.map((stat, i) => (
          <div key={i} className="admin-reveal" data-reveal-delay={i * 90}>
          <StatCard
            stat={stat}
            loading={loading}
            error={error}
            isHovered={hoveredCard === i}
            onMouseEnter={() => setHoveredCard(i)}
            onMouseLeave={() => setHoveredCard(null)}
            STAT_THEMES={STAT_THEMES}
            textTitle={textTitle}
            textDesc={textDesc}
            isLight={isLight}
            cardBg={cardBg}
            cardBorder={cardBorder}
            cardInset={cardInset}
          />
          </div>
        ))}
      </div>

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

      <div
        className="grid grid-cols-1 xl:grid-cols-12"
        style={{ display: 'grid', gap: '24px' }}
      >
        <div
          className="xl:col-span-8 admin-reveal"
          style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          <OperationLogs
            hoveredLog={hoveredLog}
            setHoveredLog={setHoveredLog}
            isLight={isLight}
            textTitle={textTitle}
            textSub={textSub}
            textDesc={textDesc}
            cardBg={cardBg}
            cardBorder={cardBorder}
            cardInset={cardInset}
          />

          <ThemeController
            themeSettings={themeSettings}
            savingTheme={savingTheme}
            success={success}
            onSaveTheme={saveThemeSettings}
            isLight={isLight}
            textTitle={textTitle}
            textSub={textSub}
            cardBg={cardBg}
            cardBorder={cardBorder}
            cardInset={cardInset}
            themeHovered={themeHovered}
            setThemeHovered={setThemeHovered}
            toggleHovered={toggleHovered}
            setToggleHovered={setToggleHovered}
          />
        </div>

        <div
          className="xl:col-span-4 admin-reveal" data-reveal-delay="140"
          style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          <section
            style={{
              backgroundColor: cardBg,
              border: `1px solid ${cardBorder}`,
              boxShadow: `0 10px 30px ${isLight ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.2)'}, ${cardInset}`,
            }}
            className="rounded-2xl p-6 backdrop-blur-2xl admin-lift"
            data-spotlight
          >
            <div className="flex items-center gap-3" style={{ marginBottom: '24px' }}>
              <div className="w-10 h-10 rounded-xl bg-[var(--admin-accent)]/15 flex items-center justify-center text-[var(--admin-accent)] border border-[var(--admin-accent)]/20">
                <FiZap size={18} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider" style={{ color: textTitle }}>Status Report</h3>
                <p className="text-[9px] font-bold uppercase tracking-widest mt-0.5" style={{ color: textSub }}>Interactive Telemetry</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ExternalStatusWidget
                icon={<FiGithub size={13} />}
                label="GitHub API"
                status={externalStatus.github}
                pinging={pinging.github}
                onPing={() => handlePing('github')}
                hovered={hoveredStatus === 'gh'}
                onHover={() => setHoveredStatus('gh')}
                onLeave={() => setHoveredStatus(null)}
                isLight={isLight}
                textTitle={textTitle}
                textDesc={textDesc}
                textSub={textSub}
                cardBg={cardBg}
                cardBorder={cardBorder}
              />

              <ExternalStatusWidget
                icon={<FiGlobe size={13} />}
                label="Vercel Edge"
                status={externalStatus.vercel}
                pinging={pinging.vercel}
                onPing={() => handlePing('vercel')}
                hovered={hoveredStatus === 'v'}
                onHover={() => setHoveredStatus('v')}
                onLeave={() => setHoveredStatus(null)}
                isLight={isLight}
                textTitle={textTitle}
                textDesc={textDesc}
                textSub={textSub}
                cardBg={cardBg}
                cardBorder={cardBorder}
              />

              <ExternalStatusWidget
                icon={<FiDatabase size={13} />}
                label="Supabase DB"
                status={externalStatus.database}
                pinging={pinging.database}
                onPing={() => handlePing('database')}
                hovered={hoveredStatus === 'db'}
                onHover={() => setHoveredStatus('db')}
                onLeave={() => setHoveredStatus(null)}
                isLight={isLight}
                textTitle={textTitle}
                textDesc={textDesc}
                textSub={textSub}
                cardBg={cardBg}
                cardBorder={cardBorder}
              />

              <NeuralLinkWidget
                isLight={isLight}
                cardBg={cardBg}
                cardBorder={cardBorder}
                textTitle={textTitle}
                textDesc={textDesc}
              />
            </div>
          </section>

          <section
            style={{
              backgroundColor: cardBg,
              border: `1px solid ${cardBorder}`,
              boxShadow: `0 10px 30px ${isLight ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.2)'}, ${cardInset}`,
            }}
            className="rounded-2xl p-8 backdrop-blur-2xl admin-lift"
            data-spotlight
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
