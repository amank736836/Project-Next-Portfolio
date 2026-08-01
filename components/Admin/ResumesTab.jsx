'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiTrash2, FiDownload, FiEye, FiStar, FiTrash, FiX, FiCheck, FiAlertTriangle, FiFileText } from 'react-icons/fi';
import { useSuccessToast, useErrorToast } from '@/components/Admin/Toast';
import { useEjectConfirm } from '@/components/Admin/ConfirmModal';

function FavoriteButton({ resume, onToggle, successToast, errorToast }) {
  const handleClick = async () => {
    try {
      const res = await fetch('/api/admin/resumes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: resume.id, is_favorite: !resume.is_favorite }),
      });
      if (res.ok) {
        successToast(resume.is_favorite ? 'Removed from favorites' : 'Added to favorites');
      } else {
        errorToast('Failed to update');
      }
    } catch (err) {
      errorToast('Network error');
    }
  };

  if (resume.is_favorite) {
    return (
      <button
        onClick={handleClick}
        className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center"
        title="Remove from favorites"
      >
        <FiStar size={16} fill="currentColor" />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="w-10 h-10 rounded-lg bg-white/5 text-slate-400 border border-white/10 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/20 transition-all flex items-center justify-center"
      title="Add to favorites"
    >
      <FiStar size={16} />
    </button>
  );
}

function ResumeActions({ resume, onSetActive, onToggleFavorite, onDelete }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
      {!resume.is_active && (
        <button
          onClick={() => onSetActive(resume.id)}
          className="px-4 py-2 bg-[var(--admin-accent)]/10 text-[var(--admin-accent)] border border-[var(--admin-accent)]/20 rounded-lg text-sm font-bold hover:bg-[var(--admin-accent)] hover:text-white transition-all flex items-center gap-2"
        >
          <FiStar size={14} /> Set Active
        </button>
      )}
      <button
        onClick={() => window.open(`/api/resume/view`, '_blank')}
        className="px-4 py-2 bg-white/5 text-white border border-white/10 rounded-lg text-sm font-bold hover:bg-white/10 flex items-center gap-2"
      >
        <FiEye size={14} /> View
      </button>
      <a
        href="/api/resume/download"
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-white/5 text-white border border-white/10 rounded-lg text-sm font-bold hover:bg-white/10 flex items-center gap-2"
      >
        <FiDownload size={14} /> Download
      </a>
      <FavoriteButton resume={resume} onToggle={onToggleFavorite} />
      <button
        onClick={() => onDelete(resume.id)}
        className="w-10 h-10 rounded-lg bg-white/5 text-slate-400 border border-white/10 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 transition-all flex items-center justify-center"
        title="Delete permanently"
      >
        <FiTrash2 size={16} />
      </button>
    </div>
  );
}

