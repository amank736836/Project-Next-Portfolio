'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiChevronDown, FiLoader, FiX as FiClose, FiCheck, FiPalette, FiMaximize } from 'react-icons/fi';
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
      <div className="bg-[var(--container-color)] border border-white/10 rounded-2xl sm:rounded-3xl w-full max-w-lg overflow-hidden animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h3 id="edit-skill-title" className="text-xl font-bold text-[var(--admin-title)]">
            {editingSkill?.id ? 'Edit Skill' : 'New Skill'}
          </h3>
          <Button variant="outline" size="icon" onClick={handleClose} className="text-slate-500 hover:text-white">
            <FiX size={22} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-6 max-h-[85vh] overflow-y-auto">
          {/* Skill Name */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Skill Name</label>
            <Input
              type="text"
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              placeholder="e.g., React, TypeScript, Node.js"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base text-white focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent)]/20 focus:outline-none transition-colors"
              required
              autoFocus
            />
          </div>

          {/* Proficiency Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Proficiency</label>
              <span className="font-mono text-xl font-bold text-[var(--admin-accent)]">{form.percentage}%</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={form.percentage}
                onChange={(e) => setForm({...form, percentage: parseInt(e.target.value) || 0})}
                className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-[var(--admin-accent)]"
                onMouseDown={() => {}}
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-2">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Category</label>
            <div className="relative">
              <select
                value={form.category}
                onChange={(e) => setForm({...form, category: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base text-white focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent)]/20 focus:outline-none appearance-none transition-colors cursor-pointer"
              >
                {categories.map(cat => <option key={cat} value={cat} className="bg-[var(--container-color)]">{cat}</option>)}
              </select>
              <FiChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Icon + Color Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Icon Picker */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Icon (emoji)</label>
              <div className="relative" ref={emojiPickerRef}>
                <button
                  type="button"
                  onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowColorPicker(false); }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-3xl text-center flex items-center justify-center gap-2 transition-colors hover:bg-white/10 focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent)]/20 focus:outline-none"
                >
                  {form.icon}
                  <FiChevronDown size={18} className="text-slate-500" />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-full left-0 right-0 mb-3 p-4 bg-[var(--container-color)] border border-white/10 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
                    <div className="grid grid-cols-9 gap-2">
                      {COMMON_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => { setForm({...form, icon: emoji}); setShowEmojiPicker(false); }}
                          className={`p-2.5 rounded-lg text-2xl transition-colors ${form.icon === emoji ? 'bg-[var(--admin-accent)]/30 ring-2 ring-[var(--admin-accent)]' : 'hover:bg-white/5'}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Color Picker */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Color</label>
              <div className="relative" ref={colorPickerRef}>
                <button
                  type="button"
                  onClick={() => { setShowColorPicker(!showColorPicker); setShowEmojiPicker(false); }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-12 flex items-center justify-between transition-colors hover:bg-white/10 focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent)]/20 focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg shadow-sm border border-black/20 flex-shrink-0" style={{backgroundColor: form.color}}></div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-mono text-slate-300 block">{form.color.toUpperCase()}</span>
                      <span className="text-[10px] text-slate-500">Click to change</span>
                    </div>
                  </div>
                  <FiChevronDown size={18} className="text-slate-500" />
                </button>
                {showColorPicker && (
                  <div className="absolute bottom-full left-0 right-0 mb-3 p-4 bg-[var(--container-color)] border border-white/10 rounded-xl shadow-2xl z-50">
                    <div className="grid grid-cols-7 gap-2 mb-3">
                      {COLOR_SWATCHES.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => { setForm({...form, color}); setShowColorPicker(false); }}
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${form.color === color ? 'border-[var(--admin-accent)] scale-110' : 'border-transparent hover:border-white/20'}`}
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
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent)]/20 focus:outline-none text-center font-mono transition-colors"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="featured-checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({...form, is_featured: e.target.checked})}
              className="w-5 h-5 accent-[var(--admin-accent)] mt-0.5 rounded border-white/20"
            />
            <label htmlFor="featured-checkbox" className="text-sm font-medium text-slate-300 cursor-pointer">
              Featured in Hero Badges (max 5)
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button variant="outline" type="button" onClick={handleClose} className="flex-1 hover:bg-white/5" disabled={saving}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className={`flex-1 transition-all ${isValid && !saving ? 'bg-[var(--admin-accent)] hover:brightness-110 text-black border-transparent' : 'opacity-50 cursor-not-allowed'}`}
              disabled={saving || !isValid}
            >
              {saving ? <><FiLoader className="animate-spin mr-2" size={16} /> Saving...</> : (editingSkill?.id ? 'Update Skill' : 'Add Skill')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof window !== 'undefined' && editingSkill ? createPortal(modalContent, document.body) : null;
}