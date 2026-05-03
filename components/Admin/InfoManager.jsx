'use client';

import { useState, useEffect } from 'react';
import { FiZap, FiRefreshCw, FiCheckCircle, FiInfo, FiTrash2, FiShield, FiCloudLightning, FiPlus } from 'react-icons/fi';

export default function InfoManager() {
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/info');
      const data = await res.json();
      setInfo(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch info:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInfo = async (id, newValue) => {
    setSaving(true);
    try {
      const updatedInfo = info.map(item => item.id === id ? { ...item, value: newValue } : item);
      const res = await fetch('/api/admin/info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedInfo),
      });
      if (res.ok) {
        setInfo(updatedInfo);
        setEditingItem(null);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to update info:', error);
    } finally {
      setSaving(false);
    }
  };

  const deleteInfo = async (id) => {
    if (window.confirm('Eject this identity node from matrix?')) {
      const updatedInfo = info.filter(item => item.id !== id);
      try {
        const res = await fetch('/api/admin/info', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedInfo),
        });
        if (res.ok) setInfo(updatedInfo);
      } catch (error) {
        console.error('Failed to delete info:', error);
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_20px_rgba(99,102,241,0.2)]" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing Identity Stream...</p>
    </div>
  );

  return (
    <div className="animate-fade-in relative">
      {/* Refactoring Dialog */}
      {editingItem && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={() => setEditingItem(null)} />
          <div className="admin-card w-full max-w-lg relative z-10 !p-0 overflow-hidden animate-slide-up shadow-[0_0_100px_rgba(0,0,0,0.8)] border-indigo-500/40">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-1">Identity Refactoring // Node #{editingItem.id}</p>
                <h3 className="text-xl font-black tracking-tight">{editingItem.label}</h3>
              </div>
              <button onClick={() => setEditingItem(null)} className="admin-icon-btn hover:!rotate-90">
                <FiZap className="rotate-45" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                 <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Data Signature</label>
                 <input
                   autoFocus
                   type="text"
                   value={editingItem.value}
                   onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
                   className="neon-input text-lg font-bold"
                 />
              </div>
              
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/5">
                <button 
                  onClick={() => setEditingItem(null)}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white px-4"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => updateInfo(editingItem.id, editingItem.value)}
                  disabled={saving}
                  className="admin-btn admin-btn-primary !px-10 !py-4"
                >
                  {saving ? <FiRefreshCw className="animate-spin" /> : <FiCloudLightning />}
                  {saving ? 'Synchronizing...' : 'Update Matrix'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-16">
        <div>
          <h2 className="admin-title">Identity</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Personal Data Synchronization</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden xl:flex flex-col text-right">
              <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Protocol Active</span>
              <span className="text-[10px] font-bold text-slate-500 tracking-tighter">Secure Handshake v2.1</span>
           </div>
           <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center bg-white/[0.02]">
              <FiShield className="text-indigo-400" size={18} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {info.map((item, idx) => (
          <div key={item.id} className={`admin-card group/card stagger-${(idx % 3) + 1} !p-0 overflow-hidden border-white/5 hover:border-indigo-500/30 bg-white/[0.01]`}>
            <div className="p-8">
               <div className="flex justify-between items-start mb-6">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{item.label}</p>
                  <div className="flex gap-2 opacity-0 group-hover/card:opacity-100 transition-all transform translate-y-2 group-hover/card:translate-y-0">
                    <button 
                      onClick={() => setEditingItem(item)}
                      className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all"
                    >
                      <FiZap size={14} />
                    </button>
                    <button 
                      onClick={() => deleteInfo(item.id)}
                      className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
               </div>
               <p className="text-xl font-black tracking-tight text-white mb-4 truncate">{item.value}</p>
               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-indigo-500/20 group-hover/card:w-full group-hover/card:bg-indigo-500 transition-all duration-700" />
               </div>
            </div>
          </div>
        ))}
        
        {/* Quick Add Node */}
        <div className="admin-card border-dashed border-white/10 hover:border-indigo-500/40 bg-white/[0.01] hover:bg-indigo-500/[0.02] flex flex-col items-center justify-center py-12 group cursor-pointer transition-all">
           <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FiPlus className="text-slate-500 group-hover:text-indigo-400" size={24} />
           </div>
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Inject New Identity Data</p>
        </div>
      </div>
    </div>
  );
}
