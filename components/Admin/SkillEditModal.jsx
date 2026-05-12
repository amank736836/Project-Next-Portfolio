'use client';

import { FiX, FiRefreshCw, FiCloudLightning } from 'react-icons/fi';
import { Button, Input } from '@/components/ui';

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
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={onClose} />
      <div
        ref={modalRef}
        className="matrix-modal w-full max-w-lg relative z-10 p-0 overflow-hidden animate-slide-up shadow-[0_0_100px_rgba(0,0,0,0.8)] border-border/50"
      >
        <div className="matrix-modal-header p-10 border-b border-border/50 flex items-center justify-between bg-background/50">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--admin-accent)]">
              Matrix Refactoring // Node #{skill.id.toString().slice(-4)}
            </p>
            <h3 className="text-xl font-bold tracking-tight text-[var(--admin-title)]">{skill.title}</h3>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <FiX />
          </button>
        </div>

        <div className="matrix-modal-body p-10">
          <div className="mb-6">
             <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 block">Skill Signature</label>
             <Input
               autoFocus
               type="text"
               value={skill.title}
               onChange={(e) => {
                 onUpdate(skill.id, e.target.value);
                 setSkill({ ...skill, title: e.target.value });
               }}
               className="w-full text-lg font-bold"
               placeholder="Enter skill name..."
             />
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-border/50">
            <button
              onClick={onClose}
              className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors px-4 py-2"
            >
              Cancel
            </button>
            <Button
              onClick={onSave}
              disabled={saving}
               className="px-10 py-4 bg-[var(--admin-accent)] text-white shadow-[0_0_15px_var(--admin-accent-glow)]"
            >
              {saving ? <FiRefreshCw className="animate-spin" /> : <FiCloudLightning />}
              {saving ? 'Synchronizing...' : 'Update Matrix'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
