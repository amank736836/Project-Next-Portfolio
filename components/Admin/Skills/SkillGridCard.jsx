'use client';

import { FiStar, FiEdit, FiTrash as FiTrashIcon, FiEye, FiEyeOff } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';

export default function SkillGridCard({ skill, index, onToggleFeatured, onToggleVisibility, isHidden, onEdit, onDelete, featuredCount }) {
  const delayClass = `delay-${(index % 6) + 1}`;
  const isFeatured = skill.is_featured;
  const featuredCapReached = !isFeatured && featuredCount >= 5;

  return (
    <div
      className={`reveal-scale ${delayClass} group relative bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 transition-all hover:border-[var(--admin-accent)]/40 hover:bg-white/[0.075] hover:shadow-[0_0_20px_rgba(var(--admin-accent-rgb),0.07)] ${isFeatured ? 'ring-1 ring-amber-400/30' : ''} ${isHidden ? 'opacity-50' : ''} flex flex-col`}
    >
      {/* Top section: icon + title/badges */}
      <div className="flex items-start gap-4 mb-5">

        {/* Clickable icon — opens edit modal */}
        <button
          onClick={onEdit}
          className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--admin-accent)]/20 to-transparent flex items-center justify-center text-2xl cursor-pointer transition-all hover:from-[var(--admin-accent)]/40 hover:ring-2 hover:ring-[var(--admin-accent)]/50 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]"
          title={`Edit ${skill.title}`}
          aria-label={`Edit ${skill.title}`}
        >
          {skill.icon || '⭐'}
        </button>

        <div className="flex-1 min-w-0 pt-1">
          <h3
            className="font-bold text-sm text-[var(--admin-title)] truncate cursor-pointer hover:text-[var(--admin-accent)] transition-colors leading-snug"
            onClick={onEdit}
            title={`Edit ${skill.title}`}
          >
            {skill.title}
          </h3>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {skill.category}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[var(--admin-accent)]/20 text-[var(--admin-accent)] border border-[var(--admin-accent)]/30">
              {skill.percentage || 85}%
            </span>
            {isFeatured && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400/20 text-amber-400 border border-amber-400/30">
                <FiStar size={8} />
                Hero
              </span>
            )}
            {isHidden && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30">
                <FiEyeOff size={8} />
                Hidden
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Metadata row */}
      <div className="flex items-center gap-3 text-[10px] text-slate-600 group-hover:text-slate-500 transition-colors mb-4">
        <span className="font-mono">#{skill.id}</span>
        <span className="text-slate-700">·</span>
        <span className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full border border-black/20 flex-shrink-0"
            style={{ backgroundColor: skill.color }}
          />
        </span>
      </div>

      {/* Proficiency bar */}
      <div className="mb-5">
        <div className="w-full h-[4px] bg-white/5 rounded-full overflow-hidden relative">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${skill.percentage || 85}%`,
              backgroundColor: skill.color || 'var(--admin-accent)',
              boxShadow: `0 0 10px ${skill.color || 'var(--admin-accent)'}50`,
            }}
          />
        </div>
      </div>

      {/* Additional metadata row */}
      <div className="flex items-center gap-2.5 text-[10px] text-slate-500 mb-4">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/50 animate-pulse" />
          Proficiency
        </span>
        <span className="text-slate-700">·</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400/50" />
          {skill.category}
        </span>
      </div>

      {/* Actions — always visible but compact; appear more prominently on hover */}
      <div className="flex items-center justify-between gap-1.5 mt-auto pt-3 border-t border-white/5">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleVisibility}
            className={`w-7 h-7 transition-all ${
              isHidden
                ? 'text-slate-500 border-slate-500/30 bg-slate-500/10 hover:bg-slate-500 hover:text-white'
                : 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5 hover:bg-emerald-500 hover:text-white'
            }`}
            title={isHidden ? 'Make visible' : 'Hide from public'}
          >
            {isHidden ? <FiEyeOff size={12} /> : <FiEye size={12} />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={featuredCapReached ? undefined : onToggleFeatured}
            disabled={featuredCapReached}
            className={`w-7 h-7 transition-all ${
              isFeatured
                ? 'text-amber-400 border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/20'
                : featuredCapReached
                ? 'text-slate-700 border-slate-700/20 cursor-not-allowed opacity-40'
                : 'text-slate-500 border-white/10 hover:text-amber-400 hover:border-amber-400/30'
            }`}
            title={
              isFeatured
                ? 'Remove from hero badges'
                : featuredCapReached
                ? 'Hero badges full (5/5)'
                : 'Add to hero badges'
            }
          >
            <FiStar size={12} fill={isFeatured ? 'currentColor' : 'none'} />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={onEdit}
            className="w-7 h-7 text-slate-500 hover:text-[var(--first-color)] hover:border-[var(--first-color)]/30 transition-all"
            title="Edit skill"
          >
            <FiEdit size={12} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onDelete}
            className="w-7 h-7 text-slate-500 hover:text-destructive hover:border-destructive/30 transition-all"
            title="Delete skill"
          >
            <FiTrashIcon size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
}
