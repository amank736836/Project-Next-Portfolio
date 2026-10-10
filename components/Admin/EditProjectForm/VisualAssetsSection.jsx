'use client';

import { useMemo, useRef, useState } from 'react';
import { FiRefreshCw, FiExternalLink, FiMonitor, FiImage, FiX } from 'react-icons/fi';
import { useSuccessToast, useErrorToast } from '../Toast';
import { getProductionUrl, getScreenshotUrl } from '@/lib/projectPreview';

export default function VisualAssetsSection({ editingProject, setEditingProject }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const [frameLoading, setFrameLoading] = useState(true);
  const [previewTab, setPreviewTab] = useState('shot');
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const productionUrl = useMemo(
    () => getProductionUrl(editingProject),
    [editingProject]
  );
  const screenshotUrl = useMemo(
    () => (productionUrl ? getScreenshotUrl(productionUrl, 1280) : null),
    [productionUrl]
  );
  const customImage = editingProject?.image || editingProject?.img || '';
  const effectivePreview = customImage || screenshotUrl || '';

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

  const handleUseAutoScreenshot = () => {
    if (!screenshotUrl) return;
    setEditingProject(prev => ({ ...prev, image: screenshotUrl, img: screenshotUrl }));
    successToast('Auto screenshot pinned as image');
  };

  const handleClearCustom = () => {
    setEditingProject(prev => ({ ...prev, image: '', img: '' }));
  };

  const handleRefreshLive = () => {
    setFrameLoading(true);
    setFrameKey(k => k + 1);
  };

  const handleTabSwitch = (tab) => {
    setPreviewTab(tab);
    if (tab === 'live') setFrameLoading(true);
  };

  return (
    <div className="rounded-xl p-4 border border-amber-500/25 bg-amber-500/[0.04] shadow-sm space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 bg-amber-500 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
        <div className="min-w-0">
          <h4 className="text-sm sm:text-base md:text-lg font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[var(--admin-title)]">Visual Assets</h4>
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider sm:tracking-widest mt-0.5">Live Preview + Image Override</p>
        </div>
      </div>

      {/* SITE PREVIEW — driven by Production Preview URL.
          Screenshot tab always works; Live embed can be blocked by
          X-Frame-Options on either side (also needs a dev-server restart
          after the frame-src CSP change in next.config.mjs). */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
            <button
              type="button"
              onClick={() => handleTabSwitch('shot')}
              className={`h-7 px-3 rounded-md text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${previewTab === 'shot' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'}`}
            >
              <FiImage className="w-3.5 h-3.5" /> Screenshot
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('live')}
              className={`h-7 px-3 rounded-md text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${previewTab === 'live' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'}`}
            >
              <FiMonitor className="w-3.5 h-3.5" /> Live
            </button>
          </div>
          {productionUrl && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleRefreshLive}
                title="Reload preview"
                className="h-8 px-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5 text-[11px] font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <FiRefreshCw className={`w-3.5 h-3.5 ${frameLoading ? 'animate-spin' : ''}`} />
                Reload
              </button>
              <a
                href={productionUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open live site"
                className="h-8 px-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5 text-[11px] font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <FiExternalLink className="w-3.5 h-3.5" />
                Visit
              </a>
            </div>
          )}
        </div>

        {productionUrl ? (
          <>
            {previewTab === 'shot' ? (
              <div className="rounded-lg overflow-hidden border border-white/15 bg-black/40 relative" style={{ height: 280 }}>
                {effectivePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={frameKey}
                    src={effectivePreview}
                    alt="Auto screenshot of live site"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-2">
                    <FiImage className="w-7 h-7 opacity-30" />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em]">No Preview</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/70 backdrop-blur text-[10px] font-black uppercase tracking-widest text-amber-300">
                  {customImage ? 'Custom image' : 'Auto screenshot'}
                </div>
              </div>
            ) : (
              <div className="rounded-lg overflow-hidden border border-white/15 bg-white/5 relative" style={{ height: 280 }}>
                {frameLoading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/60 backdrop-blur-sm">
                    <div className="w-8 h-8 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 animate-pulse">
                      Loading live site…
                    </span>
                  </div>
                )}
                <iframe
                  key={`live-${frameKey}`}
                  src={productionUrl}
                  title="Live site preview"
                  className="absolute inset-0 h-full w-full bg-white"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  onLoad={() => setFrameLoading(false)}
                />
              </div>
            )}
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed truncate" title={productionUrl}>
              Showing current look of <span className="text-slate-300 font-bold">{productionUrl}</span>
              {previewTab === 'live' && (
                <span className="text-slate-600"> — if blocked, the site (or local CSP — restart dev server) forbids embedding; use Screenshot or Visit.</span>
              )}
            </p>
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.02] p-4 text-center">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Add a Production Preview URL above
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              The live site will render here automatically — no upload needed.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        {/* Left: URL input + upload */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-1.5">
              <FiImage className="w-3.5 h-3.5" /> Custom image override
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customImage}
                onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value, img: e.target.value })}
                placeholder="https://res.cloudinary.com/... or /assets/..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 h-11 font-bold text-[var(--admin-title)] text-sm min-w-0"
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
              Optional. Leave empty to auto-use the live screenshot. Supported: PNG, JPG, WebP, GIF.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {screenshotUrl && (
                <button
                  type="button"
                  onClick={handleUseAutoScreenshot}
                  className="h-8 px-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider hover:bg-amber-500/20 transition-all"
                >
                  Pin auto screenshot
                </button>
              )}
              {customImage && (
                <button
                  type="button"
                  onClick={handleClearCustom}
                  className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-[11px] font-bold uppercase tracking-wider hover:text-white hover:bg-white/10 transition-all flex items-center gap-1"
                >
                  <FiX className="w-3 h-3" /> Use auto
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Preview thumbnail */}
        <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
              Card image {customImage ? '(custom)' : screenshotUrl ? '(auto screenshot)' : ''}
            </label>
            <div className="h-[130px] rounded-lg overflow-hidden border border-white/15 bg-white/5 relative group">
              {effectivePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={effectivePreview}
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
  );
}
