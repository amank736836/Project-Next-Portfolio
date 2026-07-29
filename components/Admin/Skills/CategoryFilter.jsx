'use client';

import { FiChevronDown } from 'react-icons/fi';

export default function CategoryFilter({ categories, currentCategory, onSelect, isOpen, onToggle }) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-48 bg-[var(--container-color)] border border-white/10 rounded-xl py-2 shadow-2xl z-50 animate-fade-in">
      {['all', ...categories].map(cat => (
        <button
          key={cat}
          onClick={() => { onSelect(cat); onToggle(false); }}
          className={`w-full px-3 py-2 text-left text-sm transition-colors ${currentCategory === cat ? 'bg-[var(--admin-accent)]/20 text-[var(--admin-accent)]' : 'text-slate-300 hover:bg-white/5'}`}
        >
          {cat === 'all' ? 'All Categories' : cat}
        </button>
      ))}
    </div>
  );
}