'use client';

import { FiStar, FiEdit, FiTrash as FiTrashIcon, FiEye, FiEyeOff } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';

export default function SkillCard({ skill, index, onToggleFeatured, onToggleVisibility, isHidden, onEdit, onDelete, featuredCount }) {
  const delayClass = `delay-${(index % 6) + 1}`;
  const isFeatured = skill.is_featured;
  const featuredCapReached = !isFeatured && featuredCount >= 5;

  return (
    <div
      className={`reveal-scale ${delayClass} group bg-white/5 border border-white/10 rounded-xl transition-all hover:border-[var(--admin-accent)]/30 hover:bg-white/[0.075] ${isFeatured ? 'ring-1 ring-amber-400/30' : ''} ${isHidden ? 'opacity-50' : ''}`}
    >
      {/* Single flex row — never wraps */}
      <div className="flex items-stretch min-h-[56px]">

        {/* Clickable icon */}
        <button
          onClick={onEdit}
          className="flex-shrink-0 w-16 self-stretch flex items-center justify-center text-2xl bg-gradient-to-br from-[var(--admin-accent)]/15 to-transparent rounded-l-xl cursor-pointer transition-all hover:from-[var(--admin-accent)]/35 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--admin-accent)] border-r border-white/5"
          title={`Edit ${skill.title}`}
          aria-label={`Edit ${skill.title}`}
        >
          {skill.icon || '⭐'}
        </button>

        {/* Middle: title + bar — takes all remaining space */}
        <div className="flex-1 min-w-0 flex flex-col justify-center px-5 py-4 gap-3">

          {/* Title + badges — overflow hidden, no wrap */}
          <div className="flex items-center gap-3 overflow-hidden">
            <h3
              className="font-bold text-base text-[var(--admin-title)] cursor-pointer hover:text-[var(--admin-accent)] transition-colors whitespace-nowrap"
              onClick={onEdit}
            >
              {skill.title}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 whitespace-nowrap flex-shrink-0">
              {skill.category}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[var(--admin-accent)]/20 text-[var(--admin-accent)] border border-[var(--admin-accent)]/30 whitespace-nowrap flex-shrink-0">
              {skill.percentage || 85}%
            </span>
            {isFeatured && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400/20 text-amber-400 border border-amber-400/30 whitespace-nowrap flex-shrink-0">
                <FiStar size={8} />
                Hero
              </span>
            )}
            {isHidden && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30 whitespace-nowrap flex-shrink-0">
                <FiEyeOff size={8} />
                Hidden
              </span>
            )}
          </div>

          {/* Proficiency bar + id */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-[6px] bg-white/5 rounded-full overflow-hidden relative">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${skill.percentage || 85}%`,
                  backgroundColor: skill.color || 'var(--admin-accent)',
                  boxShadow: `0 0 12px ${skill.color || 'var(--admin-accent)'}60`,
                }}
              />
            </div>
            <span className="font-mono text-xs font-bold text-slate-500 flex-shrink-0 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full border border-black/20 flex-shrink-0 animate-pulse" style={{ backgroundColor: skill.color }} />
              #{skill.id}
            </span>
          </div>

          {/* Additional metadata row */}
          <div className="flex items-center gap-2.5 text-[10px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/50" />
              Proficiency
            </span>
            <span className="text-slate-700">·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400/50" />
              {skill.category}
            </span>
          </div>
        </div>

        {/* Actions — right edge, centered vertically */}
        <div className="flex items-center gap-2 pr-4 pl-2 flex-shrink-0 border-l border-white/5 bg-white/5">
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
            title={isFeatured ? 'Remove from hero badges' : featuredCapReached ? 'Hero badges full (5/5)' : 'Add to hero badges'}
          >
            <FiStar size={12} fill={isFeatured ? 'currentColor' : 'none'} />
          </Button>

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
