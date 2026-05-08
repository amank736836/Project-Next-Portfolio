'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiSend, FiRefreshCw, FiCheckCircle, FiBookOpen, FiZap, FiEye, FiEyeOff, FiEdit3 } from 'react-icons/fi';

export default function ResumeManager({ type }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [editingItem, setEditingItem] = useState(null);

  const title = type === 'education' ? 'Academy' : 'Logbook';
  const subtitle = type === 'education' ? 'Academic Achievement Configuration' : 'Professional Mission History';
  const apiPath = `/api/admin/${type}`;
  const entryCount = items.length;
  const latestEntry = items[0]?.year || 'No entries yet';
  const completionLabel = type === 'education' ? 'Academic Track' : 'Experience Track';

  useEffect(() => {
    fetchItems();
  }, [type]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiPath);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(`Failed to fetch ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addNew = async () => {
    const newItem = {
      year: "2024 - Present",
      title: "Title - <span> Organization </span>",
      description: "Mission brief and key achievements..."
    };
    
    try {
      const res = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (res.ok) {
        const added = await res.json();
        setItems([...items, added]);
        setEditingItem(added); // Automatically open edit dialog for new items
      }
    } catch (error) {
      console.error('Failed to add item:', error);
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
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Failed to save item:', error);
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
    if (!confirm('Abort this record? All data will be expunged.')) return;
    
    try {
      const res = await fetch(apiPath, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setItems(items.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_20px_rgba(99,102,241,0.2)]" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Retrieving Mission Logs...</p>
    </div>
  );

  return (
    <div className="animate-fade-in relative">
      {/* Edit Dialog / Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={() => setEditingItem(null)} />
          <div className="admin-card w-full max-w-3xl relative z-10 !p-0 overflow-hidden animate-slide-up shadow-[0_0_100px_rgba(0,0,0,0.8)] border-indigo-500/40">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-1">Mission Log Overwrite // {title}</p>
                <h3 className="text-xl font-black tracking-tight" dangerouslySetInnerHTML={{ __html: editingItem.title }} />
              </div>
              <button onClick={() => setEditingItem(null)} className="admin-icon-btn hover:!rotate-90">
                <FiZap className="rotate-45" />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Timeline Sector</label>
                  <input
                    autoFocus
                    type="text"
                    value={editingItem.year}
                    onChange={(e) => {
                      handleUpdate(editingItem.id, 'year', e.target.value);
                      setEditingItem({ ...editingItem, year: e.target.value });
                    }}
                    className="neon-input font-bold"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Operation / Entity</label>
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => {
                      handleUpdate(editingItem.id, 'title', e.target.value);
                      setEditingItem({ ...editingItem, title: e.target.value });
                    }}
                    className="neon-input font-bold"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Mission Briefing</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => {
                    handleUpdate(editingItem.id, 'description', e.target.value);
                    setEditingItem({ ...editingItem, description: e.target.value });
                  }}
                  className="neon-input min-h-[200px] resize-none leading-relaxed text-base"
                />
              </div>
              
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/5">
                <button 
                  onClick={() => setEditingItem(null)}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors px-4"
                >
                  Abort Changes
                </button>
                <button 
                  onClick={() => saveItem(editingItem)}
                  disabled={saving}
                  className="admin-btn admin-btn-primary !px-10 !py-4"
                >
                  {saving ? <FiRefreshCw className="animate-spin" /> : <FiCheckCircle />}
                  {saving ? 'Transmitting...' : 'Upload Log'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="admin-card !p-0 mb-[160px] overflow-hidden border-white/5 bg-white/[0.015] relative z-30">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] p-8 lg:p-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-[9px] font-black uppercase tracking-[0.35em] text-indigo-300">
                Academy Sector
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[9px] font-black uppercase tracking-[0.35em] text-slate-300">
                {completionLabel}
              </span>
            </div>

            <div>
              <h2 className="admin-title">{title}</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3">{subtitle}</p>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-slate-400">
              Shape the education timeline with clear milestones, concise context, and stronger visual hierarchy. Each entry now reads like a premium record rather than a plain list row.
            </p>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={addNew}
                className="admin-btn admin-btn-primary group !bg-white !text-black hover:!bg-indigo-50"
              >
                <FiPlus className="group-hover:rotate-90 transition-transform" /> 
                <span>New Mission Entry</span>
              </button>
              <button
                onClick={fetchItems}
                className="admin-btn admin-btn-secondary group"
              >
                <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                <span>Refresh Sector</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 self-start lg:justify-self-end w-full max-w-md">
            <div className="rounded-[28px] border border-white/5 bg-white/[0.03] p-5">
              <p className="text-[9px] font-black uppercase tracking-[0.35em] text-slate-500 mb-3">Entries</p>
              <p className="text-4xl font-black tracking-tight text-white">{entryCount}</p>
              <p className="mt-2 text-[10px] uppercase tracking-widest text-slate-500">Total records</p>
            </div>
            <div className="rounded-[28px] border border-white/5 bg-white/[0.03] p-5">
              <p className="text-[9px] font-black uppercase tracking-[0.35em] text-slate-500 mb-3">Latest</p>
              <p className="text-lg font-black tracking-tight text-white leading-tight">{latestEntry}</p>
              <p className="mt-2 text-[10px] uppercase tracking-widest text-slate-500">Most recent sector</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-16 mt-[100px] relative z-10">
        {items.map((item, idx) => (
          <div key={item.id} className={`admin-card group/card stagger-${(idx % 4) + 1} !p-0 overflow-hidden border-white/5 hover:border-indigo-500/30 bg-white/[0.01] flex flex-col transition-all duration-500`}>
            {/* Card Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/[0.05] bg-white/[0.02] px-12 py-8">
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-11 w-11 rounded-xl border border-indigo-500/20 bg-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-inner">
                  <FiBookOpen size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Timeframe</p>
                  <h4 className="font-bold text-white truncate group-hover/card:text-indigo-300 transition-colors flex items-center gap-2">
                    {item.year}
                    {item.is_hidden && (
                      <span className="px-1.5 py-0.5 rounded-md text-[8px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-tighter">
                        Hidden
                      </span>
                    )}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 opacity-40 group-hover/card:opacity-100 transition-opacity">
                <button 
                  onClick={() => toggleVisibility(item.id, item.is_hidden)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border shadow-sm ${
                    item.is_hidden 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500 hover:text-white'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white'
                  }`}
                  title={item.is_hidden ? 'Show' : 'Hide'}
                >
                  {item.is_hidden ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
                <button 
                  onClick={() => setEditingItem(item)}
                  className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all border border-indigo-500/20 shadow-sm"
                  title="Edit"
                >
                  <FiEdit3 size={16} />
                </button>
                <button 
                  onClick={() => deleteItem(item.id)}
                  className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 shadow-sm"
                  title="Delete"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-16 flex-1 flex flex-col">
              <div className="mb-4">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Entity / Position</p>
                <h5 className="text-sm font-bold text-slate-200 leading-tight" dangerouslySetInnerHTML={{ __html: item.title }} />
              </div>
              
              <div className="flex-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Brief Context</p>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 group-hover/card:line-clamp-none transition-all" dangerouslySetInnerHTML={{ __html: item.description }} />
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/[0.05]">
                <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-tighter border ${
                  item.category === 'education' 
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                    : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                }`}>
                  {item.category}
                </span>
                <span className="text-[9px] font-medium text-slate-600 uppercase tracking-widest">
                  Updated: {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'Active'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.01]">
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No entries detected. Add one above.</p>
        </div>
      )}
    </div>
  );
}
