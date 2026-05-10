'use client';

import { useState, useEffect, useRef } from 'react';
import { FiPlus, FiTrash2, FiCloudLightning, FiRefreshCw, FiCode, FiEdit3, FiSearch, FiX, FiCheck } from 'react-icons/fi';
import { useSuccessToast, useErrorToast } from './Toast';
import { useEjectConfirm } from './ConfirmModal';
import { EmptySkills } from './EmptyState';
import { Button, Input } from '@/components/ui';

export default function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSkill, setEditingSkill] = useState(null);

  const modalRef = useRef(null);

  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const confirmEject = useEjectConfirm();

  useEffect(() => {
    fetchSkills();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setEditingSkill(null);
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setEditingSkill(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    if (editingSkill) {
      window.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingSkill]);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/skills');
      const data = await res.json();
      setSkills(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
      errorToast('Failed to load skill matrix');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (id, value) => {
    setSkills(skills.map(s => s.id === id ? { ...s, title: value } : s));
  };

  const addSkill = async () => {
    if (!newSkill.trim()) return;
    setSaving(true);
    const skill = { title: newSkill.trim() };
    const updatedSkills = [...skills, skill].map(({ title }) => ({ title })); // Clean IDs for re-insert

    try {
      const res = await fetch('/api/admin/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSkills),
      });
      if (res.ok) {
        setNewSkill('');
        await fetchSkills();
        successToast(`Skill "${skill.title}" synchronized to database`);
      } else {
        errorToast('Failed to add skill');
      }
    } catch (error) {
      console.error('Failed to add skill:', error);
      errorToast('Failed to synchronize matrix');
    } finally {
      setSaving(false);
    }
  };

  const removeSkill = async (id) => {
    const skill = skills.find(s => s.id === id);
    const confirmed = await confirmEject(skill?.title);
    if (confirmed) {
      setSaving(true);
      const updatedSkills = skills.filter(s => s.id !== id).map(({ title }) => ({ title }));
      try {
        const res = await fetch('/api/admin/skills', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSkills),
        });
        if (res.ok) {
          await fetchSkills();
          successToast(`Skill "${skill?.title}" removed from matrix`);
        } else {
          errorToast('Failed to remove skill');
        }
      } catch (error) {
        errorToast('Failed to synchronize matrix');
      } finally {
        setSaving(false);
      }
    }
  };

  const saveChanges = async (manualData = null) => {
    // If called from an event handler, manualData will be the event object.
    // We only want to use it if it's an array of skills.
    const data = Array.isArray(manualData) ? manualData : skills;

    setSaving(true);
    const dataToSave = data.map(({ title }) => ({ title }));
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });
      if (res.ok) {
        setEditingSkill(null);
        await fetchSkills();
        successToast('Matrix synchronized successfully');
      } else {
        errorToast('Failed to synchronize matrix');
      }
    } catch (error) {
      console.error('Failed to save skills:', error);
      errorToast('Failed to synchronize matrix');
    } finally {
      setSaving(false);
    }
  };

  // Filter skills based on search
  const filteredSkills = skills.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="space-y-8 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-32 animate-pulse" />
          <div className="h-4 w-48 animate-pulse" />
        </div>
        <div className="h-12 w-40 animate-pulse" />
      </div>
      <div className="p-8">
        <div className="h-16 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6,7,8,10].map(i => (
          <div key={i} className="h-14 animate-pulse" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in relative">
      {/* Edit Dialog / Modal */}
      {editingSkill && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" />
          <div
            ref={modalRef}
            className="w-full max-w-lg relative z-10 p-0 overflow-hidden animate-slide-up shadow-[0_0_100px_rgba(0,0,0,0.8)] border-border/50"
          >
            <div className="p-10 border-b border-border/50 flex items-center justify-between bg-background/50">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                  Matrix Refactoring // Node #{editingSkill.id.toString().slice(-4)}
                </p>
                <h3 className="text-xl font-bold tracking-tight">{editingSkill.title}</h3>
              </div>
              <button onClick={() => setEditingSkill(null)} className="hover:rotate-90 transition-transform">
                <FiX />
              </button>
            </div>

            <div className="p-10">
              <div className="mb-6">
                 <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 block">Skill Signature</label>
                 <Input
                   autoFocus
                   type="text"
                   value={editingSkill.title}
                   onChange={(e) => {
                     handleUpdate(editingSkill.id, e.target.value);
                     setEditingSkill({ ...editingSkill, title: e.target.value });
                   }}
                   className="w-full text-lg font-bold"
                   placeholder="Enter skill name..."
                 />
              </div>

              <div className="flex items-center justify-end gap-4 pt-6 border-t border-border/50">
                <button
                  onClick={() => setEditingSkill(null)}
                  className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors px-4 py-2"
                >
                  Cancel
                </button>
                <Button
                  onClick={saveChanges}
                  disabled={saving}
                  className="px-10 py-4"
                >
                  {saving ? <FiRefreshCw className="animate-spin" /> : <FiCloudLightning />}
                  {saving ? 'Synchronizing...' : 'Update Matrix'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Matrix</h2>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Technical Proficiency Configuration</p>
        </div>
        <Button
          onClick={saveChanges}
          disabled={saving}
          className="flex items-center gap-2"
        >
          {saving ? <FiRefreshCw className="animate-spin" /> : <FiCloudLightning className="text-lg" />}
          {saving ? 'Transmitting...' : 'Commit Matrix'}
        </Button>
      </div>

      {/* Search & Add Section */}
      <div className="mb-8">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Search */}
          <div className="input-icon-wrapper">
            <FiSearch className="icon" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input"
              placeholder="Search capabilities..."
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-500 hover:text-white"
              >
                <FiX size={14} />
              </Button>
            )}
          </div>

          {/* Add New */}
          <div className="flex gap-3 flex-1 sm:flex-none">
            <div className="input-icon-wrapper sm:w-64">
              <FiCode className="icon" size={18} />
              <Input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                className="admin-input"
                placeholder="New skill..."
              />
            </div>
            <Button
              onClick={addSkill}
              disabled={!newSkill.trim()}
              className="flex-1 sm:flex-none px-6 py-2"
            >
              <FiPlus />
              <span className="hidden sm:inline">Inject</span>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-t">
            <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
              <span className="font-mono">{filteredSkills.length} capabilities</span>
              {searchQuery && (
                <span className="text-slate-600">/ {skills.length} total</span>
              )}
            </div>
            {searchQuery && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSearchQuery('')}
                className="-ml-2"
              >
                Clear search
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {skills.length === 0 ? (
        <EmptySkills onAdd={() => document.querySelector('.pl-12')?.focus()} />
      ) : filteredSkills.length === 0 ? (
        <div className="p-8 text-center">
          <FiSearch className="mx-auto mb-4 text-slate-500" size={32} />
          <p className="text-sm text-slate-400">No skills match "{searchQuery}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-4">
          {filteredSkills.map((skill, idx) =>
          <div
            key={skill.id}
            className="group admin-card p-6 hover:border-indigo-500/40 bg-background/50 hover:bg-background/10 transition-all duration-500 animate-fade-in"
            style={{ animationDelay: `${idx * 40}ms` }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs shadow-inner">
                  {idx + 1}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                    {skill.title}
                  </h4>
                  <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">
                    {skill.category || 'Capability'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setEditingSkill(skill)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/5 text-indigo-400 border-none hover:bg-indigo-500/10 transition-all"
                  title="Edit"
                >
                  <FiEdit3 size={16} />
                </button>
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="w-11 h-11 rounded-xl flex items-center justify-center bg-rose-500/5 text-rose-400 border-none hover:bg-rose-500/10 transition-all shadow-lg hover:shadow-rose-500/10"
                  title="Delete"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>

            {/* Subtle Progress Indicator */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
               <div className="flex gap-1">
                  {[1,2,3].map(i => (
                    <div key={i} className={`h-1 w-4 rounded-full ${i <= 2 ? 'bg-indigo-500/40' : 'background/50'}`} />
                  ))}
               </div>
               <span className="text-xs text-slate-600 font-medium uppercase tracking-tighter">
                 Modified: {skill.updated_at ? new Date(skill.updated_at).toLocaleDateString() : 'Just Now'}
               </span>
            </div>
          </div>
          )}
        </div>
      )}
    </div>
  );
};