'use client';

import { FiCode, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';

export function EmptySkills({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        <FiCode size={40} className="text-slate-500" />
      </div>
      <h3 className="text-xl font-bold text-[var(--admin-title)] mb-2">No Skills Configured</h3>
      <p className="text-slate-500 mb-6 max-w-sm">Add your first skill to start building your skill matrix.</p>
      <Button onClick={onAdd} className="w-full sm:w-auto">
        <FiPlus className="mr-2" size={18} />
        Add First Skill
      </Button>
    </div>
  );
}

export function EmptySearchSkill({ searchTerm, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <FiSearch size={48} className="text-slate-500 mb-4" />
      <h3 className="text-xl font-bold text-[var(--admin-title)] mb-2">No Skills Found</h3>
      <p className="text-slate-500 mb-4">
        No skills match <span className="font-mono text-[var(--admin-accent)]">&ldquo;{searchTerm}&rdquo;</span>
      </p>
      <Button variant="outline" onClick={onClear}>
        <FiX className="mr-2" size={16} />
        Clear Filters
      </Button>
    </div>
  );
}