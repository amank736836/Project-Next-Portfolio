'use client';

import { FiRefreshCw, FiCloudLightning } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';

export default function ModalFooter({ 
  isNew, 
  saving, 
  uploading, 
  onSubmit, 
  onClose 
}) {
  return (
    <div className="px-5 py-3 border-t border-white/10 bg-white/5 backdrop-blur-2xl flex items-center justify-end gap-3 flex-shrink-0">
      <button
        onClick={onClose}
        className="h-10 px-6 rounded-lg font-black uppercase tracking-widest text-[10px] text-slate-500 hover:text-white transition-all hover:bg-white/5 border border-transparent hover:border-white/10"
      >
        Abort
      </button>
      <Button
        variant="primary"
        onClick={onSubmit}
        disabled={saving || uploading}
        className="h-10 px-8 rounded-lg font-black uppercase tracking-[0.1em] text-xs shadow-[0_8px_20px_-5px_rgba(99,102,241,0.5)] hover:shadow-[0_12px_30px_-5px_rgba(99,102,241,0.6)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all"
      >
        {saving ? <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" /></svg> : <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 8" /><line x1="12" y1="16" x2="12" y2="16" /><line x1="8" y1="12" x2="8" y2="12" /></svg>}
        {saving ? (isNew ? 'Creating...' : 'Syncing...') : (isNew ? 'Create' : 'Update')}
      </Button>
    </div>
  );
}