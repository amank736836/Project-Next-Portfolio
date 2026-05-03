'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiSend, FiRefreshCw, FiCheckCircle, FiBookOpen, FiZap } from 'react-icons/fi';

export default function ResumeManager({ type }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [editingItem, setEditingItem] = useState(null);

  const title = type === 'education' ? 'Academy' : 'Logbook';
  const subtitle = type === 'education' ? 'Academic Achievement Configuration' : 'Professional Mission History';
  const apiPath = `/api/admin/${type}`;

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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-16">
        <div>
          <h2 className="admin-title">{title}</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3">{subtitle}</p>
        </div>
        <button 
          onClick={addNew}
          className="admin-btn admin-btn-primary group !bg-white !text-black hover:!bg-indigo-50"
        >
          <FiPlus className="group-hover:rotate-90 transition-transform" /> 
          <span>New Mission Entry</span>
        </button>
      </div>

      <div className="space-y-8">
        {items.map((item, idx) => (
          <div key={item.id} className={`admin-card group/card stagger-${(idx % 3) + 1} !p-0 overflow-hidden border-indigo-500/10 hover:border-indigo-500/30`}>
            <div className="flex flex-col lg:flex-row">
              {/* Timeline Info Bar */}
              <div className="lg:w-64 p-8 bg-white/[0.02] border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between">
                <div>
                   <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-4">Timeline</p>
                   <p className="text-sm font-bold text-slate-300">{item.year}</p>
                </div>
                <div className="mt-8 pt-8 border-t border-white/5 flex gap-3 opacity-0 group-hover/card:opacity-100 transition-opacity">
                   <button 
                     onClick={() => setEditingItem(item)}
                     className="admin-icon-btn !w-10 !h-10 bg-indigo-500/5 text-indigo-400 border-indigo-500/20 hover:!bg-indigo-500 hover:!text-white"
                   >
                     <FiZap size={16} />
                   </button>
                   <button 
                     onClick={() => deleteItem(item.id)}
                     className="admin-icon-btn !w-10 !h-10 bg-rose-500/5 text-rose-400 border-rose-500/20 hover:!bg-rose-500 hover:!text-white"
                   >
                     <FiTrash2 size={16} />
                   </button>
                </div>
              </div>

              {/* Main Content Preview */}
              <div className="flex-1 p-10">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-inner">
                      <FiBookOpen size={18} />
                   </div>
                   <h3 className="text-xl font-black tracking-tight" dangerouslySetInnerHTML={{ __html: item.title }} />
                </div>
                <p className="text-slate-400 leading-relaxed text-base">
                  {item.description}
                </p>
                
                {/* Visual Accent */}
                <div className="mt-8 flex items-center gap-2">
                   <div className="h-1 w-12 bg-indigo-500/30 rounded-full" />
                   <div className="h-1 w-2 bg-indigo-500/10 rounded-full" />
                   <div className="h-1 w-1 bg-indigo-500/5 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01]">
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No mission logs detected in this sector.</p>
          </div>
        )}
      </div>
    </div>
  );
}
