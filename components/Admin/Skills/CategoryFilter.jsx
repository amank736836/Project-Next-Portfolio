'use client';

import { useEffect, useRef } from 'react';
import { FiChevronDown, FiCode, FiServer, FiDatabase, FiCpu, FiZap } from 'react-icons/fi';

const categoryIcons = {
  'Frontend': FiCode,
  'Backend': FiServer,
  'Database': FiDatabase,
  'DevOps': FiCpu,
  'Tools': FiZap,
  'General': FiZap,
};

const categoryColors = {
  'Frontend': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  'Backend': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  'Database': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  'DevOps': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  'Tools': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'General': 'text-slate-400 bg-slate-400/10 border-slate-400/20',
};

export default function CategoryFilter({ categories, currentCategory, onSelect, isOpen, onToggle }) {
  const filterRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (e.target.closest('.category-filter-trigger')) return;
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        onToggle(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [isOpen, onToggle]);

  if (!isOpen) return null;

  const allCategories = ['all', ...categories];

  return (
    <div ref={filterRef} className="category-dropdown absolute top-full left-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl py-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 animate-fade-in">
      {allCategories.map(cat => {
        const CategoryIcon = categoryIcons[cat] || FiZap;
        return (
        <button
          key={cat}
          onClick={() => { onSelect(cat); onToggle(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors ${currentCategory === cat ? 'bg-[var(--admin-accent)]/20 text-[var(--admin-accent)]' : 'text-slate-300 hover:bg-white/10'}`}
        >
{cat === 'all' ? (
            <>
              <div className="w-5 h-5 rounded-lg flex items-center justify-center border border-white/10 text-slate-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <span>All Categories</span>
            </>
          ) : (
            <>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${categoryColors[cat] || categoryColors.General}`}>
                {(() => {
                  const Icon = categoryIcons[cat] || FiZap;
                  return <Icon size={16} />;
                })()}
              </div>
              <span>{cat}</span>
            </>
          )}
        </button>
      )})}
    </div>
  );
}