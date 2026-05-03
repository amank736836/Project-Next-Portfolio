'use client';

import { useRouter } from 'next/navigation';
import { 
  FiGrid, 
  FiUser, 
  FiCode, 
  FiBook, 
  FiBriefcase, 
  FiPlus,
  FiSettings,
  FiExternalLink,
  FiCommand
} from 'react-icons/fi';

const actions = [
  { 
    id: 'showcase', 
    label: 'New Project', 
    icon: <FiGrid size={20} />, 
    route: '/admin/showcase',
    shortcut: 'Ctrl+2'
  },
  { 
    id: 'identity', 
    label: 'Edit Profile', 
    icon: <FiUser size={20} />, 
    route: '/admin/identity',
    shortcut: 'Ctrl+3'
  },
  { 
    id: 'matrix', 
    label: 'Add Skill', 
    icon: <FiCode size={20} />, 
    route: '/admin/matrix',
    shortcut: 'Ctrl+4'
  },
  { 
    id: 'academy', 
    label: 'Education', 
    icon: <FiBook size={20} />, 
    route: '/admin/academy',
    shortcut: 'Ctrl+5'
  },
  { 
    id: 'logbook', 
    label: 'Experience', 
    icon: <FiBriefcase size={20} />, 
    route: '/admin/logbook',
    shortcut: 'Ctrl+6'
  },
  { 
    id: 'portfolio', 
    label: 'View Site', 
    icon: <FiExternalLink size={20} />, 
    route: '/portfolio',
    external: true
  },
];

export default function QuickActions({ className = '' }) {
  const router = useRouter();

  const handleAction = (action) => {
    if (action.external) {
      window.open(action.route, '_blank');
    } else {
      router.push(action.route);
    }
  };

  return (
    <div className={`admin-card ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--first-color)]/10 flex items-center justify-center text-[var(--first-color)]">
            <FiCommand size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight">Quick Actions</h3>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              Rapid Navigation // Instant Access
            </p>
          </div>
        </div>
        <kbd className="kbd hidden sm:inline-flex">Ctrl+K</kbd>
      </div>

      <div className="quick-actions-grid">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action)}
            className="quick-action-item group"
          >
            <div className="quick-action-icon">
              {action.icon}
            </div>
            <span className="quick-action-label">{action.label}</span>
            {action.shortcut && (
              <span className="text-[8px] font-mono text-slate-600 group-hover:text-[var(--first-color)]/60 transition-colors">
                {action.shortcut}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Recent Activity Preview */}
      <div className="mt-6 pt-6 border-t border-white/5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Recent Activity
          </span>
          <span className="badge badge-success">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>
        <div className="space-y-2">
          <ActivityItem 
            time="14:32" 
            action="Project updated" 
            target="Frame and Phrase"
            type="update"
          />
          <ActivityItem 
            time="13:15" 
            action="Skill added" 
            target="TypeScript"
            type="create"
          />
          <ActivityItem 
            time="11:48" 
            action="Identity synced" 
            target="Profile data"
            type="sync"
          />
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ time, action, target, type }) {
  const typeColors = {
    update: 'text-amber-400 bg-amber-400/10',
    create: 'text-emerald-400 bg-emerald-400/10',
    sync: 'text-indigo-400 bg-indigo-400/10',
    delete: 'text-rose-400 bg-rose-400/10',
  };

  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-pointer">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-slate-500">{time}</span>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${typeColors[type].split(' ')[0]}`} />
          <span className="text-xs text-slate-300">{action}</span>
        </div>
      </div>
      <span className="text-[10px] font-medium text-slate-400 group-hover:text-[var(--first-color)] transition-colors truncate max-w-[120px]">
        {target}
      </span>
    </div>
  );
}
