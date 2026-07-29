'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiChevronDown, FiLoader } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const COMMON_EMOJIS = ['⚛', '🟢', '☕', '🍃', '💨', '🔷', '📜', '🌐', '🎨', '▲', '🔄', '📡', '🚂', '🌱', '🐍', '🐹', '🐘', '🐬', '⚡', '🔮', '☁', '🐳', '☸', '📦', '⚙', '🔧', '⚡', '🦀', '⭐', '💎', '🚀', '🔥', '⚡'];
const COLOR_SWATCHES = ['#84CC16', '#61DAFB', '#339933', '#ED8B00', '#47A248', '#06B6D4', '#3178C6', '#F7DF1E', '#E34F26', '#1572B6', '#764ABC', '#FF4154', '#000000', '#6DB33F', '#3776AB', '#00ADD8', '#336791', '#4479A1', '#DC382D', '#2D3748', '#FF9900', '#2496ED', '#326CE5', '#F05032', '#2088FF', '#A8B9CC', '#00599C', '#DEA584', '#6B7280'];

export default function EditSkillForm({ editingSkill, setEditingSkill, categories, onSave, onRequestClose, saving, modalRef }) {
  const [form, setForm] = useState({
    title: '',
    percentage: 85,
    category: 'General',
    icon: '⭐',
    color: '#84CC16',
    is_featured: false,
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const colorPickerRef = useRef(null);

  useEffect(() => {
    if (editingSkill) {
      setForm({
        title: editingSkill.title || '',
        percentage: editingSkill.percentage || 85,
        category: editingSkill.category || 'General',
        icon: editingSkill.icon || '⭐',
        color: editingSkill.color || '#84CC16',
        is_featured: editingSkill.is_featured || false,
      });
    } else {
      setForm({
        title: '',
        percentage: 85,
        category: 'General',
        icon: '⭐',
        color: '#84CC16',
        is_featured: false,
      });
    }
  }, [editingSkill]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) setShowEmojiPicker(false);
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) setShowColorPicker(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...editingSkill, ...form });
    onRequestClose();
  };

  const handleClose = () => {
    setForm({ title: '', percentage: 85, category: 'General', icon: '⭐', color: '#84CC16', is_featured: false });
    setShowEmojiPicker(false);
    setShowColorPicker(false);
    onRequestClose();
  };

  const isValid = form.title.trim().length > 0;

  const modalContent = (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-skill-title"
    >
      <div className="bg-[var(--container-color)] border border-white/10 rounded-2xl sm:rounded-3xl w-full max-w-md sm:max-w-lg overflow-hidden animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10">
          <h3 id="edit-skill-title" className="text-lg sm:text-xl font-bold text-[var(--admin-title)]">
            {editingSkill?.id ? 'Edit Skill' : 'New Skill'}
          </h3>
          <Button variant="outline" size="icon" onClick={handleClose} className="text-slate-500 hover:text-white">
            <FiX size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 sm:space-y-5 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Skill Name</label>
            <Input
              type="text"
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              placeholder="e.g., React, TypeScript, Node.js"
              className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 py-2 text-sm text-white focus:border-[var(--admin-accent)] focus:outline-none"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Proficiency %</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={form.percentage}
                onChange={(e) => setForm({...form, percentage: parseInt(e.target.value) || 0})}
                className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 py-2 text-sm text-white focus:border-[var(--admin-accent)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({...form, category: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 py-2 text-sm text-white focus:border-[var(--admin-accent)] focus:outline-none appearance-none"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Icon (emoji)</label>
              <div className="relative" ref={emojiPickerRef}>
                <button
                  type="button"
                  onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowColorPicker(false); }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 py-2 text-2xl text-center flex items-center justify-center gap-2 focus:border-[var(--admin-accent)] focus:outline-none transition-colors"
                >
                  {form.icon}
                  <FiChevronDown size={16} className="text-slate-500" />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-[var(--container-color)] border border-white/10 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                    <div className="grid grid-cols-8 gap-2">
                      {COMMON_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => { setForm({...form, icon: emoji}); setShowEmojiPicker(false); }}
                          className={`p-2 rounded-lg text-2xl transition-colors ${form.icon === emoji ? 'bg-[var(--admin-accent)]/30 ring-1 ring-[var(--admin-accent)]' : 'hover:bg-white/5'}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Color</label>
              <div className="relative" ref={colorPickerRef}>
                <button
                  type="button"
                  onClick={() => { setShowColorPicker(!showColorPicker); setShowEmojiPicker(false); }}
                  className="w-full h-10 rounded-lg sm:rounded-xl border border-white/10 cursor-pointer flex items-center justify-center gap-2 transition-colors focus:border-[var(--admin-accent)] focus:outline-none"
                  style={{backgroundColor: form.color}}
                >
                  <span className="text-xs font-mono text-slate-400">{form.color.toUpperCase()}</span>
                  <FiChevronDown size={16} className="text-slate-500" />
                </button>
                {showColorPicker && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-[var(--container-color)] border border-white/10 rounded-xl shadow-2xl z-50">
                    <div className="grid grid-cols-6 gap-2 mb-2">
                      {COLOR_SWATCHES.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => { setForm({...form, color}); setShowColorPicker(false); }}
                          className={`w-8 h-8 rounded-lg border-2 transition-all ${form.color === color ? 'border-[var(--admin-accent)] scale-110' : 'border-transparent hover:border-white/20'}`}
                          style={{backgroundColor: color}}
                          title={color}
                        />
                      ))}
                    </div>
                    <Input
                      type="text"
                      value={form.color}
                      onChange={(e) => setForm({...form, color: e.target.value})}
                      placeholder="#RRGGBB"
                      className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 py-2 text-sm text-white focus:border-[var(--admin-accent)] focus:outline-none text-center font-mono"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="featured-checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({...form, is_featured: e.target.checked})}
              className="w-4 h-4 accent-[var(--admin-accent)] mt-0.5"
            />
            <label htmlFor="featured-checkbox" className="text-sm font-medium text-slate-300 cursor-pointer">
              Featured in Hero Badges (max 5)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" type="button" onClick={handleClose} className="flex-1" disabled={saving}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={saving || !isValid}
              style={{
                backgroundColor: isValid && !saving ? '#84CC16' : undefined,
                borderColor: isValid && !saving ? '#84CC16' : undefined,
                color: isValid && !saving ? '#000' : undefined,
              }}
            >
              {saving ? 'Saving...' : (editingSkill?.id ? 'Update Skill' : 'Add Skill')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof window !== 'undefined' && editingSkill ? createPortal(modalContent, document.body) : null;
}