function ResumeCard({ resume, onSetActive, onToggleFavorite, onDelete }) {
  return (
    <div key={resume.id} className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[var(--admin-accent)]/30 transition-all">
      {resume.is_active && (
        <div className="absolute -top-3 -right-3 px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
          Active
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-16 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <FiFileText className="w-8 h-8 text-slate-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-white truncate">{resume.title}</h4>
              {resume.is_favorite && <FiStar className="w-5 h-5 text-amber-400" title="Favorite" />}
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                resume.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
              }`}>
                {resume.is_active ? 'Active' : 'Archived'}
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-1 truncate">{resume.file_name}</p>
            <p className="text-slate-600 text-xs mt-1">
              {(resume.file_size / 1024).toFixed(1)} KB • {new Date(resume.uploaded_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <ResumeActions
          resume={resume}
          onSetActive={onSetActive}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}

export default function ResumesTab() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('Full Stack Developer Resume');
  const [deletingId, setDeletingId] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const ejectConfirm = useEjectConfirm();

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/resumes', { cache: 'no-store' });
      const data = await res.json();
      setResumes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
      errorToast('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  }, [errorToast]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      errorToast('Only PDF files allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      errorToast('File too large (max 5MB)');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('is_resume', 'true');
      formData.append('title', uploadTitle);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        successToast('Resume uploaded successfully');
        setShowUpload(false);
        setUploadTitle('Full Stack Developer Resume');
        e.target.value = '';
        fetchResumes();
      } else {
        errorToast(data.error || 'Upload failed');
      }
    } catch (err) {
      errorToast('Network error');
    } finally {
      setUploading(false);
    }
  };

  const setActive = async (id) => {
    try {
      const res = await fetch('/api/admin/resumes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: true }),
      });
      if (res.ok) {
        successToast('Active resume updated');
        fetchResumes();
      } else {
        errorToast('Failed to update');
      }
    } catch (err) {
      errorToast('Network error');
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    setDeleteConfirmText('');
  };

  const confirmDelete = async (id) => {
    if (deleteConfirmText !== 'DELETE') {
      errorToast('Type "DELETE" to confirm');
      return;
    }

    try {
      const res = await fetch(`/api/admin/resumes?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        successToast('Resume deleted');
        setDeletingId(null);
        setDeleteConfirmText('');
        fetchResumes();
      } else {
        errorToast('Failed to delete');
      }
    } catch (err) {
      errorToast('Network error');
    }
  };

  const toggleFavorite = (resume) => {
    // The FavoriteButton component handles its own API call
    // This is called via the onToggleFavorite prop
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-[var(--admin-accent)]/20 border-t-[var(--admin-accent)] rounded-full animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Resumes...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Resumes</h2>
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mt-1">
            Manage resume versions, set active, and track downloads
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--admin-accent)] text-white text-sm font-bold rounded-lg hover:brightness-110 transition-all"
        >
          <FiPlus size={16} /> Upload Resume
        </button>
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowUpload(false)} />
          <div className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Upload Resume</h3>
              <button onClick={() => setShowUpload(false)} className="text-slate-400 hover:text-white">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-400 block mb-2">Title</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[var(--admin-accent)] focus:outline-none"
                  placeholder="e.g., Full Stack Developer Resume"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-400 block mb-2">PDF File (max 5MB)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white file:mr-4 file:px-4 file:py-2 file:bg-[var(--admin-accent)] file:text-white file:border-none file:rounded-lg hover:file:bg-[var(--admin-accent)]/80"
                />
              </div>
              <p className="text-xs text-slate-500">Uploads to Supabase Storage. New version becomes active automatically.</p>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="flex-1 px-4 py-2 border border-white/20 rounded-lg text-slate-400 hover:text-white hover:border-white/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-[var(--admin-accent)] text-white rounded-lg font-bold hover:brightness-110 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <FiCheck className="animate-spin mr-2" size={14} />
                      Uploading...
                    </>
                  ) : (
                    <span>Upload</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingId && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => { setDeletingId(null); setDeleteConfirmText(''); }} />
          <div className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 animate-slide-up">
            <div className="flex items-center gap-3 text-rose-400 mb-4">
              <FiAlertTriangle size={24} />
              <h3 className="text-lg font-bold">Confirm Deletion</h3>
            </div>
            <p className="text-slate-400 mb-6">Type <code className="bg-white/5 px-2 py-1 rounded font-mono">DELETE</code> to permanently remove this resume version. This cannot be undone.</p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-rose-500 focus:outline-none font-mono text-center text-lg tracking-widest mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setDeletingId(null); setDeleteConfirmText(''); }}
                className="flex-1 px-4 py-2 border border-white/20 rounded-lg text-slate-400 hover:text-white hover:border-white/40"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deletingId)}
                className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-lg font-bold hover:bg-rose-600"
                disabled={deleteConfirmText !== 'DELETE'}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {resumes.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-white/10 rounded-2xl">
            <FiFileText className="w-16 h-16 mx-auto text-slate-600 mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No resumes uploaded</p>
            <p className="text-slate-600 text-sm mt-2">Upload your first resume to get started</p>
          </div>
        ) : (
          resumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              onSetActive={setActive}
              onToggleFavorite={() => {}} // FavoriteButton handles its own API call
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
