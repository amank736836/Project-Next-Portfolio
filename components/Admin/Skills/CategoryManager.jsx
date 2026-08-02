'use client';

import { useState } from 'react';
import { FiPlus, FiCheck, FiTrash as FiTrashIcon } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const DEFAULT_CATEGORIES = ['Frontend', 'Backend', 'Database', 'Cloud', 'Languages', 'General'];

export default function CategoryManager({ 
  categories, 
  setCategories, 
  isAddingCategory, 
  setIsAddingCategory, 
  newCategoryName, 
  setNewCategoryName, 
  onAddCategory, 
  onDeleteCategory 
}) {
  const customCategories = categories.filter(c => !DEFAULT_CATEGORIES.includes(c));

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsAddingCategory(!isAddingCategory)}
        className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 h-10 sm:h-11 rounded-lg sm:rounded-xl border-dashed ${isAddingCategory ? 'text-[var(--admin-accent)] border-[var(--admin-accent)]' : ''}`}
      >
        <FiPlus size={14} />
        <span className="hidden sm:inline">Category</span>
      </Button>

      {isAddingCategory && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 animate-fade-in">
          <div className="flex gap-2 mb-2">
            <Input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onAddCategory()}
              placeholder="New category name"
              className="flex-1 bg-white/10 border border-white/20 focus:border-[var(--admin-accent)] focus:ring-1 focus:ring-[var(--admin-accent)] text-sm transition-colors"
              autoFocus
            />
            <Button size="icon" onClick={onAddCategory} className="h-8 w-8">
              <FiCheck size={14} />
            </Button>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={() => { setNewCategoryName(''); setIsAddingCategory(false); }}>
            Cancel
          </Button>
        </div>
      )}

      {customCategories.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 animate-fade-in">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1 mb-1">Custom Categories</p>
          {customCategories.map(cat => (
            <button
              key={cat}
              onClick={() => onDeleteCategory(cat)}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm text-slate-300 hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <span>{cat}</span>
              <FiTrashIcon size={12} className="opacity-50 hover:opacity-100" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}