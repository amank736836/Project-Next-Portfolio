'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  FiEye, FiEyeOff, FiEdit, FiTrash, FiPlus, FiExternalLink, 
  FiCode, FiActivity, FiSearch, FiFilter, FiGrid, FiList,
  FiX, FiChevronDown, FiCheck
} from 'react-icons/fi';
import { useToast, useSuccessToast, useErrorToast } from './Toast';
import { useDeleteConfirm } from './ConfirmModal';
import EmptyState, { EmptyProjects, EmptySearch } from './EmptyState';

export default function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState(new Set());
  
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const confirmDelete = useDeleteConfirm();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      errorToast('Failed to load projects from the matrix');
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (id, currentStatus) => {
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_hidden: !currentStatus }),
      });
      if (res.ok) {
        fetchProjects();
        successToast(currentStatus ? 'Project is now online' : 'Project is now offline');
      }
    } catch (error) {
      errorToast('Failed to update project visibility');
    }
  };

  const handleDelete = async (project) => {
    const confirmed = await confirmDelete(`"${project.title}"`);
    if (confirmed) {
      // Simulate delete - would call API in real implementation
      successToast('Project ejected from matrix successfully');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProjects.size === 0) return;
    const confirmed = await confirmDelete(`${selectedProjects.size} projects`);
    if (confirmed) {
      setSelectedProjects(new Set());
      successToast(`${selectedProjects.size} projects ejected from matrix`);
    }
  };

  // Filter and search logic
  const filteredProjects = useMemo(() => {
    let result = projects;

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.details?.some(d => d.desc?.toString().toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (filterStatus === 'online') {
      result = result.filter(p => !p.is_hidden);
    } else if (filterStatus === 'offline') {
      result = result.filter(p => p.is_hidden);
    }

    return result;
  }, [projects, searchQuery, filterStatus]);

  const toggleSelection = (id) => {
    const newSet = new Set(selectedProjects);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedProjects(newSet);
  };

  const selectAll = () => {
    if (selectedProjects.size === filteredProjects.length) {
      setSelectedProjects(new Set());
    } else {
      setSelectedProjects(new Set(filteredProjects.map(p => p.id)));
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setSelectedProjects(new Set());
  };

  if (loading) return <ProjectSkeleton />;

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <h2 className="admin-title">Asset Showcase</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3">
            Node Showcase v4.2 // Unified Asset Management
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedProjects.size > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="admin-btn admin-btn-danger"
            >
              <FiTrash size={16} />
              <span className="hidden sm:inline">Delete {selectedProjects.size}</span>
            </button>
          )}
          <button 
            onClick={() => successToast('New project creation coming soon')}
            className="admin-btn admin-btn-primary group"
          >
            <FiPlus className="text-xl group-hover:rotate-90 transition-transform duration-500" /> 
            <span className="hidden sm:inline">New Mission</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="admin-card !p-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="search-input-wrapper flex-1">
            <FiSearch className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search projects by name, category, or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="search-clear"
              >
                <FiX size={14} />
              </button>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`admin-btn admin-btn-secondary !gap-2 ${showFilters ? '!border-[var(--first-color)] !text-[var(--first-color)]' : ''}`}
            >
              <FiFilter size={16} />
              <span className="hidden sm:inline">
                {filterStatus === 'all' ? 'All Status' : 
                 filterStatus === 'online' ? 'Online Only' : 'Offline Only'}
              </span>
              <FiChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {showFilters && (
              <div className="absolute top-full right-0 mt-2 w-48 admin-card !p-2 z-20">
                {[
                  { value: 'all', label: 'All Projects', icon: <FiGrid size={14} /> },
                  { value: 'online', label: 'Online Only', icon: <FiEye size={14} /> },
                  { value: 'offline', label: 'Offline Only', icon: <FiEyeOff size={14} /> },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilterStatus(option.value);
                      setShowFilters(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      filterStatus === option.value 
                        ? 'bg-[var(--first-color)]/10 text-[var(--first-color)]' 
                        : 'hover:bg-white/5 text-slate-400'
                    }`}
                  >
                    {filterStatus === option.value && <FiCheck size={14} />}
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[var(--first-color)] text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <FiGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[var(--first-color)] text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <FiList size={18} />
            </button>
          </div>
        </div>

        {/* Filter Pills & Stats */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            {(searchQuery || filterStatus !== 'all') && (
              <>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Active filters:</span>
                {searchQuery && (
                  <span className="badge badge-info">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-white">
                      <FiX size={10} />
                    </button>
                  </span>
                )}
                {filterStatus !== 'all' && (
                  <span className={`badge ${filterStatus === 'online' ? 'badge-success' : 'badge-danger'}`}>
                    {filterStatus === 'online' ? 'Online' : 'Offline'}
                    <button onClick={() => setFilterStatus('all')} className="ml-1 hover:text-white">
                      <FiX size={10} />
                    </button>
                  </span>
                )}
                <button 
                  onClick={clearSearch}
                  className="text-[10px] text-slate-500 hover:text-[var(--first-color)] transition-colors"
                >
                  Clear all
                </button>
              </>
            )}
          </div>
          <div className="flex items-center gap-4 text-[10px] text-slate-500">
            <span className="font-mono">{filteredProjects.length} nodes</span>
            {filteredProjects.length !== projects.length && (
              <span className="text-slate-600">/ {projects.length} total</span>
            )}
            {selectedProjects.size > 0 && (
              <span className="text-[var(--first-color)]">
                {selectedProjects.size} selected
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Empty States */}
      {projects.length === 0 ? (
        <EmptyProjects onAdd={() => successToast('New project creation coming soon')} />
      ) : filteredProjects.length === 0 ? (
        <EmptySearch 
          searchTerm={searchQuery} 
          onClear={clearSearch}
        />
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredProjects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={idx}
              isSelected={selectedProjects.has(project.id)}
              onToggleSelect={() => toggleSelection(project.id)}
              onToggleVisibility={() => toggleVisibility(project.id, project.is_hidden)}
              onDelete={() => handleDelete(project)}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredProjects.map((project, idx) => (
            <ProjectListItem
              key={project.id}
              project={project}
              index={idx}
              isSelected={selectedProjects.has(project.id)}
              onToggleSelect={() => toggleSelection(project.id)}
              onToggleVisibility={() => toggleVisibility(project.id, project.is_hidden)}
              onDelete={() => handleDelete(project)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, index, isSelected, onToggleSelect, onToggleVisibility, onDelete }) {
  return (
    <div 
      className={`admin-card group !p-0 overflow-hidden stagger-${(index % 5) + 1} !rounded-2xl w-full relative ${
        isSelected ? 'ring-2 ring-[var(--first-color)]' : ''
      }`}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect();
          }}
          className={`w-5 h-5 rounded border transition-all ${
            isSelected 
              ? 'bg-[var(--first-color)] border-[var(--first-color)]' 
              : 'border-white/20 bg-black/30 hover:border-white/40'
          }`}
        >
          {isSelected && <FiCheck size={12} className="m-auto text-white" />}
        </button>
      </div>

      {/* Image Section */}
      <div className="relative h-32 overflow-hidden bg-slate-900">
        <img 
          src={project.img} 
          alt={project.title} 
          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--container-color)] via-transparent to-transparent opacity-80" />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3 scale-90 origin-top-right">
          <button 
            onClick={onToggleVisibility}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-xl border transition-all duration-500 group/status ${
              project.is_hidden 
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
            }`}
          >
            {project.is_hidden ? <FiEyeOff size={10} /> : <FiEye size={10} />}
            <span className="text-[8px] font-black uppercase tracking-[0.15em]">
              {project.is_hidden ? 'Offline' : 'Online'}
            </span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="min-w-0">
            <h3 className="text-sm font-black tracking-tight mb-0.5 group-hover:text-[var(--first-color)] transition-colors truncate">
              {project.title}
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest truncate">
                Sector {index + 1}
              </span>
              <div className="w-0.5 h-0.5 bg-slate-500 rounded-full" />
              <span className="text-[7px] font-black text-[var(--first-color)] uppercase tracking-widest truncate">
                {project.category || 'Module'}
              </span>
            </div>
          </div>
          <div className="w-8 h-8 flex-shrink-0 bg-[var(--first-color)]/5 rounded-lg flex items-center justify-center text-[var(--first-color)] border border-[var(--first-color)]/10 shadow-inner">
            <FiActivity size={12} className="animate-pulse" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--border-color)]">
          <div className="flex gap-1.5">
            <button className="admin-btn admin-btn-secondary !px-3 !py-2 !gap-1.5 !rounded-lg !text-[10px]">
              <FiEdit size={12} /> Edit
            </button>
            <button 
              onClick={onDelete}
              className="admin-icon-btn hover:!bg-rose-500 hover:!text-white hover:!border-rose-500 !w-8 !h-8 !rounded-lg"
            >
              <FiTrash size={14} />
            </button>
          </div>
          <a 
            href={project.details?.[3]?.desc?.props?.href || '#'} 
            target="_blank"
            rel="noopener noreferrer"
            className="admin-icon-btn !w-8 !h-8 !rounded-lg"
          >
            <FiExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

function ProjectListItem({ project, index, isSelected, onToggleSelect, onToggleVisibility, onDelete }) {
  return (
    <div 
      className={`admin-card !p-4 flex items-center gap-4 group ${
        isSelected ? 'ring-2 ring-[var(--first-color)]' : ''
      }`}
    >
      {/* Selection */}
      <button
        onClick={onToggleSelect}
        className={`w-5 h-5 rounded border transition-all flex-shrink-0 ${
          isSelected 
            ? 'bg-[var(--first-color)] border-[var(--first-color)]' 
            : 'border-white/20 hover:border-white/40'
        }`}
      >
        {isSelected && <FiCheck size={12} className="m-auto text-white" />}
      </button>

      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0">
        <img 
          src={project.img} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-black tracking-tight mb-1 truncate group-hover:text-[var(--first-color)] transition-colors">
          {project.title}
        </h3>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-500/5 border border-slate-500/10 w-fit">
          {project.is_hidden ? <FiEyeOff size={12} className="text-rose-400" /> : <FiEye size={12} className="text-emerald-400" />}
          <span className={`text-[10px] font-bold uppercase tracking-wider ${project.is_hidden ? 'text-rose-400' : 'text-emerald-400'}`}>
            {project.is_hidden ? 'Hidden' : 'Visible'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onToggleVisibility}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${
            project.is_hidden 
              ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' 
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
          }`}
          title={project.is_hidden ? 'Show Project' : 'Hide Project'}
        >
          {project.is_hidden ? <FiEye size={14} /> : <FiEyeOff size={14} />}
        </button>
        <button className="admin-icon-btn !w-8 !h-8 !rounded-lg">
          <FiEdit size={14} />
        </button>
        <button 
          onClick={onDelete}
          className="admin-icon-btn hover:!bg-rose-500 hover:!text-white hover:!border-rose-500 !w-8 !h-8 !rounded-lg"
        >
          <FiTrash size={14} />
        </button>
        <a 
          href={project.details?.[3]?.desc?.props?.href || '#'} 
          target="_blank"
          rel="noopener noreferrer"
          className="admin-icon-btn !w-8 !h-8 !rounded-lg"
        >
          <FiExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}

function ProjectSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-48 loading-shimmer rounded-xl" />
          <div className="h-4 w-64 loading-shimmer rounded-lg" />
        </div>
        <div className="h-12 w-32 loading-shimmer rounded-xl" />
      </div>

      {/* Search Bar Skeleton */}
      <div className="admin-card !p-4">
        <div className="h-12 loading-shimmer rounded-xl" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {[1,2,3,4,5,6,7,8,10].map(i => (
          <div key={i} className="admin-card !p-0 overflow-hidden">
            <div className="h-32 loading-shimmer" />
            <div className="p-4 space-y-3">
              <div className="h-5 w-3/4 loading-shimmer rounded-lg" />
              <div className="h-3 w-1/2 loading-shimmer rounded" />
              <div className="flex justify-between pt-3">
                <div className="h-8 w-16 loading-shimmer rounded-lg" />
                <div className="h-8 w-8 loading-shimmer rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
