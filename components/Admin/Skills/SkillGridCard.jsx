'use client';

import { FiStar, FiEdit, FiTrash as FiTrashIcon, FiEye, FiEyeOff } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';

export default function SkillGridCard({ skill, index, onToggleFeatured, onToggleVisibility, isHidden, onEdit, onDelete, categories }) {
  const delayClass = `delay-${(index % 6) + 1}`;
  const isFeatured = skill.is_featured;
  
  return (
    <div className={`reveal-scale ${delayClass} bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 transition-all hover:border-[var(--admin-accent)]/30 hover:bg-white/7.5 ${isFeatured ? 'ring-1 ring-amber-400/30' : ''} ${isHidden ? 'opacity-50' : ''} flex flex-col`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--admin-accent)]/20 to-transparent flex items-center justify-center text-2xl">
          {skill.icon || '⭐'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base text-[var(--admin-title)] truncate">{skill.title}</h3>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {isFeatured && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400/20 text-amber-400 border border-amber-400/30">
                <FiStar size={10} className="text-amber-400" />
                Featured
              </span>
            )}
            {isHidden && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30">
                <FiEyeOff size={10} className="text-slate-400" />
                Hidden
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {skill.category}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[var(--admin-accent)]/20 text-[var(--admin-accent)] border border-[var(--admin-accent)]/30">
              {skill.percentage || 85}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-3 pt-3 border-t border-white/5">
        <span className="font-mono flex-1 truncate">ID: {skill.id}</span>
        <span className="truncate">Icon: {skill.icon}</span>
        <span className="flex items-center gap-1">Color: <span className="w-2.5 h-2.5 rounded border" style={{backgroundColor: skill.color}}></span></span>
      </div>

      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-white/5">
        <Button
          variant={isHidden ? 'outline' : 'outline'}
          size="icon"
          onClick={onToggleVisibility}
          className={isHidden 
            ? 'text-slate-500 border-slate-500/30 bg-slate-500/10 hover:bg-slate-500 hover:text-white flex-1' 
            : 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10 hover:bg-emerald-500 hover:text-white flex-1'
          }
          title={isHidden ? 'Make visible' : 'Hide from public'}
        >
          {isHidden ? <FiEyeOff size={14} /> : <FiEye size={14} />}
        </Button>
        <Button
          variant={isFeatured ? 'secondary' : 'outline'}
          size="icon"
          onClick={onToggleFeatured}
          className={isFeatured ? 'text-amber-400 border-amber-400/30 bg-amber-400/10 flex-1' : 'text-slate-500 hover:text-amber-400 flex-1'}
          title={isFeatured ? 'Remove from hero badges' : 'Add to hero badges'}
        >
          <FiStar size={14} fill={isFeatured ? 'currentColor' : 'none'} />
        </Button>
        <Button variant="outline" size="icon" onClick={onEdit} className="text-slate-500 hover:text-[var(--first-color)] flex-1" title="Edit skill">
          <FiEdit size={14} />
        </Button>
        <Button variant="outline" size="icon" onClick={onDelete} className="text-slate-500 hover:text-destructive flex-1" title="Delete skill">
          <FiTrashIcon size={14} />
        </Button>
      </div>
    </div>
  );
}