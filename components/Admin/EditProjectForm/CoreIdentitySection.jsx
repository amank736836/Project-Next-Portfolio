'use client';

import { FiEye, FiEyeOff, FiX, FiChevronDown, FiRefreshCw, FiCloudLightning, FiGithub, FiExternalLink, FiGrid, FiCode } from 'react-icons/fi';
import { useSuccessToast, useErrorToast } from '../Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const EyeIcon = ({ hidden }) => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {hidden ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-5.52 0-10-4.48-10-10S6.52 2 12 2a10.07 10.07 0 0 1 5.94 1.94" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

const ToggleIcon = ({ hidden }) => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {hidden ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-5.52 0-10-4.48-10-10S6.52 2 12 2a10.07 10.07 0 0 1 5.94 1.94" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

export default function CoreIdentitySection({ editingProject, setEditingProject, categories, isAddingCategory, setIsAddingCategory }) {
  const isNew = !editingProject?.id;

  return (
    <div className="rounded-xl p-4 border border-indigo-500/25 bg-indigo-500/[0.04] shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 bg-indigo-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.6)]" />
        <div className="min-w-0">
          <h4 className="text-sm sm:text-base md:text-lg font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[var(--admin-title)]">Core Identity</h4>
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider sm:tracking-widest mt-0.5">Fundamental Asset Parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 sm:gap-6">
        <div className="col-span-12 lg:col-span-7 space-y-4">
          {/* Project Title */}
          <div className="space-y-2">
            <label className="text-[11px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-500 flex items-center gap-2">
              Project Title <span className="w-1 h-1 bg-indigo-500 rounded-full" />
            </label>
            <input
              type="text"
              value={editingProject.title || ''}
              onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
              placeholder="Project name..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 pr-10 h-11 text-base font-bold outline-none focus:border-indigo-500 transition-all text-[var(--admin-title)] cursor-pointer appearance-none"
            />
          </div>

          {/* Project Category */}
          <div className="space-y-2">
            <label className="text-[11px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-500 flex items-center gap-2">
              Project Category <span className="w-1 h-1 bg-indigo-500 rounded-full" />
            </label>
            <div className="relative group">
              <select
                value={editingProject.category || ''}
                onChange={(e) => {
                  if (e.target.value === 'new') {
                    setEditingProject({ ...editingProject, category: '' });
                  } else {
                    setEditingProject({ ...editingProject, category: e.target.value });
                  }
                }}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 pr-10 h-11 text-base font-bold outline-none focus:border-indigo-500 transition-all text-[var(--admin-title)] cursor-pointer appearance-none"
              >
                <option value="" disabled>Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="new">+ Add New Category...</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {editingProject.category === '' && (
              <div className="mt-4 p-4 sm:p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-lg sm:rounded-2xl animate-in fade-in slide-in-from-top-4">
                <input
                  type="text"
                  value={editingProject.category || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                  placeholder="Enter new category name..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 h-11 font-bold text-[var(--admin-title)] text-base"
                />
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-4">
          {/* Visibility Status */}
          <div className="space-y-2">
            <label className="text-[11px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-500 px-1">Visibility Status</label>
            <button
              onClick={() => setEditingProject({ ...editingProject, is_hidden: !editingProject.is_hidden })}
              className={`w-full h-11 px-4 rounded-lg border flex items-center justify-between transition-all group ${
                editingProject.is_hidden
                  ? 'bg-rose-500/5 border-rose-500/20 text-rose-400 hover:bg-rose-500/10'
                  : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {editingProject.is_hidden ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-5.52 0-10-4.48-10-10S6.52 2 12 2a10.07 10.07 0 0 1 5.94 1.94" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
                <span className="font-black tracking-[0.08em] sm:tracking-[0.1em] uppercase text-xs sm:text-sm">
                  {editingProject.is_hidden ? 'Private' : 'Visible'}
                </span>
              </div>
              <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_15px_currentColor] ${editingProject.is_hidden ? 'bg-rose-500' : 'bg-emerald-500'}`} />
            </button>
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <label className="text-[11px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-500 px-1">Tech Stack</label>
            <input
              type="text"
              value={(() => {
                const details = editingProject.details || [];
                const detail = details.find(d => d.title?.includes('Language'));
                return detail?.desc || '';
              })()}
              onChange={(e) => {
                const details = [...(editingProject.details || [])];
                const index = details.findIndex(d => d.title?.includes('Language'));
                if (index >= 0) {
                  details[index] = { ...details[index], desc: e.target.value };
                } else {
                  details.push({ icon: 'FiCode', title: 'Language : ', desc: e.target.value });
                }
                setEditingProject({ ...editingProject, details });
              }}
              placeholder="React, Node..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 h-11 font-bold text-[var(--admin-title)] text-base"
            />
          </div>
        </div>
      </div>
    </div>
  );
}