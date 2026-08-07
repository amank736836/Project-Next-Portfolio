'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiTrash2, FiSend, FiRefreshCw, FiCheckCircle, FiBookOpen, FiZap, FiEye, FiEyeOff, FiEdit3, FiX, FiBriefcase, FiAward, FiClock, FiGrid, FiList } from 'react-icons/fi';
import { useSuccessToast, useErrorToast } from './Toast';
import { useEjectConfirm } from './ConfirmModal';
import DOMPurify from 'isomorphic-dompurify';

const sanitize = (html) => DOMPurify.sanitize(html ?? '', { ALLOWED_TAGS: ['span', 'b', 'i', 'em', 'strong', 'br'], ALLOWED_ATTR: ['class'] });

export default function ResumeManager({ type }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [editingItem, setEditingItem] = useState(null);

  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const ejectConfirm = useEjectConfirm();

  const title = type === 'education' ? 'Academy' : 'Logbook';
  const subtitle = type === 'education' ? 'Academic Achievement Configuration' : 'Professional Mission History';
  const apiPath = `/api/admin/${type}`;
  const entryCount = items.length;
  const latestEntry = items[0]?.year || 'No entries yet';
  const completionLabel = type === 'education' ? 'Academic Track' : 'Experience Track';
  const TimelineIcon = type === 'education' ? FiAward : FiBriefcase;
  const [viewMode, setViewMode] = useState('grid');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiPath, { cache: 'no-store' });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(`Failed to fetch ${type}:`, error);
    } finally {
      setLoading(false);
    }
  }, [apiPath, type]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleUpdate = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addNew = async () => {
    const newItem = {
      year: "2024 - Present",
      title: "Title - Organization",
      description: "Mission brief and key achievements...",
      category: type === 'education' ? 'education' : 'professional'
    };
    
    try {
      const res = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
        cache: 'no-store'
      });
      if (res.ok) {
        const added = await res.json();
        setItems([...items, added]);
        setEditingItem(added);
      } else {
        const err = await res.json().catch(() => ({}));
        errorToast(err.error || `Failed to create ${title} entry`);
      }
    } catch (error) {
      console.error('Failed to add item:', error);
      errorToast(`Network error while creating ${title} entry`);
    }
  };

  const saveItem = async (item) => {
    setSaving(true);
    try {
      const res = await fetch(apiPath, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        successToast(`${title} record synchronized successfully`);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        setEditingItem(null);
        await fetchItems();
      } else {
        const err = await res.json();
        errorToast(err.error || `Failed to synchronize ${title}`);
      }
    } catch (error) {
      console.error('Failed to save item:', error);
      errorToast(`Network error while saving ${title}`);
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = async (id, currentStatus) => {
    try {
      const res = await fetch(apiPath, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_hidden: !currentStatus }),
      });
      if (res.ok) {
        setItems(items.map(item => item.id === id ? { ...item, is_hidden: !currentStatus } : item));
      }
    } catch (error) {
      console.error('Failed to update visibility:', error);
    }
  };

  const deleteItem = async (id) => {
    const item = items.find(i => i.id === id);
    const confirmed = await ejectConfirm(item?.title || 'this record');
    if (!confirmed) return;
    
    try {
      const res = await fetch(apiPath, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setItems(items.filter(item => item.id !== id));
        successToast(`${title} record expunged from database`);
      } else {
        const err = await res.json().catch(() => ({}));
        errorToast(err.error || `Protocol failure: Could not delete ${title}`);
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
      errorToast(`Network error while deleting ${title}`);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-12 h-12 border-4 border-[var(--admin-accent)]/20 border-t-[var(--admin-accent)] rounded-full animate-spin shadow-[0_0_20px_rgba(var(--admin-accent-rgb),0.2)]" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Retrieving Mission Logs...</p>
    </div>
  );

  return (
    <div className="animate-fade-in relative">
      {/* Edit Dialog / Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[999] overflow-y-auto">
          <div className="modal-backdrop fixed inset-0 backdrop-blur-[10px] animate-fade-in" onClick={() => setEditingItem(null)} />
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <div className="matrix-modal w-full max-w-3xl relative z-10 p-0 overflow-hidden border border-[var(--admin-border-strong)] shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-slide-up my-8">
            <div className="matrix-modal-header p-8 border-b border-[var(--admin-border-strong)] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-[var(--admin-accent)] uppercase tracking-[0.4em] mb-1">Mission Log Overwrite // {title}</p>
                <h3 className="text-xl font-bold tracking-tight text-[var(--admin-title)]" dangerouslySetInnerHTML={{ __html: sanitize(editingItem.title) }} />
              </div>
              <button 
                onClick={() => setEditingItem(null)} 
                className="text-[var(--admin-text)] hover:text-[var(--admin-title)] hover:rotate-90 transition-all p-2 rounded-lg hover:bg-[var(--admin-border-strong)]/20"
                aria-label="Close"
              >
                <FiX size={18} />
              </button>
            </div>
            
            <div className="matrix-modal-body p-8 space-y-8">
              <div>
                <label className="text-[10px] font-bold text-[var(--admin-text)]/80 uppercase tracking-widest mb-4 block pl-1">Timeline Sector</label>
                <input
                  autoFocus
                  type="text"
                  value={editingItem.year}
                  onChange={(e) => {
                    handleUpdate(editingItem.id, 'year', e.target.value);
                    setEditingItem({ ...editingItem, year: e.target.value });
                  }}
                  className="w-full premium-input rounded-2xl px-6 py-4 font-bold text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[var(--admin-text)]/80 uppercase tracking-widest mb-3 block pl-1">Operation / Entity</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => {
                    handleUpdate(editingItem.id, 'title', e.target.value);
                    setEditingItem({ ...editingItem, title: e.target.value });
                  }}
                  className="w-full premium-input rounded-2xl px-6 py-4 font-bold text-sm"
                />
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-[var(--admin-text)]/80 uppercase tracking-widest mb-3 block pl-1">Mission Briefing</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => {
                    handleUpdate(editingItem.id, 'description', e.target.value);
                    setEditingItem({ ...editingItem, description: e.target.value });
                  }}
                  className="w-full premium-input rounded-2xl px-6 py-4 font-medium text-sm min-h-[200px] resize-none leading-relaxed"
                />
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-[var(--admin-text)]/80 uppercase tracking-widest mb-3 block pl-1">Category</label>
                <select
                  value={editingItem.category || (type === 'education' ? 'education' : 'professional')}
                  onChange={(e) => {
                    handleUpdate(editingItem.id, 'category', e.target.value);
                    setEditingItem({ ...editingItem, category: e.target.value });
                  }}
                  className="w-full premium-input rounded-2xl px-6 py-4 font-bold text-sm"
                >
                  {type === 'education' ? (
                    <>
                      <option value="education">Academic</option>
                      <option value="certification">Certification</option>
                      <option value="course">Course</option>
                    </>
                  ) : (
                    <>
                      <option value="professional">Professional</option>
                      <option value="freelance">Freelance</option>
                      <option value="internship">Internship</option>
                      <option value="volunteer">Volunteer</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="matrix-modal-footer flex items-center justify-end gap-4 px-8 pb-8 pt-6 border-t border-[var(--admin-border-strong)] bg-[var(--admin-card)]/50">
              <button 
                onClick={() => setEditingItem(null)}
                className="px-6 py-3 rounded-xl text-xs font-bold text-[var(--admin-text)] hover:text-[var(--admin-title)] hover:bg-[var(--admin-border-strong)]/20 transition-all uppercase tracking-wider"
              >
                Abort Changes
              </button>
              <button 
                onClick={() => saveItem(editingItem)}
                disabled={saving}
                className="px-8 py-3 rounded-xl bg-[var(--admin-accent)] text-white text-xs font-bold flex items-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_15px_var(--admin-accent-glow)] disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider modal-save-btn"
              >
                {saving ? <FiRefreshCw className="animate-spin" size={14} /> : <FiCheckCircle size={14} />}
                {saving ? 'Transmitting...' : 'Upload Log'}
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Compact Header */}
      <div className="admin-card mb-8 overflow-hidden border-white/5 bg-white/[0.015] relative z-30 p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--admin-accent)]/40 bg-[var(--admin-accent)]/15 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.35em] text-[var(--admin-accent)]">
                {type === 'education' ? 'Academy Sector' : 'Logbook Sector'}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--admin-border-strong)] bg-[var(--admin-card)] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.35em] text-[var(--admin-text)]">
                {completionLabel}
              </span>
            </div>

            <div>
              <h2 className="admin-title text-2xl sm:text-3xl">{title}</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-1">{subtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:ml-auto">
            <div className="hidden lg:flex items-center gap-6 text-[11px] font-mono text-slate-500">
              <span>{entryCount} <span className="text-[var(--admin-text)]/60">entries</span></span>
              <span className="w-px h-6 bg-white/10" />
              <span>Latest: <span className="text-[var(--admin-title)] font-bold">{latestEntry}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`h-7 w-7 rounded transition-all ${viewMode === 'grid' ? 'bg-white/10 text-[var(--first-color)]' : 'text-slate-400 hover:text-white'}`}
                  title="Grid view"
                >
                  <FiGrid size={14} />
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`h-7 w-7 rounded transition-all ${viewMode === 'timeline' ? 'bg-white/10 text-[var(--first-color)]' : 'text-slate-400 hover:text-white'}`}
                  title="Timeline view"
                >
                  <FiList size={14} />
                </button>
              </div>
              <button 
                onClick={fetchItems}
                disabled={loading}
                className="admin-icon-btn group !text-[var(--admin-title)]"
              >
                <FiRefreshCw className={`${loading ? 'animate-spin' : ''} text-[var(--admin-accent)]`} />
              </button>
              <button 
                onClick={addNew}
                className="admin-btn admin-btn-primary group !bg-white !text-black hover:!bg-indigo-50 px-4 py-2.5 text-xs"
              >
                <FiPlus className="group-hover:rotate-90 transition-transform" /> 
                <span>New Entry</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'timeline' ? (
        <div>
          {/* Vertical Timeline Layout */}
          <div className="relative">
            {/* Timeline center line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--admin-accent)]/40 via-transparent to-transparent" />
            
            <div className="space-y-6 pl-16">
              {items.map((item, idx) => (
                <div 
                  key={item.id} 
                  className={`relative stagger-${(idx % 4) + 1} group/card`}
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  {/* Timeline node */}
                  <div className="absolute left-[-16px] top-4 w-3 h-3 rounded-full border-2 border-[var(--admin-accent)]/50 bg-[var(--admin-bg)] z-10 transition-all group-hover/card:border-[var(--admin-accent)] group-hover/card:shadow-[0_0_12px_var(--admin-accent)] group-hover/card:scale-125">
                    <div className="absolute inset-1.5 rounded-full bg-[var(--admin-accent)]/20 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                  </div>

                  {/* Timeline card */}
                  <div className="matrix-modal group/card p-0 overflow-hidden border border-[var(--admin-border)] hover:border-[var(--admin-accent)]/30 flex flex-col transition-all duration-500 shadow-md hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] !rounded-[1.5rem]">
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-4 border-b border-[var(--admin-border-strong)] bg-[var(--admin-card)]/30 px-6 py-4 matrix-card-header">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-xl border border-[var(--admin-accent)]/20 bg-[var(--admin-accent-glow)] flex items-center justify-center text-[var(--admin-accent)] shadow-inner shrink-0">
                          <TimelineIcon size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--admin-text)]/70 mb-0.5">Timeframe</p>
                          <h4 className="font-bold text-[var(--admin-title)] truncate group-hover/card:text-[var(--admin-accent)] transition-colors flex items-center gap-2 text-sm">
                            {item.year}
                            {item.is_hidden && (
                              <span className="px-1.5 py-0.5 rounded-md text-[8px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-tighter shrink-0">
                                Hidden
                              </span>
                            )}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 opacity-40 group-hover/card:opacity-100 transition-opacity">
                        <button 
                          onClick={() => toggleVisibility(item.id, item.is_hidden)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border shadow-sm ${
                            item.is_hidden 
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500 hover:text-white'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white'
                          }`}
                          title={item.is_hidden ? 'Show Node' : 'Hide Node'}
                        >
                          {item.is_hidden ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                        </button>
                        <button 
                          onClick={() => setEditingItem(item)}
                          className="w-9 h-9 rounded-xl bg-[var(--admin-accent-glow)] text-[var(--admin-accent)] flex items-center justify-center hover:bg-[var(--admin-accent)] hover:text-white transition-all border border-[var(--admin-accent)]/20 shadow-sm"
                          title="Modify Entry"
                        >
                          <FiEdit3 size={14} />
                        </button>
                        <button 
                          onClick={() => deleteItem(item.id)}
                          className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 shadow-sm"
                          title="Delete Entry"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col gap-4 matrix-card-body">
                      <div className="mb-2">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--admin-text)]/70 mb-1">Entity / Position</p>
                        <h5 className="text-sm font-bold text-[var(--admin-title)] leading-tight" dangerouslySetInnerHTML={{ __html: sanitize(item.title) }} />
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--admin-text)]/70 mb-1">Brief Context</p>
                        <p className="text-xs text-[var(--admin-text)] leading-relaxed line-clamp-3 group-hover/card:line-clamp-none transition-all" dangerouslySetInnerHTML={{ __html: sanitize(item.description) }} />
                      </div>

                      <div className="mt-4 flex items-center justify-between pt-4 border-t border-[var(--admin-border-strong)]">
                        <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-tighter border ${
                          item.category === 'education' 
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                            : item.category === 'certification'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : item.category === 'course'
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                            : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        }`}>
                          {item.category || (type === 'education' ? 'Academic' : 'Professional')}
                        </span>
                        <div className="flex items-center gap-3 text-[9px] font-medium text-[var(--admin-text)]/50 uppercase tracking-widest">
                          <span>Updated: {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'Active'}</span>
                          <FiClock size={12} className="text-slate-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Timeline end marker */}
              <div className="relative pb-4">
                <div className="absolute left-[-16px] bottom-0 w-3 h-3 rounded-full border-2 border-dashed border-[var(--admin-accent)]/30 bg-[var(--admin-bg)]" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
            {items.map((item, idx) => (
              <div key={item.id} className={`matrix-modal group/card stagger-${(idx % 4) + 1} p-0 overflow-hidden border border-[var(--admin-border)] hover:border-[var(--admin-accent)]/30 flex flex-col transition-all duration-500 shadow-md hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] !rounded-[1.5rem]`}>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-4 border-b border-[var(--admin-border-strong)] bg-[var(--admin-card)]/30 px-6 py-4 matrix-card-header">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl border border-[var(--admin-accent)]/20 bg-[var(--admin-accent-glow)] flex items-center justify-center text-[var(--admin-accent)] shadow-inner shrink-0">
                      <TimelineIcon size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--admin-text)]/70 mb-0.5">Timeframe</p>
                      <h4 className="font-bold text-[var(--admin-title)] truncate group-hover/card:text-[var(--admin-accent)] transition-colors flex items-center gap-2 text-sm">
                        {item.year}
                        {item.is_hidden && (
                          <span className="px-1.5 py-0.5 rounded-md text-[8px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-tighter shrink-0">
                            Hidden
                          </span>
                        )}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 opacity-40 group-hover/card:opacity-100 transition-opacity">
                    <button 
                      onClick={() => toggleVisibility(item.id, item.is_hidden)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border shadow-sm ${
                        item.is_hidden 
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500 hover:text-white'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white'
                      }`}
                      title={item.is_hidden ? 'Show Node' : 'Hide Node'}
                    >
                      {item.is_hidden ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                    <button 
                      onClick={() => setEditingItem(item)}
                      className="w-9 h-9 rounded-xl bg-[var(--admin-accent-glow)] text-[var(--admin-accent)] flex items-center justify-center hover:bg-[var(--admin-accent)] hover:text-white transition-all border border-[var(--admin-accent)]/20 shadow-sm"
                      title="Modify Entry"
                    >
                      <FiEdit3 size={14} />
                    </button>
                    <button 
                      onClick={() => deleteItem(item.id)}
                      className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 shadow-sm"
                      title="Delete Entry"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col gap-4 matrix-card-body">
                  <div className="mb-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--admin-text)]/70 mb-1">Entity / Position</p>
                    <h5 className="text-sm font-bold text-[var(--admin-title)] leading-tight" dangerouslySetInnerHTML={{ __html: sanitize(item.title) }} />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--admin-text)]/70 mb-1">Brief Context</p>
                    <p className="text-xs text-[var(--admin-text)] leading-relaxed line-clamp-3 group-hover/card:line-clamp-none transition-all" dangerouslySetInnerHTML={{ __html: sanitize(item.description) }} />
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-[var(--admin-border-strong)]">
                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-tighter border ${
                      item.category === 'education' 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                        : item.category === 'certification'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        : item.category === 'course'
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>
                      {item.category || (type === 'education' ? 'Academic' : 'Professional')}
                    </span>
                    <div className="flex items-center gap-3 text-[9px] font-medium text-[var(--admin-text)]/50 uppercase tracking-widest">
                      <span>Updated: {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'Active'}</span>
                      <FiClock size={12} className="text-slate-600" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-[var(--admin-border-strong)] rounded-[2.5rem] bg-[var(--admin-card)]/10 relative">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-dashed border-[var(--admin-accent)]/30 bg-[var(--admin-bg)]" />
          <p className="text-[var(--admin-text)]/60 font-bold uppercase tracking-widest text-xs pl-4">No entries detected. Add one above.</p>
        </div>
      )}
    </div>
  );
}