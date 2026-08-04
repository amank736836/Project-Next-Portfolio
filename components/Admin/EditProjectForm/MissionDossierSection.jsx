'use client';

import { FiFileText } from 'react-icons/fi';

export default function MissionDossierSection({ editingProject, setEditingProject }) {
  return (
    <div className="rounded-xl p-4 border border-slate-500/25 bg-slate-500/[0.04] shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 bg-slate-400 rounded-full shadow-[0_0_12px_rgba(148,163,184,0.5)]" />
        <div className="min-w-0">
          <h4 className="text-sm sm:text-base md:text-lg font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[var(--admin-title)]">Mission Dossier</h4>
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider sm:tracking-widest mt-0.5">Deep Intelligence & Context</p>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[11px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-500 px-1">Strategic Overview</label>
        <textarea
          rows={4}
          value={editingProject.description || ''}
          onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-medium text-[var(--admin-text)] focus:border-indigo-500 outline-none transition-all resize-none shadow-inner"
          placeholder="Provide a detailed breakdown of this project's objectives..."
        />
      </div>
    </div>
  );
}