'use client';

import { useState, useEffect, useRef } from 'react';
import { FiPlus, FiTrash2, FiCloudLightning, FiRefreshCw, FiCode, FiEdit3, FiSearch, FiX, FiCheck } from 'react-icons/fi';
import { useSuccessToast, useErrorToast } from './Toast';
import { useEjectConfirm } from './ConfirmModal';
import { EmptySkills } from './EmptyState';
import { Button, Input } from '@/components/ui';
import SkillEditModal from './SkillEditModal';
import { SkillCard } from './SkillCard';
import { useCallback } from 'react';

export default function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSkill, setEditingSkill] = useState(null);

  const modalRef = useRef(null);
  const newSkillInputRef = useRef(null);

  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const confirmEject = useEjectConfirm();

  // Fetch skills once on mount
  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  // Keyboard / click-outside listeners for the edit modal
  useEffect(() => {
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

  const fetchSkills = useCallback(async () => {
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
  }, [errorToast]);

  const handleUpdate = (id, value) => {
    setSkills(skills.map(s => s.id === id ? { ...s, title: value } : s));
  };

  const addSkill = useCallback(async () => {
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
  }, [newSkill, skills, fetchSkills, successToast, errorToast]);

  const removeSkill = useCallback(async (id) => {
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
  }, [skills, confirmEject, fetchSkills, successToast, errorToast]);

  const saveChanges = useCallback(async (manualData = null) => {
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
  }, [skills, fetchSkills, successToast, errorToast]);

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
      <SkillEditModal 
        skill={editingSkill}
        onClose={() => setEditingSkill(null)}
        onUpdate={handleUpdate}
        onSave={saveChanges}
        setSkill={setEditingSkill}
        saving={saving}
        modalRef={modalRef}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--admin-title)]">Matrix</h2>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Technical Proficiency Configuration</p>
        </div>
        <Button
          onClick={saveChanges}
          disabled={saving}
          className="matrix-primary-action flex items-center gap-2"
        >
          {saving ? <FiRefreshCw className="animate-spin" /> : <FiCloudLightning className="text-lg" />}
          {saving ? 'Transmitting...' : 'Commit Matrix'}
        </Button>
      </div>

      {/* Search & Add Section */}
      <div className="mb-8">
        <div className="matrix-toolbar grid gap-4 md:grid-cols-2">
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
                ref={newSkillInputRef}
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
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
          <div className="matrix-stat-strip flex items-center justify-between mt-4 pt-4 border-t border-t">
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
        <EmptySkills onAdd={() => newSkillInputRef.current?.focus()} />
      ) : filteredSkills.length === 0 ? (
        <div className="p-8 text-center">
          <FiSearch className="mx-auto mb-4 text-slate-500" size={32} />
          <p className="text-sm text-slate-400">No skills match "{searchQuery}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-4">
          {filteredSkills.map((skill, idx) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              index={idx}
              onEdit={setEditingSkill}
              onDelete={removeSkill}
            />
          ))}
        </div>
      )}
    </div>
  );
};