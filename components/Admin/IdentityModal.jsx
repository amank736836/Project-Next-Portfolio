'use client';

import { FiZap, FiRefreshCw, FiCloudLightning } from 'react-icons/fi';

export default function IdentityModal({ item, onClose, onSave, saving, setItem }) {
  if (!item) return null;

  const isNew = item.isNew === true;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#030712]/80 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="admin-card identity-card holographic-card w-full max-w-lg relative z-10 !p-0 overflow-hidden !rounded-[2rem] border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Modal Header */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-transparent p-8 border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FiZap size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--admin-title)] tracking-tight">
                {isNew ? 'New Identity Node' : 'Modify Identity Node'}
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                {isNew ? 'Define label & value' : `Field: ${item.label}`}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-8 space-y-5">

          {/* Label field — only for new items */}
          {isNew && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                Label / Field Name <span className="text-rose-400">*</span>
              </label>
              <input
                autoFocus
                type="text"
                value={item.label}
                onChange={(e) => setItem({ ...item, label: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                placeholder="e.g. Location, Experience..."
              />
            </div>
          )}

          {/* Value field */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">
              Value
              {item.id === 'age' && (
                <span className="text-indigo-400 normal-case ml-2">(Enter DOB as DD/MM/YYYY for dynamic age)</span>
              )}
            </label>
            {item.id === 'about_description' || item.id === 'address' ? (
              <textarea
                autoFocus={!isNew}
                rows={item.id === 'about_description' ? 6 : 3}
                value={item.value}
                onChange={(e) => setItem({ ...item, value: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
              />
            ) : (
              <input
                autoFocus={!isNew}
                type="text"
                value={item.value}
                onChange={(e) => setItem({ ...item, value: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && !isNew && onSave(item.id, item.value, item.label)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                placeholder="Enter value..."
              />
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-xs font-bold text-slate-500 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(item.id, item.value, item.label)}
              disabled={saving || (isNew && !item.label?.trim())}
              className="px-8 py-3 rounded-xl bg-[var(--admin-accent)] text-white text-xs font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-[0_4px_15px_var(--admin-accent-glow)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? <FiRefreshCw className="animate-spin" size={14} /> : <FiCloudLightning size={14} />}
              {saving ? 'Saving...' : (isNew ? 'Create Node' : 'Save Changes')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
