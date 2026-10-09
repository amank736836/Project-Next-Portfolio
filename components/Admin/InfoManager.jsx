'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { FiZap, FiRefreshCw, FiCheckCircle, FiInfo, FiTrash2, FiShield, FiCloudLightning, FiPlus, FiSearch, FiX, FiEdit3, FiEye, FiEyeOff, FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiCode, FiServer, FiDatabase, FiCpu, FiSettings, FiCreditCard, FiGrid, FiList } from 'react-icons/fi';
import { useSuccessToast, useErrorToast } from './Toast';
import { useEjectConfirm } from './ConfirmModal';
import { EmptyInfo } from './EmptyState';
import { calculateAge } from '@/lib/utils';
import IdentityModal from './IdentityModal';
import { IdentityCard, IdentityEmptySearch, IdentitySection, IdentityFieldRow } from './IdentityCard';

const FIELD_GROUPS = [
  {
    id: 'personal',
    label: 'Personal Information',
    icon: FiUser,
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    fields: [
      { id: 'firstName', label: 'First Name', icon: FiUser },
      { id: 'lastName', label: 'Last Name', icon: FiUser },
      { id: 'fullName', label: 'Full Name', icon: FiUser },
      { id: 'age', label: 'Age', icon: FiCpu },
      { id: 'about_description', label: 'About Description', icon: FiInfo },
      { id: 'bio', label: 'Bio', icon: FiInfo },
    ]
  },
  {
    id: 'contact',
    label: 'Contact Details',
    icon: FiMail,
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    fields: [
      { id: 'email', label: 'Email', icon: FiMail },
      { id: 'phone', label: 'Phone', icon: FiPhone },
      { id: 'location', label: 'Location', icon: FiMapPin },
      { id: 'website', label: 'Website', icon: FiGlobe },
      { id: 'github', label: 'GitHub', icon: FiCode },
      { id: 'linkedin', label: 'LinkedIn', icon: FiServer },
      { id: 'twitter', label: 'Twitter/X', icon: FiCpu },
    ]
  },
  {
    id: 'site',
    label: 'Site Configuration',
    icon: FiSettings,
    color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    fields: [
      { id: 'site_title', label: 'Site Title', icon: FiGlobe },
      { id: 'site_description', label: 'Site Description', icon: FiInfo },
      { id: 'hero_title', label: 'Hero Title', icon: FiZap },
      { id: 'hero_subtitle', label: 'Hero Subtitle', icon: FiZap },
      { id: 'default_theme_color', label: 'Default Theme Color', icon: FiShield },
      { id: 'default_theme_mode', label: 'Default Theme Mode', icon: FiShield },
    ]
  }
];

function getFieldGroup(fieldId) {
  for (const group of FIELD_GROUPS) {
    const found = group.fields.find(f => f.id === fieldId);
    if (found) return { group, fieldConfig: found };
  }
  return { group: FIELD_GROUPS[0], fieldConfig: { id: fieldId, label: fieldId, icon: FiSettings } };
}

function sanitize(html) {
  const DOMPurify = require('isomorphic-dompurify');
  return DOMPurify.sanitize(html ?? '', { ALLOWED_TAGS: ['span', 'b', 'i', 'em', 'strong', 'br'], ALLOWED_ATTR: ['class'] });
}

