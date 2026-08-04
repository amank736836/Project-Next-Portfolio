'use client';

import { FiX, FiPlus } from 'react-icons/fi';

export default function ModalHeader({ 
  isNew, 
  onClose, 
  modalRef,
  isAddingCategory,
  setIsAddingCategory
}) {
  return (
    <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between relative overflow-hidden flex-shrink-0">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 min-w-0 flex-1">
        <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-indigo-500 mb-1">
          {isNew ? 'New Asset | Node Init' : 'Asset Refactoring | Node #1'}
        </p>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[var(--admin-title)]">
          {isNew ? 'New Project' : 'Edit Project'}
        </h3>
      </div>
      <button
        onClick={onClose}
        className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg sm:rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all group flex-shrink-0 ml-2"
      >
        <svg className="sm:!size-6 group-hover:rotate-90 transition-transform duration-500" size={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}