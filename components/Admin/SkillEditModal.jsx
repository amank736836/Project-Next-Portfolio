'use client';

import { FiX, FiRefreshCw, FiCloudLightning } from 'react-icons/fi';

export default function SkillEditModal({ 
  skill, 
  onClose, 
  onUpdate, 
  onSave, 
  saving, 
  setSkill,
  modalRef 
}) {
  if (!skill) return null;

  return (
    <div className="fixed inset-0 z-[999] overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-[10px] animate-fade-in" onClick={onClose} />
      
      {/* Centering Container */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div
          ref={modalRef}
          className="matrix-modal w-full max-w-lg relative z-10 p-0 overflow-hidden animate-slide-up shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-[var(--admin-border-strong)] my-8"
        >
          <div className="matrix-modal-header p-10 border-b border-[var(--admin-border-strong)] flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--admin-accent)]">
              Matrix Refactoring // Node #{skill.id.toString().slice(-4)}
            </p>
            <h3 className="text-xl font-bold tracking-tight text-[var(--admin-title)] mt-1">{skill.title}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-[var(--admin-text)] hover:text-[var(--admin-title)] hover:rotate-90 transition-all p-2 rounded-lg hover:bg-[var(--admin-border-strong)]/20"
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="matrix-modal-body p-8 space-y-6">
          <div className="space-y-2">
             <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--admin-text)]/80 mb-3 block pl-1">
               Skill Signature
             </label>
             <input
               autoFocus
               type="text"
               value={skill.title}
               onChange={(e) => {
                 onUpdate(skill.id, e.target.value);
                 setSkill({ ...skill, title: e.target.value });
               }}
               onKeyDown={(e) => e.key === 'Enter' && onSave()}
               className="w-full premium-input rounded-2xl px-6 py-4 font-bold text-sm"
               placeholder="Enter skill name..."
             />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="matrix-modal-footer flex items-center justify-end gap-4 px-8 pb-8 pt-6 border-t border-[var(--admin-border-strong)] bg-[var(--admin-card)]/50">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-xs font-bold text-[var(--admin-text)] hover:text-[var(--admin-title)] hover:bg-[var(--admin-border-strong)]/20 transition-all uppercase tracking-wider"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-[var(--admin-accent)] text-white text-xs font-bold flex items-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_15px_var(--admin-accent-glow)] disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {saving ? <FiRefreshCw className="animate-spin" size={14} /> : <FiCloudLightning size={14} />}
            {saving ? 'Synchronizing...' : 'Update Matrix'}
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}
