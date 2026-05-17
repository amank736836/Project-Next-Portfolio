'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  FiEye, FiEyeOff, FiX, FiChevronDown, FiRefreshCw, FiCloudLightning, FiGithub, FiExternalLink, FiGrid, FiCode
} from 'react-icons/fi';
import { useSuccessToast, useErrorToast } from './Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function EditProjectForm({
  editingProject,
  setEditingProject,
  categories,
  setIsAddingCategory,
  isAddingCategory,
  onUpdateProject,
  onRequestClose,
  modalRef
}) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  useEffect(() => {
    if (modalRef?.current) {
      modalRef.current.focus();
    }
  }, [editingProject, modalRef]);

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

  const isNew = !editingProject?.id;

  const handleSubmit = async () => {
    if (!editingProject) return;
    if (!editingProject.title?.trim()) {
      errorToast('Project title is required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...editingProject,
        details: JSON.stringify(editingProject.details || [])
      };
      const res = await fetch('/api/admin/projects', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setEditingProject(null);
        setIsAddingCategory(false);
        await onUpdateProject();
        successToast(isNew
          ? `Project "${editingProject.title}" created successfully`
          : `Project "${editingProject.title}" updated successfully`);
      } else {
        errorToast(isNew ? 'Failed to create project' : 'Failed to update project');
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      errorToast('Failed to synchronize project changes');
    } finally {
      setSaving(false);
    }
  };

  if (!editingProject) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={onRequestClose} />
      <div
        ref={modalRef}
        tabIndex="-1"
        className="w-full max-w-3xl relative z-10 flex flex-col animate-slide-up matrix-modal rounded-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]"
        style={{ maxHeight: 'calc(100vh - 48px)' }}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between relative overflow-hidden matrix-modal-header flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 min-w-0 flex-1">
            <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-indigo-500 mb-1">
              {isNew ? 'New Asset | Node Init' : 'Asset Refactoring | Node #1'}
            </p>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[var(--admin-title)]">
              {isNew ? 'New Project' : 'Edit Project'}
            </h3>
          </div>
          <button
            onClick={onRequestClose}
            className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg sm:rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all group flex-shrink-0 ml-2"
          >
            <FiX size={20} className="sm:!size-6 group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">
          {/* Section 1: Core Identity */}
          <div className="rounded-xl p-4 border border-indigo-500/25 bg-indigo-500/[0.04] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-indigo-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.6)]"/>
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
                  <Input
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    placeholder="Project name..."
                    className="w-full premium-input bg-white/5 border-white/10 focus:border-indigo-500 h-11 px-4 font-bold text-[var(--admin-title)] text-base rounded-lg transition-all"
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
                          setIsAddingCategory(true);
                          setEditingProject({ ...editingProject, category: '' });
                        } else {
                          setIsAddingCategory(false);
                          setEditingProject({ ...editingProject, category: e.target.value });
                        }
                      }}
                      className="w-full premium-input bg-white/5 border border-white/10 rounded-lg px-4 pr-10 h-11 text-base font-bold appearance-none outline-none focus:border-indigo-500 transition-all text-[var(--admin-title)] cursor-pointer"
                    >
                      <option value="" disabled>Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="new">+ Add New Category...</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <FiChevronDown size={20} />
                    </div>
                  </div>

                  {isAddingCategory && (
                    <div className="mt-4 p-4 sm:p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-lg sm:rounded-2xl animate-in fade-in slide-in-from-top-4">
                      <Input
                        value={editingProject.category || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                        placeholder="Enter new category name..."
                        className="w-full premium-input bg-white/5 border-white/10 focus:border-indigo-500 h-11 px-4 font-bold text-[var(--admin-title)] text-base"
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
                      {editingProject.is_hidden ? <FiEyeOff size={18} /> : <FiEye size={18} />}
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
                  <Input
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
                    className="w-full premium-input bg-white/5 border-white/10 focus:border-indigo-500 h-11 px-4 font-bold text-[var(--admin-title)] text-base rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Network & Access */}
          <div className="rounded-xl p-4 border border-emerald-500/25 bg-emerald-500/[0.04] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.6)]"/>
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base md:text-lg font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[var(--admin-title)]">Network & Access</h4>
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider sm:tracking-widest mt-0.5">Deployment Endpoints & Source</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 px-1">GitHub Repository</label>
                <div className="flex items-center gap-2">
                  <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400">
                    <FiGithub size={16} />
                  </div>
                  <Input
                    value={(() => {
                      const details = editingProject.details || [];
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
                    className="flex-1 premium-input bg-white/5 border-white/10 focus:border-indigo-500 h-11 px-4 font-bold text-[var(--admin-title)] text-sm rounded-lg min-w-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 px-1">Production Preview</label>
                <div className="flex items-center gap-2">
                  <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400">
                    <FiExternalLink size={16} />
                  </div>
                  <Input
                    value={(() => {
                      const details = editingProject.details || [];
                      const detail = details.find(d => d.title?.includes('Preview'));
                      return detail?.desc || '';
                    })()}
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
                    className="flex-1 premium-input bg-white/5 border-white/10 focus:border-indigo-500 h-11 px-4 font-bold text-[var(--admin-title)] text-sm rounded-lg min-w-0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Visual Assets */}
          <div className="rounded-xl p-4 border border-amber-500/25 bg-amber-500/[0.04] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-amber-500 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.6)]"/>
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base md:text-lg font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[var(--admin-title)]">Visual Assets</h4>
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider sm:tracking-widest mt-0.5">High-Resolution Previews</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Asset URL / Path</label>
                <div className="flex gap-2">
                  <Input
                    value={editingProject.image || editingProject.img || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value, img: e.target.value })}
                    placeholder="https://... or /assets/..."
                    className="flex-1 premium-input bg-white/5 border-white/10 focus:border-amber-500 h-11 px-4 font-bold text-[var(--admin-title)] text-sm rounded-lg min-w-0"
                  />
                  <button
                    className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-amber-400 transition-all hover:bg-amber-500/10 hover:border-amber-500/30 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    title={uploading ? 'Uploading...' : 'Upload image'}
                  >
                    {uploading
                      ? <FiRefreshCw size={16} className="animate-spin text-amber-400" />
                      : <FiCloudLightning size={16} />}
                  </button>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>

              {/* Preview thumbnail */}
              <div className="h-[130px] rounded-lg overflow-hidden border border-white/15 bg-white/5 relative group">
                {(editingProject.image || editingProject.img) ? (
                  <Image
                    src={editingProject.image || editingProject.img}
                    alt="Preview"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-2">
                    <FiGrid size={28} className="opacity-30" />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em]">No Preview</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Upload progress overlay */}
                {uploading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/70 backdrop-blur-sm rounded-lg">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
                      <FiCloudLightning size={14} className="absolute inset-0 m-auto text-amber-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 animate-pulse">
                      Uploading...
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Mission Dossier */}
          <div className="rounded-xl p-4 border border-slate-500/25 bg-slate-500/[0.04] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-slate-400 rounded-full shadow-[0_0_12px_rgba(148,163,184,0.5)]"/>
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
                className="w-full premium-input bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-medium text-[var(--admin-text)] focus:border-indigo-500 outline-none transition-all resize-none shadow-inner"
                placeholder="Provide a detailed breakdown of this project's objectives..."
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-white/5 backdrop-blur-2xl flex items-center justify-end gap-3 flex-shrink-0">
          <button
            onClick={onRequestClose}
            className="h-10 px-6 rounded-lg font-black uppercase tracking-widest text-[10px] text-slate-500 hover:text-white transition-all hover:bg-white/5 border border-transparent hover:border-white/10"
          >
            Abort
          </button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={saving || uploading}
            className="h-10 px-8 rounded-lg font-black uppercase tracking-[0.1em] text-xs shadow-[0_8px_20px_-5px_rgba(99,102,241,0.5)] hover:shadow-[0_12px_30px_-5px_rgba(99,102,241,0.6)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            {saving ? <FiRefreshCw className="animate-spin text-base sm:text-lg" /> : <FiCloudLightning className="text-base sm:text-lg" />}
            {saving ? (isNew ? 'Creating...' : 'Syncing...') : (isNew ? 'Create' : 'Update')}
          </Button>
        </div>
      </div>
    </div>
  );
}
