'use client';

import React from 'react';
import { FiEdit3, FiTrash2, FiSearch } from 'react-icons/fi';
import { calculateAge } from '@/lib/utils';
import DOMPurify from 'isomorphic-dompurify';

const sanitize = (html) => DOMPurify.sanitize(html ?? '', { ALLOWED_TAGS: ['span', 'b', 'i', 'em', 'strong', 'br'], ALLOWED_ATTR: ['class'] });

export const IdentityCard = React.memo(({ item, index, onEdit, onDelete }) => {
  return (
    <div
      className="admin-card identity-card group !p-6 overflow-hidden border-white/[0.05] hover:border-indigo-500/30 bg-white/[0.02] hover:bg-white/[0.06] transition-all duration-500 !rounded-[1.5rem]"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest" dangerouslySetInnerHTML={{ __html: sanitize(item.label) }} />
          <div className="h-1 w-8 bg-indigo-500/30 rounded-full group-hover:w-full transition-all duration-700" />
        </div>
        <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
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
        dangerouslySetInnerHTML={{ __html: sanitize(item.id === 'age' && item.value.includes('/') ? calculateAge(item.value) + ' Years' : item.value) }} 
      />
      <p className="text-[9px] text-slate-600 font-medium uppercase tracking-tighter">
        Synchronized: {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'Secure'}
      </p>
    </div>
  );
});

export const IdentityEmptySearch = React.memo(({ query, onClear }) => (
  <div className="admin-card mb-12 !p-8 bg-white/[0.02] text-center !rounded-[1.5rem]">
    <div className="w-16 h-16 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center mx-auto mb-6">
      <FiSearch className="text-slate-600" size={32} />
    </div>
    <p className="text-slate-400 text-lg font-medium">No results for &quot;{query}&quot;</p>
    <button onClick={onClear} className="mt-4 text-indigo-400 font-bold text-xs uppercase tracking-widest hover:text-indigo-300">Clear Search</button>
  </div>
));

IdentityCard.displayName = 'IdentityCard';
IdentityEmptySearch.displayName = 'IdentityEmptySearch';
