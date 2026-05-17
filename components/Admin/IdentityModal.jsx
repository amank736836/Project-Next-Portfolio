'use client';

import { FiZap, FiRefreshCw, FiCloudLightning } from 'react-icons/fi';

export default function IdentityModal({ item, onClose, onSave, saving, setItem }) {
  if (!item) return null;

  const isNew = item.isNew === true;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#030712]/75 backdrop-blur-[10px]"
        onClick={onClose}
      />
      
      {/* Centering Container */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="matrix-modal w-full max-w-lg relative z-10 p-0 overflow-hidden border border-[var(--admin-border)] shadow-[0_0_50px_rgba(0,0,0,0.4)] animate-slide-up my-8">
        {/* Modal Header */}
        <div className="matrix-modal-header p-8 border-b border-[var(--admin-border-strong)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--admin-accent-glow)] flex items-center justify-center text-[var(--admin-accent)]">
              <FiZap size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--admin-title)] tracking-tight">
                {isNew ? 'New Identity Node' : 'Modify Identity Node'}
              </h3>
              <p className="text-[10px] text-[var(--admin-text)]/70 font-bold uppercase tracking-widest mt-0.5">
                {isNew ? 'Define label & value' : `Field: ${item.label}`}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="matrix-modal-body p-8 space-y-6">

          {/* Label field — only for new items */}
          {isNew && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--admin-text)]/80 uppercase tracking-widest pl-1">
                Label / Field Name <span className="text-rose-400">*</span>
              </label>
              <input
                autoFocus
                type="text"
                value={item.label}
                onChange={(e) => setItem({ ...item, label: e.target.value })}
                className="w-full premium-input rounded-2xl px-6 py-4 font-bold text-sm"
                placeholder="e.g. Location, Experience..."
              />
            </div>
          )}

          {/* Value field */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[var(--admin-text)]/80 uppercase tracking-widest pl-1">
              Value
              {item.id === 'age' && (
                <span className="text-[var(--admin-accent)] normal-case ml-2">(Enter DOB as DD/MM/YYYY for dynamic age)</span>
              )}
            </label>
            {item.id === 'about_description' || item.id === 'address' ? (
              <textarea
                autoFocus={!isNew}
                rows={item.id === 'about_description' ? 6 : 3}
                value={item.value}
                onChange={(e) => setItem({ ...item, value: e.target.value })}
                className="w-full premium-input rounded-2xl px-6 py-4 font-bold text-sm resize-none"
              />
            ) : (
              <input
                autoFocus={!isNew}
                type="text"
                value={item.value}
                onChange={(e) => setItem({ ...item, value: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && !isNew && onSave(item.id, item.value, item.label)}
                className="w-full premium-input rounded-2xl px-6 py-4 font-bold text-sm"
                placeholder="Enter value..."
              />
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="matrix-modal-footer flex items-center justify-end gap-3 px-8 pb-8 pt-6 border-t border-[var(--admin-border-strong)] bg-[var(--admin-card)]/50">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-xs font-bold text-[var(--admin-text)] hover:text-[var(--admin-title)] hover:bg-[var(--admin-border-strong)]/20 transition-all uppercase tracking-wider"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(item.id, item.value, item.label)}
            disabled={saving || (isNew && !item.label?.trim())}
            className="px-8 py-3 rounded-xl bg-[var(--admin-accent)] text-white text-xs font-bold flex items-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_15px_var(--admin-accent-glow)] disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider"
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