export default function InfoManager() {
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  
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
          value: item.description || '',
          is_hidden: item.is_hidden || false
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
        const draft = {
          key: id,
          title: newLabel?.trim() || 'Custom Field',
          description: newValue,
          is_hidden: false,
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
            is_hidden: created.is_hidden || false
          };
          setInfo(current => [...current, mapped]);
          setEditingItem(null);
          successToast(`Identity node "${mapped.label}" created successfully`);
        } else {
          errorToast('Failed to create identity node');
        }
      } else {
        const updatedInfo = info.map(item =>
          item.id === id ? { ...item, value: newValue, description: newValue, is_hidden: item.is_hidden } : item
        );
        const apiPayload = updatedInfo.map(item => ({
          key: item.id,
          title: item.title,
          description: item.description,
          is_hidden: item.is_hidden
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
      is_hidden: false,
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

  const toggleVisibility = useCallback(async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/info?key=${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_hidden: !currentStatus }),
      });
      if (res.ok) {
        setInfo(current => current.map(item => 
          item.id === id ? { ...item, is_hidden: !currentStatus } : item
        ));
        successToast(currentStatus ? 'Node is now visible' : 'Node is now hidden');
      } else {
        errorToast('Failed to update visibility');
      }
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
      errorToast('Failed to update visibility');
    }
  }, [successToast, errorToast]);

  const filteredInfo = useMemo(() => 
    info.filter(i => 
      i.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.value?.toLowerCase().includes(searchQuery.toLowerCase())
    ), [info, searchQuery]);

  const groupedInfo = useMemo(() => {
    const groups = {};
    
    for (const item of filteredInfo) {
      const { group } = getFieldGroup(item.id);
      if (!groups[group.id]) {
        groups[group.id] = { ...group, items: [] };
      }
      groups[group.id].items.push(item);
    }

    return FIELD_GROUPS.map(g => groups[g.id]).filter(Boolean);
  }, [filteredInfo]);

  const hasAnyResults = groupedInfo.some(g => g.items.length > 0);

  if (loading) return (
    <div className="space-y-8 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-40 loading-shimmer rounded-xl" />
          <div className="h-4 w-56 loading-shimmer rounded-lg" />
        </div>
        <div className="h-10 w-10 loading-shimmer rounded-full" />
      </div>
      {FIELD_GROUPS.map(group => (
        <div key={group.id} className="space-y-4 animate-fade-in">
          <div className="h-10 loading-shimmer rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2].map(i => (
              <div key={i} className="admin-card !p-0 overflow-hidden">
                <div className="h-28 loading-shimmer" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="animate-fade-in relative">
      <IdentityModal 
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={updateInfo}
        setItem={setEditingItem}
        saving={saving}
      />

      <div className="flex flex-col items-start gap-6 mb-6">
        <div>
          <h2 className="text-3xl font-black text-[var(--admin-title)] tracking-tighter">Identity</h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Core Profile Data Matrix</p>
        </div>
        <div className="flex w-full items-center gap-3 sm:gap-4">
          <div className="input-icon-wrapper min-w-0 flex-1">
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
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-white/10 text-[var(--first-color)]' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'}`}
              title="Grid view"
            >
              <FiGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-white/10 text-[var(--first-color)]' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'}`}
              title="List view"
            >
              <FiList size={18} />
            </button>
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

      {info.length === 0 ? (
        <EmptyInfo onAdd={addInfo} />
      ) : !hasAnyResults ? (
        <IdentityEmptySearch query={searchQuery} onClear={() => setSearchQuery('')} />
      ) : (
        <div className="mt-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredInfo.map((item, idx) => (
                <IdentityCard
                  key={item.id}
                  item={item}
                  index={idx}
                  onEdit={setEditingItem}
                  onDelete={deleteInfo}
                  onToggleVisibility={() => toggleVisibility(item.id, item.is_hidden)}
                  isHidden={item.is_hidden}
                />
              ))}

              <button
                onClick={addInfo}
                className="admin-card identity-card identity-add-card holographic-card border-2 border-dashed border-white/5 hover:border-indigo-500/30 bg-white/[0.01] hover:bg-white/[0.03] flex items-center justify-center gap-4 group transition-all !rounded-[1.5rem]"
              >
                <div className="w-14 h-14 shrink-0 rounded-2xl border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform bg-white/[0.02] text-slate-600 group-hover:text-indigo-400 group-hover:border-indigo-500/20">
                  <FiPlus size={28} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-[var(--admin-title)] uppercase tracking-wider">Add Identity Node</p>
                  <p className="mt-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-indigo-300 transition-colors">Create a new profile field</p>
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Personal */}
              {(() => {
                const personalGroup = groupedInfo.find(g => g.id === 'personal');
                return personalGroup?.items?.length ? (
                  <div className="admin-card identity-card !p-4 overflow-hidden border-white/[0.05] hover:border-indigo-500/30 bg-white/[0.015] hover:bg-white/[0.03] transition-all duration-500 !rounded-[1.5rem]" key="personal">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          <FiUser size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-[var(--admin-title)] tracking-tight">Personal Information</h3>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Identity Details</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{personalGroup.items.length} fields</span>
                    </div>
                    <div className="space-y-1">
                      {personalGroup.items.map((item, itemIdx) => {
                        const { fieldConfig } = getFieldGroup(item.id);
                        return (
                          <IdentityFieldRow
                            key={item.id}
                            item={item}
                            fieldConfig={fieldConfig}
                            index={itemIdx}
                            onEdit={setEditingItem}
                            onDelete={deleteInfo}
                            onToggleVisibility={() => toggleVisibility(item.id, item.is_hidden)}
                            isHidden={item.is_hidden}
                          />
                        );
                      })}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Contact */}
              {(() => {
                const contactGroup = groupedInfo.find(g => g.id === 'contact');
                return contactGroup?.items?.length ? (
                  <div className="admin-card identity-card !p-4 overflow-hidden border-white/[0.05] hover:border-indigo-500/30 bg-white/[0.015] hover:bg-white/[0.03] transition-all duration-500 !rounded-[1.5rem]" key="contact">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center border bg-blue-500/20 text-blue-400 border-blue-500/30">
                          <FiMail size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-[var(--admin-title)] tracking-tight">Contact Details</h3>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Communication Channels</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{contactGroup.items.length} fields</span>
                    </div>
                    <div className="space-y-1">
                      {contactGroup.items.map((item, itemIdx) => {
                        const { fieldConfig } = getFieldGroup(item.id);
                        return (
                          <IdentityFieldRow
                            key={item.id}
                            item={item}
                            fieldConfig={fieldConfig}
                            index={itemIdx}
                            onEdit={setEditingItem}
                            onDelete={deleteInfo}
                            onToggleVisibility={() => toggleVisibility(item.id, item.is_hidden)}
                            isHidden={item.is_hidden}
                          />
                        );
                      })}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Site Configuration */}
              {(() => {
                const siteGroup = groupedInfo.find(g => g.id === 'site');
                return siteGroup?.items?.length ? (
                  <div className="admin-card identity-card !p-4 overflow-hidden border-white/[0.05] hover:border-indigo-500/30 bg-white/[0.015] hover:bg-white/[0.03] transition-all duration-500 !rounded-[1.5rem]" key="site">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center border bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                          <FiSettings size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-[var(--admin-title)] tracking-tight">Site Configuration</h3>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">System Settings</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{siteGroup.items.length} fields</span>
                    </div>
                    <div className="space-y-1">
                      {siteGroup.items.map((item, itemIdx) => {
                        const { fieldConfig } = getFieldGroup(item.id);
                        return (
                          <IdentityFieldRow
                            key={item.id}
                            item={item}
                            fieldConfig={fieldConfig}
                            index={itemIdx}
                            onEdit={setEditingItem}
                            onDelete={deleteInfo}
                            onToggleVisibility={() => toggleVisibility(item.id, item.is_hidden)}
                            isHidden={item.is_hidden}
                          />
                        );
                      })}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Add new button */}
              <div className="admin-card identity-card holographic-card border-2 border-dashed border-white/5 hover:border-indigo-500/30 bg-white/[0.01] hover:bg-white/[0.03] flex items-center justify-center gap-2 py-6 group transition-all !rounded-[1.5rem]" onClick={addInfo}>

(Showing lines 360-459 of 469. Use offset=460 to continue.)
                <FiPlus size={18} className="group-hover:rotate-90 transition-transform" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-indigo-300 transition-colors">Inject Identity Node</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
