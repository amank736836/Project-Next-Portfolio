'use client';

import { FiStar, FiEdit, FiTrash as FiTrashIcon, FiEye, FiEyeOff } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';

export default function SkillCard({ skill, index, onToggleFeatured, onToggleVisibility, isHidden, onEdit, onDelete, featuredCount }) {
  const delayClass = `delay-${(index % 6) + 1}`;
  const isFeatured = skill.is_featured;
  const featuredCapReached = !isFeatured && featuredCount >= 5;
  const percentage = skill.percentage || 85;

  return (
    <div
      className={`reveal-scale ${delayClass} group bg-white/5 border border-white/10 rounded-xl transition-all hover:border-[var(--admin-accent)]/30 hover:bg-white/[0.075] hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] ${isFeatured ? 'ring-1 ring-amber-400/30' : ''} ${isHidden ? 'opacity-50' : ''}`}
    >
      {/* Single flex row — never wraps */}
      <div className="flex items-center min-h-[72px] gap-4 p-4">
        
        {/* Clickable icon - left aligned */}
        <button
          onClick={onEdit}
          className="flex-shrink-0 w-14 h-14 flex items-center justify-center text-2xl bg-gradient-to-br from-[var(--admin-accent)]/15 to-transparent rounded-xl cursor-pointer transition-all hover:from-[var(--admin-accent)]/35 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--admin-accent)]"
          title={`Edit ${skill.title}`}
          aria-label={`Edit ${skill.title}`}
        >
          {skill.icon || '⭐'}
        </button>

        {/* Middle: title + badges + proficiency bar — takes all remaining space */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-3 px-3">

          {/* Title + badges row */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3
              className="font-bold text-base text-[var(--admin-title)] cursor-pointer hover:text-[var(--admin-accent)] transition-colors whitespace-nowrap flex-shrink-0"
              onClick={onEdit}
            >
              {skill.title}
            </h3>
            
            {/* Proficiency badge inline with title */}
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[var(--admin-accent)]/20 text-[var(--admin-accent)] border border-[var(--admin-accent)]/30 whitespace-nowrap flex-shrink-0">
              {percentage}%
            </span>
            
            <span className="px-2.5 py-1 rounded-full text-[9px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 whitespace-nowrap flex-shrink-0">
              {skill.category}
            </span>
            
            {isFeatured && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold bg-amber-400/20 text-amber-400 border border-amber-400/30 whitespace-nowrap flex-shrink-0">
                <FiStar size={10} />
                Hero
              </span>
            )}
            {isHidden && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30 whitespace-nowrap flex-shrink-0">
                <FiEyeOff size={10} />
                Hidden
              </span>
            )}
          </div>

          {/* Proficiency bar - Thicker with percentage label */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-[8px] bg-white/5 rounded-full overflow-hidden relative min-w-0">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: skill.color || 'var(--admin-accent)',
                  boxShadow: `0 0 16px ${skill.color || 'var(--admin-accent)'}80`,
                }}
              />
            </div>
            <span className="font-mono text-sm font-bold text-[var(--admin-title)] flex-shrink-0 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full border border-black/20 flex-shrink-0 animate-pulse" style={{ backgroundColor: skill.color }} />
              #{skill.id}
              <span className="text-[var(--admin-accent)] font-bold">{percentage}%</span>
            </span>
          </div>

        </div>

        {/* Actions — right edge, hover reveal for edit/delete */}
        <div className="flex items-center gap-1 pr-2 pl-1 flex-shrink-0 border-l border-white/5 bg-white/5 rounded-r-xl group-actions">
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleVisibility}
            className={`w-9 h-9 transition-all ${
              isHidden
                ? 'text-slate-500 border-slate-500/30 bg-slate-500/10 hover:bg-slate-500 hover:text-white'
                : 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5 hover:bg-emerald-500 hover:text-white'
            }`}
            title={isHidden ? 'Make visible' : 'Hide from public'}
          >
            {isHidden ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={featuredCapReached ? undefined : onToggleFeatured}
            disabled={featuredCapReached}
            className={`w-9 h-9 transition-all ${
              isFeatured
                ? 'text-amber-400 border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/20'
                : featuredCapReached
                ? 'text-slate-700 border-slate-700/20 cursor-not-allowed opacity-40'
                : 'text-slate-500 border-white/10 hover:text-amber-400 hover:border-amber-400/30'
            }`}
            title={isFeatured ? 'Remove from hero badges' : featuredCapReached ? 'Hero badges full (5/5)' : 'Add to hero badges'}
          >
            <FiStar size={16} fill={isFeatured ? 'currentColor' : 'none'} />
          </Button>

          {/* Edit/Delete - only visible on hover */}
          <div className="actions-hidden opacity-0 group-hover/actions-hidden:opacity-100 transition-opacity duration-200 flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={onEdit}
              className="w-9 h-9 text-slate-500 hover:text-[var(--first-color)] hover:border-[var(--first-color)]/30 transition-all"
              title="Edit skill"
            >
              <FiEdit size={16} />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={onDelete}
              className="w-9 h-9 text-slate-500 hover:text-destructive hover:border-destructive/30 transition-all"
              title="Delete skill"
            >
              <FiTrashIcon size={16} />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}