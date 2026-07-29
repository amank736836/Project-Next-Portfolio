export const STATS = [
  { label: 'Projects', icon: 'FiLayers', color: 'indigo', desc: 'Total Nodes Active' },
  { label: 'Matrix', icon: 'FiTrendingUp', color: 'emerald', desc: 'Identified Skills' },
  { label: 'Logs', icon: 'FiMessageSquare', color: 'amber', desc: 'Experience Entries' },
  { label: 'Academy', icon: 'FiGlobe', color: 'rose', desc: 'Education Data' },
];

export const OPERATION_LOGS = [
  { action: 'AUTH_GATEWAY', details: 'Admin session established via Secure ID', time: '12s ago', type: 'auth' },
  { action: 'DB_SYNC', details: 'Project matrix synchronization completed', time: '1m ago', type: 'write' },
  { action: 'CACHE_PURGE', details: 'Global edge cache invalidated successfully', time: '5m ago', type: 'system' },
  { action: 'ENTRY_CREATED', details: 'New academy record injected into sector 7', time: '12m ago', type: 'write' },
  { action: 'SEC_AUDIT', details: 'Routine integrity check passed: 0 vulnerabilities', time: '1h ago', type: 'auth' },
];

export const STAT_THEMES = {
  indigo: {
    bg: { light: 'rgba(79, 70, 229, 0.05)', dark: 'rgba(99, 102, 241, 0.06)' },
    text: { light: '#4f46e5', dark: '#818cf8' },
    border: { light: 'rgba(79, 70, 229, 0.12)', dark: 'rgba(99, 102, 241, 0.16)' },
    borderHover: { light: 'rgba(79, 70, 229, 0.38)', dark: 'rgba(99, 102, 241, 0.45)' },
    bullet: { light: '#4f46e5', dark: '#6366f1' },
    badgeBg: { light: 'rgba(79, 70, 229, 0.07)', dark: 'rgba(99, 102, 241, 0.12)' },
    badgeBorder: { light: 'rgba(79, 70, 229, 0.18)', dark: 'rgba(99, 102, 241, 0.25)' },
    glowShadow: { light: '0 10px 30px rgba(79, 70, 229, 0.08)', dark: '0 0 25px rgba(99, 102, 241, 0.18)' },
  },
  emerald: {
    bg: { light: 'rgba(5, 150, 105, 0.05)', dark: 'rgba(16, 185, 129, 0.06)' },
    text: { light: '#059669', dark: '#34d399' },
    border: { light: 'rgba(5, 150, 105, 0.12)', dark: 'rgba(16, 185, 129, 0.16)' },
    borderHover: { light: 'rgba(5, 150, 105, 0.38)', dark: 'rgba(16, 185, 129, 0.45)' },
    bullet: { light: '#059669', dark: '#10b981' },
    badgeBg: { light: 'rgba(5, 150, 105, 0.07)', dark: 'rgba(16, 185, 129, 0.12)' },
    badgeBorder: { light: 'rgba(5, 150, 105, 0.18)', dark: 'rgba(16, 185, 129, 0.25)' },
    glowShadow: { light: '0 10px 30px rgba(5, 150, 105, 0.08)', dark: '0 0 25px rgba(16, 185, 129, 0.18)' },
  },
  amber: {
    bg: { light: 'rgba(217, 119, 6, 0.05)', dark: 'rgba(245, 158, 11, 0.06)' },
    text: { light: '#b45309', dark: '#fbbf24' },
    border: { light: 'rgba(217, 119, 6, 0.12)', dark: 'rgba(245, 158, 11, 0.16)' },
    borderHover: { light: 'rgba(217, 119, 6, 0.38)', dark: 'rgba(245, 158, 11, 0.45)' },
    bullet: { light: '#d97706', dark: '#f59e0b' },
    badgeBg: { light: 'rgba(217, 119, 6, 0.07)', dark: 'rgba(245, 158, 11, 0.12)' },
    badgeBorder: { light: 'rgba(217, 119, 6, 0.18)', dark: 'rgba(245, 158, 11, 0.25)' },
    glowShadow: { light: '0 10px 30px rgba(217, 119, 6, 0.08)', dark: '0 0 25px rgba(245, 158, 11, 0.18)' },
  },
  rose: {
    bg: { light: 'rgba(225, 29, 72, 0.05)', dark: 'rgba(244, 63, 94, 0.06)' },
    text: { light: '#e11d48', dark: '#fb7185' },
    border: { light: 'rgba(225, 29, 72, 0.12)', dark: 'rgba(244, 63, 94, 0.16)' },
    borderHover: { light: 'rgba(225, 29, 72, 0.38)', dark: 'rgba(244, 63, 94, 0.45)' },
    bullet: { light: '#e11d48', dark: '#f43f5e' },
    badgeBg: { light: 'rgba(225, 29, 72, 0.07)', dark: 'rgba(244, 63, 94, 0.12)' },
    badgeBorder: { light: 'rgba(225, 29, 72, 0.18)', dark: 'rgba(244, 63, 94, 0.25)' },
    glowShadow: { light: '0 10px 30px rgba(225, 29, 72, 0.08)', dark: '0 0 25px rgba(244, 63, 94, 0.18)' },
  },
};