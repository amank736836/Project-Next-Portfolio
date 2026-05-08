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
import { Button } from '@/components/ui';

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
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--first-color)]/10 flex items-center justify-center text-[var(--first-color)]">
            <FiCommand size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight">Quick Actions</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Rapid Navigation // Instant Access
            </p>
          </div>
        </div>
        <kbd className="kbd hidden sm:inline-flex">Ctrl+K</kbd>
      </div>

      <div className="grid gap-4">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant="outline"
            onClick={() => handleAction(action)}
            className={`flex h-12 w-full items-center justify-start gap-3 text-left ${className}`}
          >
            <div className="flex-shrink-0">
              {action.icon}
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold">{action.label}</span>
              {action.shortcut && (
                <span className="text-xs font-mono text-slate-600 ml-2">{action.shortcut}</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Recent Activity Preview */}
      <div className="mt-6 pt-6 border-t border-t">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Recent Activity
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Live
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500">14:32</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400/20" />
                <span className="text-xs text-slate-300">Project updated</span>
              </div>
            </div>
            <span className="text-xs text-slate-400">Frame and Phrase</span>
          </div>
          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500">13:15</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/20" />
                <span className="text-xs text-slate-300">Skill added</span>
              </div>
            </div>
            <span className="text-xs text-slate-400">TypeScript</span>
          </div>
          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500">11:48</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/20" />
                <span className="text-xs text-slate-300">Identity synced</span>
              </div>
            </div>
            <span className="text-xs text-slate-400">Profile data</span>
          </div>
        </div>
      </div>
    </div>
  );
}