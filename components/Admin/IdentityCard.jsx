'use client';

import React from 'react';
import { FiEdit3, FiTrash2, FiSearch, FiEye, FiEyeOff, FiCopy } from 'react-icons/fi';
import { calculateAge } from '@/lib/utils';

const sanitize = (html) => {
  const DOMPurify = require('isomorphic-dompurify');
  return DOMPurify.sanitize(html ?? '', { ALLOWED_TAGS: ['span', 'b', 'i', 'em', 'strong', 'br'], ALLOWED_ATTR: ['class'] });
};

export const IdentityFieldRow = React.memo(({ item, fieldConfig, index, onEdit, onDelete, onToggleVisibility, isHidden }) => {
  const displayValue = item.id === 'age' && item.value.includes('/') 
    ? calculateAge(item.value) + ' Years' 
    : item.value;

  return (
    <div
      className="group flex items-center gap-4 py-3 px-4 rounded-xl bg-white/[0.015] hover:bg-white/[0.03] transition-colors border border-white/[0.02] hover:border-white/5"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-indigo-500/10 text-indigo-400 shrink-0">
        <fieldConfig.icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5" dangerouslySetInnerHTML={{ __html: sanitize(fieldConfig.label) }} />
        <div 
          className={`text-sm font-medium text-[var(--admin-title)] tracking-tight truncate transition-all duration-300 ${item.id === 'about_description' ? 'line-clamp-2 group-hover:line-clamp-none' : ''}`}
          dangerouslySetInnerHTML={{ __html: sanitize(displayValue) }} 
        />
      </div>
      <div className="flex items-center gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onToggleVisibility()}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border shadow-sm ${
            isHidden 
              ? 'bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500 hover:text-white hover:shadow-slate-500/20' 
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white hover:shadow-emerald-500/20'
          }`}
          title={isHidden ? 'Make visible' : 'Hide from public'}
        >
          {isHidden ? <FiEyeOff size={14} /> : <FiEye size={14} />}
        </button>
        <button
          onClick={() => onEdit(item)}
          className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all border border-indigo-500/20 shadow-sm hover:shadow-indigo-500/20"
          title="Edit"
        >
          <FiEdit3 size={14} />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 shadow-sm hover:shadow-rose-500/20"
          title="Delete"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  );
});

export const IdentitySection = React.memo(({ group, items, onEdit, onDelete, onToggleVisibility, index }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="animate-fade-in" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${group.color}`}>
          <group.icon size={20} />
        </div>
        <div>
          <h3 className="text-lg font-black text-[var(--admin-title)] tracking-tight">{group.label}</h3>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{items.length} field{items.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="h-1 w-16 bg-indigo-500/30 rounded-full" />
      </div>
      <div className="admin-card identity-card !p-4 overflow-hidden border-white/[0.05] hover:border-indigo-500/30 bg-white/[0.015] hover:bg-white/[0.03] transition-all duration-500 !rounded-[1.5rem]">
        <div className="space-y-1">
          {items.map((item, itemIdx) => (
            <IdentityFieldRow
              key={item.id}
              item={item}
              fieldConfig={{ id: item.id, label: item.label, icon: group.fields?.find(f => f.id === item.id)?.icon || group.icon }}
              index={itemIdx}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleVisibility={() => onToggleVisibility(item.id, item.is_hidden)}
              isHidden={item.is_hidden}
            />
          ))}
        </div>
        {items.some(item => item.is_hidden) && (
          <div className="mt-3 pt-3 border-t border-white/5">
            <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-slate-500">
              <FiEyeOff size={10} />
              {items.filter(i => i.is_hidden).length} hidden from public
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

export const IdentityCard = React.memo(({ item, index, onEdit, onDelete, onToggleVisibility, isHidden }) => {
  const displayValue = item.id === 'age' && item.value.includes('/') 
    ? calculateAge(item.value) + ' Years' 
    : item.value;

  return (
    <div
      className={`admin-card identity-card group !p-6 overflow-hidden border-white/[0.05] hover:border-indigo-500/30 bg-white/[0.02] hover:bg-white/[0.06] transition-all duration-500 !rounded-[1.5rem] ${isHidden ? 'opacity-50' : ''}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest" dangerouslySetInnerHTML={{ __html: sanitize(item.label) }} />
          <div className="h-1 w-8 bg-indigo-500/30 rounded-full group-hover:w-full transition-all duration-700" />
        </div>
        <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggleVisibility()}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all border shadow-lg ${
              isHidden 
                ? 'bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500 hover:text-white hover:shadow-slate-500/20' 
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white hover:shadow-emerald-500/20'
            }`}
            title={isHidden ? 'Make visible' : 'Hide from public'}
          >
            {isHidden ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
          <button
            onClick={() => onEdit(item)}
            className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all border border-indigo-500/20 shadow-lg hover:shadow-indigo-500/20"
            title="Edit"
          >
            <FiEdit3 size={18} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="w-11 h-11 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 shadow-lg hover:shadow-rose-500/20"
            title="Delete"
          >
            <FiTrash2 size={22} />
          </button>
        </div>
      </div>
      <div 
        className={`text-lg font-bold text-[var(--admin-title)] tracking-tight mb-4 transition-all duration-500 ${item.id === 'about_description' ? 'line-clamp-2 group-hover:line-clamp-none' : ''}`}
        dangerouslySetInnerHTML={{ __html: sanitize(displayValue) }} 
      />
      <p className="text-[9px] text-slate-600 font-medium uppercase tracking-tighter">
        Synchronized: {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'Secure'}
      </p>
      {isHidden && (
        <span className="inline-flex items-center gap-1 mt-3 text-[9px] font-bold uppercase tracking-widest text-slate-500">
          <FiEyeOff size={10} />
          Hidden from public
        </span>
      )}
    </div>
  );
});

export const IdentityEmptySearch = React.memo(({ query, onClear }) => (
  <div className="admin-card mb-12 !p-8 bg-white/[0.02] text-center !rounded-[1.5rem]">
    <div className="w-16 h-16 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center mx-auto mb-6">
      <FiSearch className="text-slate-600" size={32} />
    </div>
    <p className="text-slate-400 text-lg font-medium">No results for &ldquo;{query}&rdquo;</p>
    <button onClick={onClear} className="mt-4 text-indigo-400 font-bold text-xs uppercase tracking-widest hover:text-indigo-300">Clear Search</button>
  </div>
));

IdentityCard.displayName = 'IdentityCard';
IdentitySection.displayName = 'IdentitySection';
IdentityFieldRow.displayName = 'IdentityFieldRow';
IdentityEmptySearch.displayName = 'IdentityEmptySearch';