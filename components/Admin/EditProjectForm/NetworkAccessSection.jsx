'use client';

import { FiGithub, FiExternalLink } from 'react-icons/fi';
import { Input } from '@/components/ui/Input';

export default function NetworkAccessSection({ editingProject, setEditingProject }) {
  const getDetail = (title) => {
    const details = editingProject.details || [];
    const detail = details.find(d => d.title?.includes(title));
    return detail?.desc || '';
  };

  const updateDetail = (title, value) => {
    const details = [...(editingProject.details || [])];
    const index = details.findIndex(d => d.title?.includes(title));
    if (index >= 0) {
      details[index] = { ...details[index], desc: value };
    } else {
      details.push({ icon: title.includes('Github') ? 'FiGithub' : 'FiExternalLink', title: `${title} : `, desc: value });
    }
    setEditingProject({ ...editingProject, details });
  };

  return (
    <div className="rounded-xl p-4 border border-emerald-500/25 bg-emerald-500/[0.04] shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
        <div className="min-w-0">
          <h4 className="text-sm sm:text-base md:text-lg font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[var(--admin-title)]">Network & Access</h4>
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider sm:tracking-widest mt-0.5">Deployment Endpoints & Source</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 px-1">GitHub Repository</label>
          <div className="flex items-center gap-2">
            <a
              href={getDetail('Github')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { if (!getDetail('Github')) e.preventDefault(); }}
              className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.305-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-.914 3.3-.322 3.3-.322.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 11.797 24 7.297 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <input
              type="text"
              value={(() => {
                const details = editingProject?.details || [];
                const detail = details.find(d => d.title?.includes('Github'));
                return detail?.desc || '';
              })()}
              onChange={(e) => {
                const details = [...(editingProject.details || [])];
                const index = details.findIndex(d => d.title?.includes('Github'));
                if (index >= 0) {
                  details[index] = { ...details[index], desc: e.target.value };
                } else {
                  details.push({ icon: 'FiGithub', title: 'Github : ', desc: e.target.value });
                }
                setEditingProject({ ...editingProject, details });
              }}
              placeholder="https://github.com/..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 h-11 font-bold text-[var(--admin-title)] text-sm min-w-0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 px-1">Production Preview</label>
          <div className="flex items-center gap-2">
            <a
              href={getDetail('Preview')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { if (!getDetail('Preview')) e.preventDefault(); }}
              className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
            <input
              type="text"
              value={getDetail('Preview')}
              onChange={(e) => {
                const details = [...(editingProject.details || [])];
                const index = details.findIndex(d => d.title?.includes('Preview'));
                if (index >= 0) {
                  details[index] = { ...details[index], desc: e.target.value };
                } else {
                  details.push({ icon: 'FiExternalLink', title: 'Preview : ', desc: e.target.value });
                }
                setEditingProject({ ...editingProject, details });
              }}
              placeholder="https://..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 h-11 font-bold text-[var(--admin-title)] text-sm min-w-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}