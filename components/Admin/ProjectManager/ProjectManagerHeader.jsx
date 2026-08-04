'use client';

import { FiPlus, FiGrid, FiList } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';

export default function ProjectManagerHeader({ onAddProject, selectedCount, onBulkDelete }) {
  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[var(--admin-title)]">Asset Showcase</h2>
        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
          Node Showcase v4.2 — Unified Asset Management
        </p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {selectedCount > 0 && (
          <Button
            variant="destructive"
            onClick={onBulkDelete}
            className="flex items-center gap-2 h-10 sm:h-12 px-3 sm:px-4 text-xs sm:text-sm rounded-lg sm:rounded-xl"
          >
            <svg className="sm:!size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            <span className="hidden sm:inline">Delete {selectedCount}</span>
            <span className="sm:hidden">Delete</span>
          </Button>
        )}
        <Button
          variant="outline"
          onClick={onAddProject}
          className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 h-10 sm:h-12 rounded-lg sm:rounded-xl border-indigo-500/20 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all group text-xs sm:text-sm"
        >
          <svg className="group-hover:rotate-90 transition-transform duration-300" size={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]">New Mission</span>
        </Button>
      </div>
    </div>
  );
}