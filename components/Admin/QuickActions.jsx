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
import { Button } from '@/components/ui/Button';

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

      <div className="grid gap-6">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant="outline"
            onClick={() => handleAction(action)}
            className="flex h-16 w-full items-center justify-start gap-6 text-left"
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
          </Button>
        ))}
      </div>

    </div>
  );
}