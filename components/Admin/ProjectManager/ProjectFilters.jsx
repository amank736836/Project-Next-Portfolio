'use client';

import { FiSearch, FiFilter, FiChevronDown, FiX, FiGrid, FiList } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import StatusFilter from '@/components/Admin/StatusFilter';
import CategoryFilter from '@/components/Admin/CategoryFilter';

export default function ProjectFilters({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterCategory,
  setFilterCategory,
  showFilters,
  setShowFilters,
  showCategoryFilters,
  setShowCategoryFilters,
  viewMode,
  setViewMode,
  categories,
  onClearSearch,
  projects,
  filteredProjects
}) {
  return (
    <>
      <div className="mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8">
      <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center gap-2 bg-white/5 rounded-lg sm:rounded-xl px-3 sm:px-4 border border-white/10 focus-within:border-indigo-500 transition-all">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-0 bg-transparent border-none text-xs sm:text-sm outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="-ml-2 h-8 w-8 text-slate-500 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <div className="relative w-fit">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 h-10 sm:h-11 rounded-lg sm:rounded-xl ${showFilters ? 'text-[var(--first-color)] border-[var(--first-color)]' : ''}`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span className="hidden sm:inline">
              {filterStatus === 'all' ? 'All Status' :
               filterStatus === 'online' ? 'Online Only' : 'Offline Only'}
            </span>
            <svg className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <StatusFilter 
            isOpen={showFilters}
            currentStatus={filterStatus}
            onSelect={setFilterStatus}
            onClose={() => setShowFilters(false)}
          />
        </div>

        <CategoryFilter 
          categories={categories}
          currentCategory={filterCategory}
          onSelect={setFilterCategory}
          isOpen={showCategoryFilters}
          onToggle={() => setShowCategoryFilters(!showCategoryFilters)}
        />
      </div>

      <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
        <button
          onClick={() => setViewMode('grid')}
          className={`h-8 w-8 ${viewMode === 'grid' ? 'bg-white/10 text-[var(--first-color)]' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all'}`}
          title="Grid view"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`h-8 w-8 ${viewMode === 'list' ? 'bg-white/10 text-[var(--first-color)]' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all'}`}
          title="List view"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </div>

    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
        {(() => {
          const hasFilters = searchQuery || filterStatus !== 'all' || filterCategory !== 'all';
          if (!hasFilters) return null;
          return (
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Active filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center px-2 sm:px-2.5 py-1 sm:py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-slate-500/20 text-slate-400 gap-1">
                  Search: &quot;{searchQuery}&quot;
                  <button
                    onClick={() => setSearchQuery('')}
                    className="-ml-1 h-4 w-4 text-slate-500 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </span>
              )}
              {filterStatus !== 'all' && (
                <span className={`inline-flex items-center px-2 sm:px-2.5 py-1 sm:py-0.5 rounded-full text-[10px] sm:text-xs font-bold gap-1 ${filterStatus === 'online' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-destructive/20 text-destructive'}`}>
                  {filterStatus === 'online' ? 'Online' : 'Offline'}
                  <button
                    onClick={() => setFilterStatus('all')}
                    className="-ml-1 h-4 w-4 text-slate-500 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </span>
              )}
              {filterCategory !== 'all' && (
                <span className="inline-flex items-center px-2 sm:px-2.5 py-1 sm:py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-indigo-500/20 text-indigo-400 gap-1">
                  Category: {filterCategory}
                  <button
                    onClick={() => setFilterCategory('all')}
                    className="-ml-1 h-4 w-4 text-slate-500 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </span>
              )}
              <button
                onClick={onClearSearch}
                className="h-6 w-6 text-slate-500 hover:text-[var(--first-color)] transition-colors text-xs"
              >
                Clear all
              </button>
            </div>
          );
        })()}
      </div>
      <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-bold text-slate-500">
        <span className="font-mono">{filteredProjects.length} nodes</span>
        {filteredProjects.length !== projects.length && (
          <span className="text-slate-600">/ {projects.length} total</span>
        )}
      </div>
    </div>
    </>
  );
}
