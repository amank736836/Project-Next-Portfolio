'use client';

import { FiStar, FiEdit, FiTrash as FiTrashIcon } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';

export default function SkillCard({ skill, index, onToggleFeatured, onEdit, onDelete, categories }) {
  const delayClass = `delay-${(index % 6) + 1}`;
  const isFeatured = skill.is_featured;
  
  return (
    <div className={`reveal-scale ${delayClass} bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 transition-all hover:border-[var(--admin-accent)]/30 hover:bg-white/7.5 ${isFeatured ? 'ring-1 ring-amber-400/30' : ''}`}>
      <div className="flex items-start gap-4 sm:gap-5">
        <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[var(--admin-accent)]/20 to-transparent flex items-center justify-center text-2xl sm:text-3xl">
          {skill.icon || '⭐'}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <h3 className="font-bold text-base sm:text-lg text-[var(--admin-title)] truncate">{skill.title}</h3>
            {isFeatured && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400/20 text-amber-400 border border-amber-400/30">
                <FiStar size={10} className="text-amber-400" />
                Featured
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-500/20 text-slate-400 border border-white/5">
              {skill.category}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[var(--admin-accent)]/20 text-[var(--admin-accent)] border border-[var(--admin-accent)]/30">
              {skill.percentage || 85}%
            </span>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6 text-[10px] sm:text-xs text-slate-500">
            <span className="font-mono">ID: {skill.id}</span>
            <span>Icon: {skill.icon}</span>
            <span>Color: <span className="w-3 h-3 inline-block rounded border ml-1" style={{backgroundColor: skill.color}}></span></span>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant={isFeatured ? 'secondary' : 'outline'}
            size="icon"
            onClick={onToggleFeatured}
            className={isFeatured ? 'text-amber-400 border-amber-400/30 bg-amber-400/10' : 'text-slate-500 hover:text-amber-400'}
            title={isFeatured ? 'Remove from hero badges' : 'Add to hero badges'}
          >
            <FiStar size={16} fill={isFeatured ? 'currentColor' : 'none'} />
          </Button>
          <Button variant="outline" size="icon" onClick={onEdit} className="text-slate-500 hover:text-[var(--first-color)]" title="Edit skill">
            <FiEdit size={16} />
          </Button>
          <Button variant="outline" size="icon" onClick={onDelete} className="text-slate-500 hover:text-destructive" title="Delete skill">
            <FiTrashIcon size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}