'use client';

import React from 'react';
import { FiGrid, FiChevronDown } from 'react-icons/fi';
import { Button } from '@/components/ui';

export default function CategoryFilter({ categories, currentCategory, onSelect, isOpen, onToggle }) {
  if (categories.length <= 1) return null;

  return (
    <div className="relative w-fit">
      <Button
        variant="outline"
        onClick={onToggle}
        className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 h-10 sm:h-11 rounded-lg sm:rounded-xl ${isOpen ? 'text-[var(--first-color)] border-[var(--first-color)]' : ''}`}
      >
        <FiGrid size={16} />
        <span className="hidden sm:inline">
          {currentCategory === 'all' ? 'All Categories' : currentCategory}
        </span>
        <FiChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 z-50">
          <div className="admin-dropdown-menu max-h-60 overflow-y-auto">
            <button
              onClick={() => {
                onSelect('all');
                onToggle();
              }}
              className={`admin-dropdown-item text-xs sm:text-sm ${currentCategory === 'all' ? 'active' : ''}`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelect(cat);
                  onToggle();
                }}
                className={`admin-dropdown-item text-xs sm:text-sm ${currentCategory === cat ? 'active' : ''}`}
              >
                <span className="capitalize">{cat}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
