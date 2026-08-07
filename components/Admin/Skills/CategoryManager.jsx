'use client';

import { useState, useEffect, useRef } from 'react';
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
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isAddingCategory) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsAddingCategory(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [isAddingCategory, setIsAddingCategory]);

  const customCategories = categories.filter(c => !DEFAULT_CATEGORIES.includes(c));

  return (
    <div ref={containerRef} className="relative">
      <Button
        onClick={() => setIsAddingCategory(!isAddingCategory)}
        className="flex items-center gap-2 sm:gap-3 px-5 sm:px-7 h-11 sm:h-12 rounded-lg sm:rounded-xl !bg-[var(--admin-accent)] hover:brightness-110 !text-white transition-all group text-xs sm:text-sm shadow-[0_0_20px_rgba(var(--admin-accent-rgb),0.4)] border-none"
      >
        <FiPlus className="group-hover:rotate-90 transition-transform duration-300" size={18} />
        <span className="font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]">Category</span>
      </Button>

      {isAddingCategory && (
        <div className="category-dropdown absolute top-full left-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 animate-fade-in flex flex-col gap-3">
          <div className="flex gap-2">
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
          
          {customCategories.length > 0 && (
            <div className="pt-2 border-t border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1 mb-1">Custom Categories</p>
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

          <Button variant="outline" size="sm" className="w-full" onClick={() => { setNewCategoryName(''); setIsAddingCategory(false); }}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}