'use client';

import { useState, useEffect } from 'react';
import { FiZap, FiRefreshCw, FiCheckCircle, FiInfo, FiTrash2, FiShield, FiCloudLightning, FiPlus, FiSearch, FiX, FiEdit3 } from 'react-icons/fi';
import { useSuccessToast, useErrorToast } from './Toast';
import { useEjectConfirm } from './ConfirmModal';
import { EmptyInfo } from './EmptyState';
import { calculateAge } from '@/lib/utils';
import IdentityModal from './IdentityModal';
import { IdentityCard, IdentityEmptySearch } from './IdentityCard';
import { useCallback } from 'react';

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

  async function fetchInfo() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/info');
      const data = await res.json();
      const mappedData = Array.isArray(data) ? data
        .filter(item => !item.key.startsWith('default_theme_'))
        .map(item => ({
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
  }

  const updateInfo = useCallback(async (id, newValue, newLabel) => {
    setSaving(true);
    try {
      const existingItem = info.find(i => i.id === id);

      if (!existingItem) {
        // New item — POST
        const draft = {
          key: id,
          title: newLabel?.trim() || 'Custom Field',
          description: newValue,
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
          setInfo(current => [...current, mapped]);
          setEditingItem(null);
          successToast(`Identity node "${mapped.label}" created successfully`);
        } else {
          errorToast('Failed to create identity node');
        }
      } else {
        // Existing item — PUT (full overwrite)
        const updatedInfo = info.map(item =>
          item.id === id ? { ...item, value: newValue, description: newValue } : item
        );
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
      }
    } catch (error) {
      console.error('Failed to save info:', error);
      errorToast('Failed to save identity node');
    } finally {
      setSaving(false);
    }
  }, [info, successToast, errorToast]);

  const addInfo = useCallback(() => {
    setEditingItem({
      isNew: true,
      id: `custom_${Date.now()}`,
      label: '',
      value: '',
      title: '',
      description: '',
    });
  }, []);

  const deleteInfo = useCallback(async (id) => {
    const item = info.find(i => i.id === id);
    const confirmed = await confirmEject(item?.label);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/info?key=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setInfo(prev => prev.filter(i => i.id !== id));
        successToast(`Identity node "${item?.label}" ejected`);
      } else {
        const err = await res.json().catch(() => ({}));
        errorToast(err.error || 'Failed to eject identity node');
      }
    } catch (error) {
      console.error('Failed to delete info:', error);
      errorToast('Network error while ejecting identity node');
    }
  }, [info, confirmEject, successToast, errorToast]);


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
      <IdentityModal 
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={updateInfo}
        setItem={setEditingItem}
        saving={saving}
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
        <div>
          <h2 className="text-3xl font-black text-[var(--admin-title)] tracking-tighter">Identity</h2>
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
        <IdentityEmptySearch query={searchQuery} onClear={() => setSearchQuery('')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          {filteredInfo.map((item, idx) => (
            <IdentityCard
              key={item.id}
              item={item}
              index={idx}
              onEdit={setEditingItem}
              onDelete={deleteInfo}
            />
          ))}

        {/* Quick Add Node */}
        <button
          onClick={addInfo}
          className="admin-card identity-card holographic-card border-2 border-dashed border-white/5 hover:border-indigo-500/30 bg-white/[0.01] hover:bg-white/[0.03] flex flex-col items-center justify-center py-8 group transition-all !rounded-[1.5rem]"
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
