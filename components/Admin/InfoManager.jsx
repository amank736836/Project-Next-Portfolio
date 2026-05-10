'use client';

import { useState, useEffect } from 'react';
import { FiZap, FiRefreshCw, FiCheckCircle, FiInfo, FiTrash2, FiShield, FiCloudLightning, FiPlus, FiSearch, FiX, FiEdit3 } from 'react-icons/fi';
import { useSuccessToast, useErrorToast } from './Toast';
import { useEjectConfirm } from './ConfirmModal';
import { EmptyInfo } from './EmptyState';
import { calculateAge } from '@/lib/utils';

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
      const mappedData = Array.isArray(data) ? data.map(item => ({
        ...item,
        id: item.key,
        label: item.title || item.key,
        value: item.description || ''
      })) : [];
      setInfo(mappedData);
    } catch (error) {
      console.error('Failed to fetch info:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInfo = async (id, newValue) => {
    setSaving(true);
    try {
      const updatedInfo = info.map(item => item.id === id ? { ...item, value: newValue, description: newValue } : item);
      // API expects the original structure for PUT
      const apiPayload = updatedInfo.map(item => ({
        key: item.id,
        title: item.title,
        description: item.description
      }));
      const res = await fetch('/api/admin/info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiPayload),
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

  const addInfo = async () => {
    setSaving(true);
    try {
      const draft = {
        key: `custom_${Date.now()}`,
        title: 'Custom Field',
        description: 'Edit me',
      };

      const res = await fetch('/api/admin/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });

      if (res.ok) {
        const created = await res.json();
        const mapped = {
          ...created,
          id: created.key,
          label: created.title || created.key,
          value: created.description || '',
        };
        setInfo((current) => [...current, mapped]);
        setEditingItem(mapped);
        successToast('Identity node added successfully');
      } else {
        errorToast('Failed to add identity node');
      }
    } catch (error) {
      console.error('Failed to add info:', error);
      errorToast('Failed to add identity node');
    } finally {
      setSaving(false);
    }
  };

  const deleteInfo = async (id) => {
    const item = info.find(i => i.id === id);
    const confirmed = await confirmEject(item?.label);
    if (confirmed) {
      const updatedInfo = info.filter(item => item.id !== id);
      const apiPayload = updatedInfo.map(item => ({
        key: item.id,
        title: item.title,
        description: item.description
      }));
      try {
        const res = await fetch('/api/admin/info', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiPayload),
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
      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#030712]/80 backdrop-blur-md" onClick={() => setEditingItem(null)} />
          <div className="admin-card w-full max-w-lg relative z-10 !p-0 overflow-hidden !rounded-[2rem] border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-transparent p-8 border-b border-white/[0.05]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <FiZap size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Modify Identity Node</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Field: {editingItem.label}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                  Value {editingItem.id === 'age' && <span className="text-indigo-400 normal-case ml-2">(Enter DOB as DD/MM/YYYY for dynamic age)</span>}
                </label>
                {editingItem.id === 'about_description' || editingItem.id === 'address' ? (
                  <textarea
                    autoFocus
                    rows={editingItem.id === 'about_description' ? 6 : 3}
                    value={editingItem.value}
                    onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
                  />
                ) : (
                  <input
                    autoFocus
                    type="text"
                    value={editingItem.value}
                    onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && updateInfo(editingItem.id, editingItem.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-6 py-3 rounded-xl text-xs font-bold text-slate-500 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateInfo(editingItem.id, editingItem.value)}
                  disabled={saving}
                  className="px-8 py-3 rounded-xl bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-[0_4px_15px_rgba(99,102,241,0.3)]"
                >
                  {saving ? <FiRefreshCw className="animate-spin" size={14} /> : <FiCloudLightning size={14} />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter">Identity</h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Core Profile Data Matrix</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="input-icon-wrapper w-72">
            <FiSearch className="icon" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-10 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/40 focus:ring-4 focus:ring-indigo-500/5 transition-all w-full"
              placeholder="Search identity..."
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <FiX size={14} />
              </button>
            )}
          </div>
          <button
            onClick={addInfo}
            className="w-12 h-12 rounded-2xl border border-white/[0.05] flex items-center justify-center bg-white/[0.02] text-indigo-400 shadow-inner hover:bg-white/[0.05] transition-colors"
            title="Add identity node"
          >
            <FiPlus size={20} />
          </button>
        </div>
      </div>

      {/* Grid */}
      {info.length === 0 ? (
        <EmptyInfo onAdd={addInfo} />
      ) : filteredInfo.length === 0 ? (
        <div className="admin-card mb-12 !p-8 bg-white/[0.02] text-center !rounded-[1.5rem]">
          <div className="w-16 h-16 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center mx-auto mb-6">
            <FiSearch className="text-slate-600" size={32} />
          </div>
          <p className="text-slate-400 text-lg font-medium">No results for "{searchQuery}"</p>
          <button onClick={() => setSearchQuery('')} className="mt-4 text-indigo-400 font-bold text-xs uppercase tracking-widest hover:text-indigo-300">Clear Search</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          {filteredInfo.map((item, idx) => (
          <div
            key={item.id}
            className="admin-card group !p-6 overflow-hidden border-white/[0.05] hover:border-indigo-500/30 bg-white/[0.02] hover:bg-white/[0.06] transition-all duration-500 !rounded-[1.5rem]"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
             <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest" dangerouslySetInnerHTML={{ __html: item.label }} />
                  <div className="h-1 w-8 bg-indigo-500/30 rounded-full group-hover:w-full transition-all duration-700" />
                </div>
                <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all border border-indigo-500/20 shadow-lg hover:shadow-indigo-500/20"
                    title="Edit"
                  >
                    <FiEdit3 size={18} />
                  </button>
                  <button
                    onClick={() => deleteInfo(item.id)}
                    className="w-11 h-11 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 shadow-lg hover:shadow-rose-500/20"
                    title="Delete"
                  >
                    <FiTrash2 size={22} />
                  </button>
                </div>
             </div>
             <div 
               className={`text-lg font-bold text-white tracking-tight mb-4 transition-all duration-500 ${item.id === 'about_description' ? 'line-clamp-2 group-hover:line-clamp-none' : ''}`}
               dangerouslySetInnerHTML={{ __html: item.id === 'age' && item.value.includes('/') ? calculateAge(item.value) + ' Years' : item.value }} 
             />
             <p className="text-[9px] text-slate-600 font-medium uppercase tracking-tighter">
               Synchronized: {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'Secure'}
             </p>
          </div>
        ))}

        {/* Quick Add Node */}
        <button
          onClick={() => successToast('Add identity feature coming soon')}
          className="admin-card border-2 border-dashed border-white/5 hover:border-indigo-500/30 bg-white/[0.01] hover:bg-white/[0.03] flex flex-col items-center justify-center py-8 group transition-all !rounded-[1.5rem]"
        >
           <div className="w-14 h-14 rounded-2xl border border-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform bg-white/[0.02] text-slate-600 group-hover:text-indigo-400 group-hover:border-indigo-500/20">
              <FiPlus size={28} />
           </div>
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-indigo-300 transition-colors">Inject Identity Node</p>
        </button>
        </div>
      )}
    </div>
  );
}
