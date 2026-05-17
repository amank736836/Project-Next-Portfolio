'use client';

import React from 'react';
import Image from 'next/image';
import { FiEye, FiEyeOff, FiCheck, FiTrash2, FiEdit3, FiExternalLink } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';

export const ProjectCard = React.memo(({ project, index, isSelected, onToggleSelect, onToggleVisibility, onEdit, onDelete }) => {
  return (
    <div
      className={`group relative overflow-hidden stagger-${(index % 5) + 1} transition-all duration-500 hover:scale-[1.01] rounded-lg sm:rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 ${isSelected ? 'ring-2 ring-[var(--admin-accent)] shadow-[0_0_40px_var(--admin-accent-glow)]' : ''}`}
    >
      {/* Image Section */}
      <div className="relative h-32 sm:h-40 md:h-48 w-full overflow-hidden bg-[var(--admin-bg)]">
        <Image
          src={project.image || project.img || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop'}
          alt={project.title || 'Project image'}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-90" />

        {/* Status Badge */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
            className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl backdrop-blur-xl border transition-all flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs ${project.is_hidden
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}
          >
            {project.is_hidden ? <FiEyeOff size={14} className="sm:!size-4" /> : <FiEye size={14} className="sm:!size-4" />}
            <span className="hidden sm:inline font-bold uppercase tracking-[0.2em]">
              {project.is_hidden ? 'Private' : 'Public'}
            </span>
          </Button>
        </div>

        {/* Selection Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect();
          }}
          className={`absolute top-2 left-2 sm:top-3 sm:left-3 w-5 h-5 sm:w-6 sm:h-6 rounded border flex items-center justify-center transition-all ${
            isSelected
              ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/40'
              : 'bg-black/20 backdrop-blur-md border-white/20 text-white/40 hover:border-white/40'
          }`}
        >
          {isSelected && <FiCheck size={10} className="sm:!size-3" strokeWidth={4} />}
        </button>
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 md:p-6 flex-1 flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
          <span className="px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 uppercase tracking-tight sm:tracking-tighter">
            {project.category || 'Portfolio Item'}
          </span>
          <span className="text-[10px] sm:text-xs text-slate-600 font-medium uppercase tracking-tighter">
            Last: {project.updated_at ? new Date(project.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Now'}
          </span>
        </div>

        <h4 className="text-base sm:text-lg font-bold text-[var(--admin-title)] mb-1 sm:mb-2 tracking-tight group-hover:text-[var(--admin-accent)] transition-colors line-clamp-2">
          {project.title}
        </h4>

        <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-2 group-hover:line-clamp-none leading-relaxed mb-3 sm:mb-4 opacity-70 group-hover:opacity-100 transition-opacity">
          {project.description}
        </p>

        {/* Action Row */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/5 gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="px-3 sm:px-6 py-2 sm:py-2.5 font-black uppercase tracking-wider text-[10px] sm:text-xs hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all rounded-lg sm:rounded-xl flex-1"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-rose-500/5 text-rose-400 border-none !ring-0 !ring-offset-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 hover:bg-rose-500/10 transition-all flex-shrink-0"
          >
            <FiTrash2 size={16} className="sm:!size-4.5" />
          </Button>
        </div>
      </div>
    </div>
  );
});

export const ProjectListItem = React.memo(({ project, index, isSelected, onToggleSelect, onToggleVisibility, onEdit, onDelete }) => {
  return (
    <div
      className={`flex items-center gap-3 sm:gap-4 transition-all duration-300 hover:bg-white/2 p-3 sm:p-4 rounded-lg border border-white/5 hover:border-white/10 ${isSelected ? 'ring-2 ring-indigo-500/50 bg-indigo-500/[0.02]' : ''}`}
    >
      <button
        onClick={onToggleSelect}
        className={`w-5 h-5 sm:w-6 sm:h-6 rounded border flex items-center justify-center transition-all flex-shrink-0 ${
          isSelected
            ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg'
            : 'border-white/10 bg-white/5 hover:border-white/30'
        }`}
      >
        {isSelected && <FiCheck size={10} className="sm:!size-3" strokeWidth={4} />}
      </button>

      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden bg-[var(--admin-bg)] flex-shrink-0 border border-border/50">
        <Image
          src={project.image || project.img || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop'}
          alt={project.title || 'Project thumbnail'}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap">
          <h4 className="text-xs sm:text-sm font-bold text-[var(--admin-title)] truncate group-hover:text-indigo-400 transition-colors">
            {project.title}
          </h4>
          <span className="px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-bold bg-white/5 text-slate-500 border border-white/5 uppercase tracking-tighter flex-shrink-0">
            {project.category}
          </span>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-500 truncate opacity-60 group-hover:opacity-100 transition-opacity">
          {project.description}
        </p>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleVisibility}
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center transition-all border text-xs ${
            project.is_hidden
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}
        >
          {project.is_hidden ? <FiEyeOff size={14} className="sm:!size-4" /> : <FiEye size={14} className="sm:!size-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-indigo-500/10 text-indigo-400 border-none hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
        >
          <FiEdit3 size={14} className="sm:!size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="hover:bg-rose-500 hover:text-white transition-all w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-rose-500/10 text-rose-400 border-none !ring-0 !ring-offset-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 shadow-sm hover:shadow-rose-500/10"
        >
          <FiTrash2 size={14} className="sm:!size-4" />
        </Button>
        <a
          href={project.details?.[3]?.desc?.props?.href || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:bg-indigo-500 hover:text-white transition-all w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-indigo-500/10 text-indigo-400 border-none flex items-center justify-center shadow-sm hover:shadow-indigo-500/10"
        >
          <FiExternalLink size={14} className="sm:!size-4" />
        </a>
      </div>
    </div>
  );
});

ProjectCard.displayName = 'ProjectCard';
ProjectListItem.displayName = 'ProjectListItem';
