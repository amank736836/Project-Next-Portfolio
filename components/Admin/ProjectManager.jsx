'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import {
  FiEye, FiEyeOff, FiTrash, FiTrash2, FiPlus, FiExternalLink,
  FiCode, FiActivity, FiSearch, FiFilter, FiGrid, FiList,
  FiX, FiChevronDown, FiCheck, FiRefreshCw, FiCloudLightning, FiGithub
} from 'react-icons/fi';
import { useToast, useSuccessToast, useErrorToast } from './Toast';
import { useDeleteConfirm } from './ConfirmModal';
import EditProjectForm from './EditProjectForm';
import EmptyState, { EmptyProjects, EmptySearch } from './EmptyState';
import { Button, Input, Card } from '@/components/ui';

export default function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryFilters, setShowCategoryFilters] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(projects.map(p => p.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [projects]);
  const [selectedProjects, setSelectedProjects] = useState(new Set());
  const [editingProject, setEditingProject] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const modalRef = useRef(null);

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
      const processed = (Array.isArray(data) ? data : []).map(p => {
        let details = p.details;
        if (typeof details === 'string') {
          try {
            details = JSON.parse(details);
          } catch (e) {
            console.error('Failed to parse details for project:', p.id, e);
            details = [];
          }
        }
        return { ...p, details: Array.isArray(details) ? details : [] };
      });
      setProjects(processed);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      errorToast('Failed to load projects from the matrix');
    } finally {
      setLoading(false);
    }
  };

  const addProject = async () => {
    setSaving(true);
    try {
      const draft = {
        title: 'New Mission',
        img: '',
        is_hidden: false,
        details: [],
        category: 'sideproject',
        description: 'Describe this project and its outcome.',
      };

      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...draft,
          details: JSON.stringify(draft.details)
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setProjects((current) => [created, ...current]);
        setEditingProject(created);
        successToast('New project created');
      } else {
        errorToast('Failed to create project');
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      errorToast('Failed to create project');
    } finally {
      setSaving(false);
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
      try {
        const res = await fetch(`/api/admin/projects?id=${project.id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          setProjects((current) => current.filter((item) => item.id !== project.id));
          setSelectedProjects((current) => {
            const next = new Set(current);
            next.delete(project.id);
            return next;
          });
          successToast('Project ejected from matrix successfully');
        } else {
          errorToast('Failed to delete project');
        }
      } catch (error) {
        console.error('Failed to delete project:', error);
        errorToast('Failed to delete project');
      }
    }
  };

const handleBulkDelete = async () => {
    if (selectedProjects.size === 0) return;
    const confirmed = await confirmDelete(`${selectedProjects.size} projects`);
    if (confirmed) {
      try {
        await Promise.all([...selectedProjects].map((id) => fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' })));
        setProjects((current) => current.filter((project) => !selectedProjects.has(project.id)));
        setSelectedProjects(new Set());
        successToast(`${selectedProjects.size} projects ejected from matrix`);
      } catch (error) {
        console.error('Failed to bulk delete projects:', error);
        errorToast('Failed to delete selected projects');
      }
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
        (Array.isArray(p.details) && p.details.some(d => d.desc?.toString().toLowerCase().includes(query)))
      );
    }

    // Apply status filter
    if (filterStatus === 'online') {
      result = result.filter(p => !p.is_hidden);
    } else if (filterStatus === 'offline') {
      result = result.filter(p => p.is_hidden);
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      result = result.filter(p => p.category === filterCategory);
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
    setFilterCategory('all');
    setSelectedProjects(new Set());
  };

  return (
    <div className="animate-fade-in pb-10">
      {/* Edit Form Component */}
      <EditProjectForm
        editingProject={editingProject}
        setEditingProject={setEditingProject}
        categories={categories}
        setIsAddingCategory={setIsAddingCategory}
        isAddingCategory={isAddingCategory}
        onUpdateProject={fetchProjects}
        onRequestClose={() => setEditingProject(null)}
        modalRef={modalRef}
      />

      {/* Header Section */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[var(--admin-title)]">Asset Showcase</h2>
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
            Node Showcase v4.2 — Unified Asset Management
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {selectedProjects.size > 0 && (
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              className="flex items-center gap-2 h-10 sm:h-12 px-3 sm:px-4 text-xs sm:text-sm rounded-lg sm:rounded-xl"
            >
              <FiTrash size={16} className="sm:!size-5" />
              <span className="hidden sm:inline">Delete {selectedProjects.size}</span>
              <span className="sm:hidden">Delete</span>
            </Button>
          )}
          <Button
            variant="outline"
            onClick={addProject}
            className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 h-10 sm:h-12 rounded-lg sm:rounded-xl border-indigo-500/20 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all group text-xs sm:text-sm"
          >
            <FiPlus className="group-hover:rotate-90 transition-transform duration-300" size={18} />
            <span className="font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]">New Mission</span>
          </Button>
        </div>
      </div>

      {/* Search & Add Section */}
      <div className="mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Search Input */}
          <div className="flex items-center gap-2 bg-white/5 rounded-lg sm:rounded-xl px-3 sm:px-4 border border-white/10 focus-within:border-indigo-500 transition-all">
            <FiSearch className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 flex-shrink-0" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-0 bg-transparent border-none text-xs sm:text-sm outline-none"
            />
            {searchQuery && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSearchQuery('')}
                className="-ml-2 h-8 w-8"
              >
                <FiX size={12} />
              </Button>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="relative w-fit">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 h-10 sm:h-11 rounded-lg sm:rounded-xl ${showFilters ? 'text-[var(--first-color)] border-[var(--first-color)]' : ''}`}
            >
              <FiFilter size={16} />
              <span className="hidden sm:inline">
                {filterStatus === 'all' ? 'All Status' :
                 filterStatus === 'online' ? 'Online Only' : 'Offline Only'}
              </span>
              <FiChevronDown size={12} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>

            {showFilters && (
              <div className="absolute top-full left-0 mt-2 w-48 z-50">
                <div className="admin-dropdown-menu">
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
                      className={`admin-dropdown-item text-xs sm:text-sm ${filterStatus === option.value ? 'active' : ''}`}
                    >
                      <span className="flex-1 flex items-center gap-2 sm:gap-3">
                        {option.icon}
                        {option.label}
                      </span>
                      {filterStatus === option.value && <FiCheck size={12} strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Category Filter Dropdown */}
          {categories.length > 1 && (
            <div className="relative w-fit">
              <Button
                variant="outline"
                onClick={() => setShowCategoryFilters(!showCategoryFilters)}
                className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 h-10 sm:h-11 rounded-lg sm:rounded-xl ${showCategoryFilters ? 'text-[var(--first-color)] border-[var(--first-color)]' : ''}`}
              >
                <FiGrid size={16} />
                <span className="hidden sm:inline">
                  {filterCategory === 'all' ? 'All Categories' : filterCategory}
                </span>
                <FiChevronDown size={12} className={`transition-transform ${showCategoryFilters ? 'rotate-180' : ''}`} />
              </Button>

              {showCategoryFilters && (
                <div className="absolute top-full left-0 mt-2 w-48 z-50">
                  <div className="admin-dropdown-menu max-h-60 overflow-y-auto">
                    <button
                      onClick={() => {
                        setFilterCategory('all');
                        setShowCategoryFilters(false);
                      }}
                      className={`admin-dropdown-item text-xs sm:text-sm ${filterCategory === 'all' ? 'active' : ''}`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setFilterCategory(cat);
                          setShowCategoryFilters(false);
                        }}
                        className={`admin-dropdown-item text-xs sm:text-sm ${filterCategory === cat ? 'active' : ''}`}
                      >
                        <span className="capitalize">{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setViewMode('grid')}
              className={`flex-1 sm:flex-none h-10 sm:h-11 px-3 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm ${viewMode === 'grid' ? 'text-[var(--first-color)]' : ''}`}
            >
              <FiGrid size={16} />
            </Button>
            <Button
              variant="outline"
              onClick={() => setViewMode('list')}
              className={`flex-1 sm:flex-none h-10 sm:h-11 px-3 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm ${viewMode === 'list' ? 'text-[var(--first-color)]' : ''}`}
            >
              <FiList size={16} />
            </Button>
          </div>
        </div>

        {/* Filter Pills & Stats */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            {(searchQuery || filterStatus !== 'all') && (
              <>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                  Active filters:
                </span>
                {searchQuery && (
                  <span className="inline-flex items-center px-2 sm:px-2.5 py-1 sm:py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-slate-500/20 text-slate-400 gap-1">
                    Search: "{searchQuery}"
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSearchQuery('')}
                      className="-ml-1 h-4 w-4"
                    >
                      <FiX size={8} />
                    </Button>
                  </span>
                )}
                {filterStatus !== 'all' && (
                  <span className={`inline-flex items-center px-2 sm:px-2.5 py-1 sm:py-0.5 rounded-full text-[10px] sm:text-xs font-bold gap-1 ${filterStatus === 'online' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-destructive/20 text-destructive'}`}>
                    {filterStatus === 'online' ? 'Online' : 'Offline'}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setFilterStatus('all')}
                      className="-ml-1 h-4 w-4"
                    >
                      <FiX size={8} />
                    </Button>
                  </span>
                )}
                {filterCategory !== 'all' && (
                  <span className="inline-flex items-center px-2 sm:px-2.5 py-1 sm:py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-indigo-500/20 text-indigo-400 gap-1">
                    Category: {filterCategory}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setFilterCategory('all')}
                      className="-ml-1 h-4 w-4"
                    >
                      <FiX size={8} />
                    </Button>
                  </span>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={clearSearch}
                  className="h-6 w-6 text-slate-500 hover:text-[var(--first-color)] transition-colors text-xs"
                >
                  Clear all
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-bold text-slate-500">
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
        <EmptyProjects onAdd={addProject} />
      ) : filteredProjects.length === 0 ? (
        <EmptySearch
          searchTerm={searchQuery}
          onClear={clearSearch}
        />
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mt-2 sm:mt-4">
            {filteredProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={idx}
                isSelected={selectedProjects.has(project.id)}
                onToggleSelect={() => toggleSelection(project.id)}
                onToggleVisibility={() => toggleVisibility(project.id, project.is_hidden)}
                onEdit={() => setEditingProject(project)}
                onDelete={() => handleDelete(project)}
              />
            ))}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="px-4 sm:px-6 lg:px-8 space-y-2 sm:space-y-3">
          {filteredProjects.map((project, idx) => (
            <ProjectListItem
              key={project.id}
              project={project}
              index={idx}
              isSelected={selectedProjects.has(project.id)}
              onToggleSelect={() => toggleSelection(project.id)}
              onToggleVisibility={() => toggleVisibility(project.id, project.is_hidden)}
              onEdit={() => setEditingProject(project)}
              onDelete={() => handleDelete(project)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, index, isSelected, onToggleSelect, onToggleVisibility, onEdit, onDelete }) {
  return (
    <div
      className={`group relative overflow-hidden stagger-${(index % 5) + 1} transition-all duration-500 hover:scale-[1.01] rounded-lg sm:rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 ${isSelected ? 'ring-2 ring-[var(--admin-accent)] shadow-[0_0_40px_var(--admin-accent-glow)]' : ''}`}
    >
      {/* Image Section */}
      <div className="relative h-32 sm:h-40 md:h-48 w-full overflow-hidden bg-[var(--admin-bg)]">
        <Image
          src={project.image || project.img || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop'}
          alt={project.title || 'Project image'}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-90" />

        {/* Status Badge */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
            className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl backdrop-blur-xl border transition-all flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs ${project.is_hidden
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}
          >
            {project.is_hidden ? <FiEyeOff size={14} className="sm:!size-4" /> : <FiEye size={14} className="sm:!size-4" />}
            <span className="hidden sm:inline font-bold uppercase tracking-[0.2em]">
              {project.is_hidden ? 'Private' : 'Public'}
            </span>
          </Button>
        </div>

        {/* Selection Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect();
          }}
          className={`absolute top-2 left-2 sm:top-3 sm:left-3 w-5 h-5 sm:w-6 sm:h-6 rounded border flex items-center justify-center transition-all ${
            isSelected
              ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/40'
              : 'bg-black/20 backdrop-blur-md border-white/20 text-white/40 hover:border-white/40'
          }`}
        >
          {isSelected && <FiCheck size={10} className="sm:!size-3" strokeWidth={4} />}
        </button>
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 md:p-6 flex-1 flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
          <span className="px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 uppercase tracking-tight sm:tracking-tighter">
            {project.category || 'Portfolio Item'}
          </span>
          <span className="text-[10px] sm:text-xs text-slate-600 font-medium uppercase tracking-tighter">
            Last: {project.updated_at ? new Date(project.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Now'}
          </span>
        </div>

        <h4 className="text-base sm:text-lg font-bold text-[var(--admin-title)] mb-1 sm:mb-2 tracking-tight group-hover:text-[var(--admin-accent)] transition-colors line-clamp-2">
          {project.title}
        </h4>

        <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-2 group-hover:line-clamp-none leading-relaxed mb-3 sm:mb-4 opacity-70 group-hover:opacity-100 transition-opacity">
          {project.description}
        </p>

        {/* Action Row */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/5 gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="px-3 sm:px-6 py-2 sm:py-2.5 font-black uppercase tracking-wider text-[10px] sm:text-xs hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all rounded-lg sm:rounded-xl flex-1"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-rose-500/5 text-rose-400 border-none !ring-0 !ring-offset-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 hover:bg-rose-500/10 transition-all flex-shrink-0"
          >
            <FiTrash2 size={16} className="sm:!size-4.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProjectListItem({ project, index, isSelected, onToggleSelect, onToggleVisibility, onEdit, onDelete }) {
  return (
    <div
      className={`flex items-center gap-3 sm:gap-4 transition-all duration-300 hover:bg-white/2 p-3 sm:p-4 rounded-lg border border-white/5 hover:border-white/10 ${isSelected ? 'ring-2 ring-indigo-500/50 bg-indigo-500/[0.02]' : ''}`}
    >
      <button
        onClick={onToggleSelect}
        className={`w-5 h-5 sm:w-6 sm:h-6 rounded border flex items-center justify-center transition-all flex-shrink-0 ${
          isSelected
            ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg'
            : 'border-white/10 bg-white/5 hover:border-white/30'
        }`}
      >
        {isSelected && <FiCheck size={10} className="sm:!size-3" strokeWidth={4} />}
      </button>

      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden bg-[var(--admin-bg)] flex-shrink-0 border border-border/50">
        <Image
          src={project.image || project.img || 'https://via.placeholder.com/150'}
          alt={project.title || 'Project thumbnail'}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap">
          <h4 className="text-xs sm:text-sm font-bold text-[var(--admin-title)] truncate group-hover:text-indigo-400 transition-colors">
            {project.title}
          </h4>
          <span className="px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-bold bg-white/5 text-slate-500 border border-white/5 uppercase tracking-tighter flex-shrink-0">
            {project.category}
          </span>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-500 truncate opacity-60 group-hover:opacity-100 transition-opacity">
          {project.description}
        </p>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleVisibility}
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center transition-all border text-xs ${
            project.is_hidden
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}
        >
          {project.is_hidden ? <FiEyeOff size={14} className="sm:!size-4" /> : <FiEye size={14} className="sm:!size-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-indigo-500/10 text-indigo-400 border-none hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
        >
          <FiEdit3 size={14} className="sm:!size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="hover:bg-rose-500 hover:text-white transition-all w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-rose-500/10 text-rose-400 border-none !ring-0 !ring-offset-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 shadow-sm hover:shadow-rose-500/10"
        >
          <FiTrash2 size={14} className="sm:!size-4" />
        </Button>
        <a
          href={project.details?.[3]?.desc?.props?.href || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:bg-indigo-500 hover:text-white transition-all w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-indigo-500/10 text-indigo-400 border-none flex items-center justify-center shadow-sm hover:shadow-indigo-500/10"
        >
          <FiExternalLink size={14} className="sm:!size-4" />
        </a>
      </div>
    </div>
  );
}

function ProjectSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-6 w-48 animate-pulse" />
          <div className="h-4 w-64 animate-pulse" />
        </div>
        <div className="h-10 w-32 animate-pulse" />
      </div>

      {/* Search Bar Skeleton */}
      <div className="mb-4">
        <div className="h-10 animate-pulse" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {[1,2,3,4,5,6,7,8,10].map(i => (
          <div key={i} className="flex h-32 w-full">
            <div className="h-32 w-full animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-5 w-3/4 animate-pulse" />
              <div className="h-3 w-1/2 animate-pulse" />
              <div className="flex justify-between pt-3">
                <div className="h-8 w-16 animate-pulse" />
                <div className="h-8 w-8 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}