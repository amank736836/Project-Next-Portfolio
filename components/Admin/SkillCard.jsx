'use client';

import React from 'react';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';

export const SkillCard = React.memo(({ skill, index, onEdit, onDelete }) => {
  return (
    <div
      className="matrix-skill-card group admin-card p-6 hover:border-indigo-500/40 bg-background/50 hover:bg-background/10 transition-all duration-500 animate-fade-in"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[var(--admin-accent)]/10 border border-[var(--admin-accent)]/20 flex items-center justify-center text-[var(--admin-accent)] font-bold text-xs shadow-inner">
            {index + 1}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-[var(--admin-title)] tracking-tight group-hover:text-[var(--admin-accent)] transition-colors">
              {skill.title}
            </h4>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">
              {skill.category || 'Capability'}
            </p>
          </div>
        </div>

        <div className="matrix-skill-actions flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(skill)}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/5 text-indigo-400 border-none hover:bg-indigo-500/10 transition-all"
            title="Edit"
          >
            <FiEdit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(skill.id)}
            className="w-11 h-11 rounded-xl flex items-center justify-center bg-rose-500/5 text-rose-400 border-none hover:bg-rose-500/10 transition-all shadow-lg hover:shadow-rose-500/10"
            title="Delete"
          >
            <FiTrash2 size={20} />
          </button>
        </div>
      </div>

      {/* Subtle Progress Indicator */}
      <div className="matrix-skill-footer mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
         <div className="flex gap-1">
            {[1,2,3].map(i => (
              <div key={i} className={`h-1 w-4 rounded-full ${i <= 2 ? 'bg-indigo-500/40' : 'background/50'}`} />
            ))}
         </div>
         <span className="text-xs text-slate-600 font-medium uppercase tracking-tighter">
           Modified: {skill.updated_at ? new Date(skill.updated_at).toLocaleDateString() : 'Just Now'}
         </span>
      </div>
    </div>
  );
});

SkillCard.displayName = 'SkillCard';
