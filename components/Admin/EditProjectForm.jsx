'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  FiEye, FiEyeOff, FiX, FiChevronDown, FiRefreshCw, FiCloudLightning, FiGithub, FiExternalLink, FiGrid, FiCode
} from 'react-icons/fi';
import { useSuccessToast, useErrorToast } from './Toast';
import { Button, Input } from '@/components/ui';

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

  const handleSubmit = async () => {
    if (!editingProject) return;
    setSaving(true);
    try {
      const payload = {
        ...editingProject,
        details: JSON.stringify(editingProject.details || [])
      };
      const res = await fetch('/api/admin/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setEditingProject(null);
        setIsAddingCategory(false);
        await onUpdateProject();
        successToast(`Project "${editingProject.title}" updated successfully`);
      } else {
        errorToast('Failed to update project');
      }
    } catch (error) {
      console.error('Failed to update project:', error);
      errorToast('Failed to synchronize project changes');
    } finally {
      setSaving(false);
    }
  };

  if (!editingProject) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-background/40 backdrop-blur-md animate-fade-in" />
      <div
        ref={modalRef}
        tabIndex="-1"
        className="w-full max-w-5xl relative z-10 p-0 overflow-hidden animate-slide-up matrix-modal rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 md:p-8 border-b border-border/50 flex items-center justify-between relative overflow-hidden matrix-modal-header">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 min-w-0 flex-1">
            <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-indigo-500 mb-1">
              Asset Refactoring | Node #1
            </p>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[var(--admin-title)]">
              Edit Project
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
        <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-h-[calc(100vh-200px)] sm:max-h-[75vh] overflow-y-auto custom-scrollbar space-y-8 sm:space-y-12 md:space-y-14">
          {/* Section 1: Core Identity */}
          <div className="premium-card bg-white/5 rounded-xl sm:rounded-[2rem] p-6 sm:p-8 border border-white/10 border-l-4 border-l-indigo-500">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="w-1 h-6 sm:w-1.5 sm:h-8 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"/>
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base md:text-lg font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[var(--admin-title)]">Core Identity</h4>
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider sm:tracking-widest mt-0.5">Fundamental Asset Parameters</p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-8 sm:gap-10 md:gap-12">
              <div className="col-span-12 lg:col-span-7 space-y-8 sm:space-y-10">
                {/* Project Title */}
                <div className="space-y-3 sm:space-y-4">
                  <label className="text-[11px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-500 flex items-center gap-2 px-5 sm:px-8">
                    Project Title <span className="w-1 h-1 bg-indigo-500 rounded-full" />
                  </label>
                  <Input
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    placeholder="Project name..."
                    className="w-full premium-input bg-white/5 border-white/10 focus:border-indigo-500 h-12 sm:h-14 pl-7 sm:pl-12 pr-5 sm:pr-8 font-bold text-[var(--admin-title)] text-base sm:text-lg rounded-lg sm:rounded-2xl transition-all"
                  />
                </div>

                {/* Project Category */}
                <div className="space-y-3 sm:space-y-4">
                  <label className="text-[11px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-500 flex items-center gap-2 px-5 sm:px-8">
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
                      className="w-full premium-input bg-white/5 border border-white/10 rounded-lg sm:rounded-2xl pl-7 sm:pl-12 pr-10 sm:pr-12 h-12 sm:h-14 text-base sm:text-lg font-bold appearance-none outline-none focus:border-indigo-500 transition-all text-[var(--admin-title)] cursor-pointer"
                    >
                      <option value="" disabled>Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="new">+ Add New Category...</option>
                    </select>
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <FiChevronDown size={20} />
                    </div>
                  </div>

                  {isAddingCategory && (
                    <div className="mt-4 p-4 sm:p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-lg sm:rounded-2xl animate-in fade-in slide-in-from-top-4">
                      <Input
                        value={editingProject.category || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                        placeholder="Enter new category name..."
                        className="w-full premium-input bg-white/5 border-white/10 focus:border-indigo-500 h-12 sm:h-14 px-4 sm:px-6 font-bold text-[var(--admin-title)] text-base sm:text-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-12 lg:col-span-5 space-y-8 sm:space-y-10">
                {/* Visibility Status */}
                <div className="space-y-3 sm:space-y-4">
                  <label className="text-[11px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-500 px-5 sm:px-8">Visibility Status</label>
                  <button
                    onClick={() => setEditingProject({ ...editingProject, is_hidden: !editingProject.is_hidden })}
                    className={`w-full h-12 sm:h-14 px-5 sm:px-8 rounded-lg sm:rounded-2xl border flex items-center justify-between transition-all group ${
                      editingProject.is_hidden
                        ? 'bg-rose-500/5 border-rose-500/20 text-rose-400 hover:bg-rose-500/10'
                        : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      {editingProject.is_hidden ? <FiEyeOff size={18} className="sm:!size-6" /> : <FiEye size={18} className="sm:!size-6" />}
                      <span className="font-black tracking-[0.08em] sm:tracking-[0.1em] uppercase text-xs sm:text-sm">
                        {editingProject.is_hidden ? 'Private' : 'Visible'}
                      </span>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_15px_currentColor] ${editingProject.is_hidden ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                  </button>
                </div>

                {/* Tech Stack */}
                <div className="space-y-3 sm:space-y-4">
                  <label className="text-[11px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-500 px-5 sm:px-8">Tech Stack</label>
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
                    className="w-full premium-input bg-white/5 border-white/10 focus:border-indigo-500 h-12 sm:h-14 pl-7 sm:pl-12 pr-5 sm:pr-8 font-bold text-[var(--admin-title)] text-base sm:text-lg rounded-lg sm:rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Network & Access */}
          <div className="premium-card bg-white/5 rounded-xl sm:rounded-[2rem] p-6 sm:p-8 border border-white/10 border-l-4 border-l-emerald-500">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="w-1 h-6 sm:w-1.5 sm:h-8 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"/>
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base md:text-lg font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[var(--admin-title)]">Network & Access</h4>
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider sm:tracking-widest mt-0.5">Deployment Endpoints & Source</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
              {/* GitHub Repository */}
              <div className="space-y-3 sm:space-y-4">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 px-5 sm:px-8">GitHub Repository</label>
                <div className="relative group">
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <FiGithub size={24} />
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
                    className="w-full premium-input bg-white/5 border-white/10 focus:border-indigo-500 h-12 sm:h-14 pl-20 sm:pl-28 pr-5 sm:pr-8 font-bold text-[var(--admin-title)] text-base sm:text-lg rounded-lg sm:rounded-2xl"
                  />
                </div>
              </div>

              {/* Production Preview */}
              <div className="space-y-3 sm:space-y-4">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 px-5 sm:px-8">Production Preview</label>
                <div className="relative group">
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <FiExternalLink size={24} />
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
                    className="w-full premium-input bg-white/5 border-white/10 focus:border-indigo-500 h-12 sm:h-14 pl-20 sm:pl-28 pr-5 sm:pr-8 font-bold text-[var(--admin-title)] text-base sm:text-lg rounded-lg sm:rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Visual Assets */}
          <div className="premium-card bg-white/5 rounded-xl sm:rounded-[2rem] p-6 sm:p-8 border border-white/10 border-l-4 border-l-amber-500">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="w-1 h-6 sm:w-1.5 sm:h-8 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"/>
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base md:text-lg font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[var(--admin-title)]">Visual Assets</h4>
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider sm:tracking-widest mt-0.5">High-Resolution Previews</p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-8 sm:gap-10">
              <div className="col-span-12 lg:col-span-7 space-y-6 sm:space-y-8">
                <div className="space-y-3 sm:space-y-4">
                  <label className="text-[11px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-500 px-5 sm:px-8">Asset URL / Path</label>
                  <div className="flex gap-3 sm:gap-5">
                    <Input
                      value={editingProject.image || editingProject.img || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value, img: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 premium-input bg-white/5 border-white/10 focus:border-indigo-500 h-12 sm:h-14 pl-7 sm:pl-12 pr-5 sm:pr-8 font-bold text-[var(--admin-title)] text-sm sm:text-lg rounded-lg sm:rounded-2xl"
                    />
                    <button
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all hover:bg-white/10 hover:border-indigo-500/30 flex-shrink-0"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FiCloudLightning size={20} className="sm:!size-7" />
                    </button>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
              </div>

              <div className="col-span-12 lg:col-span-5">
                <div className="aspect-video w-full rounded-xl sm:rounded-3xl overflow-hidden border-2 border-white/10 bg-white/5 shadow-inner relative group">
                  {(editingProject.image || editingProject.img) ? (
                    <Image
                      src={editingProject.image || editingProject.img}
                      alt="Preview"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                      <FiGrid size={40} className="mb-4 opacity-10" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">No Buffer</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Mission Dossier */}
          <div className="premium-card bg-white/5 rounded-xl sm:rounded-[2rem] p-6 sm:p-8 border border-white/10 border-l-4 border-l-slate-500">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="w-1 h-6 sm:w-1.5 sm:h-8 bg-slate-500 rounded-full shadow-[0_0_15px_rgba(100,116,139,0.5)]"/>
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base md:text-lg font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[var(--admin-title)]">Mission Dossier</h4>
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider sm:tracking-widest mt-0.5">Deep Intelligence & Context</p>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <label className="text-[11px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-500 px-5 sm:px-8">Strategic Overview</label>
              <textarea
                rows={6}
                value={editingProject.description || ''}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                className="w-full premium-input bg-white/5 border border-white/10 rounded-lg sm:rounded-2xl pl-7 sm:pl-12 pr-5 sm:pr-8 pt-4 sm:pt-6 font-medium text-[var(--admin-text)] focus:border-indigo-500 outline-none transition-all resize-none shadow-inner"
                placeholder="Provide a detailed breakdown of this project's objectives..."
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-white/5 backdrop-blur-2xl flex items-center justify-end gap-4 sm:gap-6 relative flex-wrap">
          <button
            onClick={onRequestClose}
            className="h-12 sm:h-14 px-6 sm:px-10 rounded-lg sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs text-slate-500 hover:text-white transition-all hover:bg-white/5 border border-transparent hover:border-white/10"
          >
            Abort
          </button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={saving || uploading}
            className="h-11 sm:h-14 px-6 sm:px-12 rounded-lg sm:rounded-2xl font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-xs sm:text-sm shadow-[0_15px_30px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_20px_40px_-5px_rgba(99,102,241,0.6)] transform hover:-translate-y-1 active:translate-y-0 transition-all"
          >
            {saving ? <FiRefreshCw className="animate-spin text-base sm:text-lg" /> : <FiCloudLightning className="text-base sm:text-lg" />}
            {saving ? 'Syncing...' : 'Update'}
          </Button>
        </div>
      </div>
    </div>
  );
}
