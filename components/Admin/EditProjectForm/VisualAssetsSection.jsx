'use client';

import { useRef, useState } from 'react';
import { FiRefreshCw, FiCloudLightning, FiGrid } from 'react-icons/fi';
import { useSuccessToast, useErrorToast } from '../Toast';
import { Button } from '@/components/ui/Button';

export default function VisualAssetsSection({ editingProject, setEditingProject }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        setEditingProject(prev => ({ ...prev, image: url, img: url }));
        successToast('Image uploaded successfully');
      } else {
        errorToast('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      errorToast('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="rounded-xl p-4 border border-amber-500/25 bg-amber-500/[0.04] shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 bg-amber-500 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
        <div className="min-w-0">
          <h4 className="text-sm sm:text-base md:text-lg font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[var(--admin-title)]">Visual Assets</h4>
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider sm:tracking-widest mt-0.5">High-Resolution Previews</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        {/* Left: URL input + upload */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Asset URL / Path</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={editingProject.image || editingProject.img || ''}
                onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value, img: e.target.value })}
                placeholder="https://res.cloudinary.com/... or /assets/..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 h-11 font-bold text-[var(--admin-title)] text-sm"
              />
              <button
                className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-amber-400 transition-all hover:bg-amber-500/10 hover:border-amber-500/30 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                title={uploading ? 'Uploading...' : 'Upload image'}
              >
                {uploading
                  ? <svg className="w-5 h-5 animate-spin text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" /></svg>
                  : <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 8" /><line x1="12" y1="16" x2="12" y2="16" /><line x1="8" y1="12" x2="8" y2="12" /></svg>
                }
              </button>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
              Paste a URL or upload a local image. Supported: PNG, JPG, WebP, GIF.
            </p>
          </div>

          {/* Right: Preview thumbnail */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Preview</label>
            <div className="h-[130px] rounded-lg overflow-hidden border border-white/15 bg-white/5 relative group">
              {(editingProject.image || editingProject.img) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={editingProject.image || editingProject.img}
                  alt="Preview"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-2">
                  <svg className="w-7 h-7 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em]">No Preview</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Upload progress overlay */}
              {uploading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/70 backdrop-blur-sm rounded-lg">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
                    <svg className="w-5 h-5 absolute inset-0 m-auto text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="16 16 12 12 8 8" />
                      <line x1="12" y1="16" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="8" y2="12" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 animate-pulse">
                    Uploading...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
