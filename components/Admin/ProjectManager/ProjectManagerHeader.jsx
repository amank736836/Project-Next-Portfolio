'use client';

import { FiPlus, FiGrid, FiList } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';

export default function ProjectManagerHeader({ onAddProject, selectedCount, onBulkDelete }) {
  return (
    <div className="showcase-page-header flex-1 flex flex-col px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8 sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-5">
      <div className="min-w-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[var(--admin-title)]">Asset Showcase</h2>
        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
          Node Showcase v4.2 — Unified Asset Management
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3 flex-wrap">
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
          onClick={onAddProject}
          className="flex items-center gap-2 sm:gap-3 px-5 sm:px-7 h-11 sm:h-12 rounded-lg sm:rounded-xl !bg-[var(--admin-accent)] hover:brightness-110 !text-white transition-all group text-xs sm:text-sm shadow-[0_0_20px_rgba(var(--admin-accent-rgb),0.4)] border-none"
        >
          <FiPlus className="group-hover:rotate-90 transition-transform duration-300" size={18} />
          <span className="whitespace-nowrap font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]">New Mission</span>
        </Button>
      </div>
    </div>
  );
}
