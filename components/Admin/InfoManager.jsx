'use client';

import { useState, useEffect } from 'react';
import { FiZap, FiRefreshCw, FiCheckCircle, FiInfo, FiTrash2, FiShield, FiCloudLightning, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import { useSuccessToast, useErrorToast } from './Toast';
import { useEjectConfirm } from './ConfirmModal';
import { EmptyInfo } from './EmptyState';

export default function InfoManager() {
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const confirmEject = useEjectConfirm();

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
        successToast('Identity node updated successfully');
      } else {
        errorToast('Failed to update identity node');
      }
    } catch (error) {
      console.error('Failed to update info:', error);
      errorToast('Failed to update identity node');
    } finally {
      setSaving(false);
    }
  };

  const deleteInfo = async (id) => {
    const item = info.find(i => i.id === id);
    const confirmed = await confirmEject(item?.label);
    if (confirmed) {
      const updatedInfo = info.filter(item => item.id !== id);
      try {
        const res = await fetch('/api/admin/info', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedInfo),
        });
        if (res.ok) {
          setInfo(updatedInfo);
          successToast(`Identity node "${item?.label}" ejected`);
        } else {
          errorToast('Failed to eject identity node');
        }
      } catch (error) {
        console.error('Failed to delete info:', error);
        errorToast('Failed to eject identity node');
      }
    }
  };

  // Filter info based on search
  const filteredInfo = info.filter(i => 
    i.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.value?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="space-y-8 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-40 loading-shimmer rounded-xl" />
          <div className="h-4 w-56 loading-shimmer rounded-lg" />
        </div>
        <div className="h-10 w-10 loading-shimmer rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="admin-card !p-0 overflow-hidden">
            <div className="h-32 loading-shimmer" />
          </div>
        ))}
      </div>
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

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <h2 className="admin-title">Identity</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Personal Data Synchronization</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="search-input-wrapper w-64">
            <FiSearch className="search-icon" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input !h-10 !pl-10 !text-sm"
              placeholder="Search identity data..."
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="search-clear !w-6 !h-6"
              >
                <FiX size={12} />
              </button>
            )}
          </div>
          <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center bg-white/[0.02]">
            <FiShield className="text-indigo-400" size={18} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 text-[10px] text-slate-500">
          <span className="font-mono">{filteredInfo.length} identity nodes</span>
          {searchQuery && <span className="text-slate-600">/ {info.length} total</span>}
        </div>
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="text-[10px] text-slate-500 hover:text-[var(--first-color)] transition-colors"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Empty State */}
      {info.length === 0 ? (
        <EmptyInfo onAdd={() => successToast('Add identity feature coming soon')} />
      ) : filteredInfo.length === 0 ? (
        <div className="admin-card !p-12 text-center">
          <FiSearch className="mx-auto mb-4 text-slate-500" size={32} />
          <p className="text-slate-400 text-sm">No identity data matches "{searchQuery}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInfo.map((item, idx) => (
          <div
            key={item.id}
            className="admin-card group !p-0 overflow-hidden border-white/10 hover:border-[var(--first-color)]/40 bg-white/[0.03] transition-all duration-300"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="p-6">
               <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="w-8 h-8 rounded-lg bg-[var(--first-color)]/10 text-[var(--first-color)] flex items-center justify-center hover:bg-[var(--first-color)] hover:text-white transition-all"
                    >
                      <FiZap size={14} />
                    </button>
                    <button
                      onClick={() => deleteInfo(item.id)}
                      className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
               </div>
               <p className="text-lg font-bold tracking-tight text-white/90 mb-3 truncate">{item.value}</p>
               <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-[var(--first-color)]/30 group-hover:w-full group-hover:bg-[var(--first-color)] transition-all duration-500" />
               </div>
            </div>
          </div>
        ))}

        {/* Quick Add Node */}
        <div
          onClick={() => successToast('Add identity feature coming soon')}
          className="admin-card border-dashed border-white/20 hover:border-[var(--first-color)]/50 bg-white/[0.02] hover:bg-white/[0.04] flex flex-col items-center justify-center py-12 group cursor-pointer transition-all"
        >
           <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform bg-white/[0.03]">
              <FiPlus className="text-slate-400 group-hover:text-[var(--first-color)]" size={24} />
           </div>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-[var(--first-color)] transition-colors">Inject New Identity Data</p>
        </div>
        </div>
      )}
    </div>
  );
}
