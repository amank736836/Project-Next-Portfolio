'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiCloudLightning, FiRefreshCw, FiCode } from 'react-icons/fi';

export default function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const [editingSkill, setEditingSkill] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/skills');
      const data = await res.json();
      setSkills(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (id, value) => {
    setSkills(skills.map(s => s.id === id ? { ...s, title: value } : s));
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    const skill = { id: Date.now(), title: newSkill.trim() };
    setSkills([...skills, skill]);
    setNewSkill('');
  };

  const removeSkill = (id) => {
    if (window.confirm('Eject this capability from matrix?')) {
      setSkills(skills.filter(s => s.id !== id));
    }
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skills),
      });
      if (res.ok) {
        setEditingSkill(null);
      }
    } catch (error) {
      console.error('Failed to save skills:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_20px_rgba(99,102,241,0.2)]" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Assembling Skill Matrix...</p>
    </div>
  );

  return (
    <div className="animate-fade-in relative">
      {/* Edit Dialog / Modal */}
      {editingSkill && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={() => setEditingSkill(null)} />
          <div className="admin-card w-full max-w-lg relative z-10 !p-0 overflow-hidden animate-slide-up shadow-[0_0_100px_rgba(0,0,0,0.8)] border-indigo-500/40">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-1">Matrix Refactoring // Node #{editingSkill.id.toString().slice(-4)}</p>
                <h3 className="text-xl font-black tracking-tight">{editingSkill.title}</h3>
              </div>
              <button onClick={() => setEditingSkill(null)} className="admin-icon-btn hover:!rotate-90">
                <FiZap className="rotate-45" />
              </button>
            </div>
            
            <div className="p-8">
              <div className="mb-6">
                 <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Skill Signature</label>
                 <input
                   autoFocus
                   type="text"
                   value={editingSkill.title}
                   onChange={(e) => {
                     handleUpdate(editingSkill.id, e.target.value);
                     setEditingSkill({ ...editingSkill, title: e.target.value });
                   }}
                   className="neon-input text-lg font-bold"
                   placeholder="Enter skill name..."
                 />
              </div>
              
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/5">
                <button 
                  onClick={() => setEditingSkill(null)}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors px-4"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveChanges}
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
          <h2 className="admin-title">Matrix</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Technical Proficiency Configuration</p>
        </div>
        <button 
          onClick={saveChanges}
          disabled={saving}
          className="admin-btn admin-btn-primary group"
        >
          {saving ? <FiRefreshCw className="animate-spin" /> : <FiCloudLightning className="text-lg" />}
          {saving ? 'Transmitting...' : 'Commit Matrix'}
        </button>
      </div>

      <div className="admin-card mb-12 !p-8 bg-white/[0.02]">
        <div className="flex gap-4">
          <div className="relative flex-1 group">
            <FiCode className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              className="neon-input pl-14 h-16 !bg-black/20"
              placeholder="Inject new capability (e.g. Web3, AI, LLMs)..."
            />
          </div>
          <button 
            onClick={addSkill}
            className="admin-btn admin-btn-secondary !px-10 hover:!bg-white hover:!text-black"
          >
            <FiPlus /> Inject
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {skills.map((skill, idx) => (
          <div 
            key={skill.id} 
            className={`admin-card !p-5 flex items-center justify-between group/chip stagger-${(idx % 5) + 1} border-white/5 hover:border-indigo-500/30 bg-white/[0.01] hover:bg-indigo-500/[0.02]`}
          >
            <span className="text-slate-300 font-bold text-[10px] uppercase tracking-[0.2em] truncate pr-2">{skill.title}</span>
            <div className="flex items-center gap-2 opacity-0 group-hover/chip:opacity-100 transition-opacity">
              <button 
                onClick={() => setEditingSkill(skill)}
                className="text-indigo-400 hover:text-white transition-colors"
                title="Refactor"
              >
                <FiZap size={14} />
              </button>
              <button 
                onClick={() => removeSkill(skill.id)}
                className="text-rose-500/60 hover:text-rose-500 transition-colors"
                title="Eject"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
