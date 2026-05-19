'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
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
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import StatusFilter from './StatusFilter';
import CategoryFilter from './CategoryFilter';
import { ProjectCard, ProjectListItem } from './ProjectItems';
import { useCallback } from 'react';

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

  const fetchProjects = useCallback(async () => {
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
  }, [errorToast]);

  const openNewProjectForm = () => {
    setEditingProject({
      title: '',
      img: '',
      image: '',
      is_hidden: true,
      details: [],
      category: '',
      description: '',
    });
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

  const toggleSelection = useCallback((id) => {
    setSelectedProjects((current) => {
      const newSet = new Set(current);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const selectAll = () => {
    if (selectedProjects.size === filteredProjects.length) {
      setSelectedProjects(new Set());
    } else {
      setSelectedProjects(new Set(filteredProjects.map(p => p.id)));
    }
  };

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterCategory('all');
    setSelectedProjects(new Set());
  }, []);

  return (
    <div className="animate-fade-in pb-10">
      {/* Edit Form rendered via portal to escape CSS transform containing block */}
      {typeof window !== 'undefined' && createPortal(
        <EditProjectForm
          editingProject={editingProject}
          setEditingProject={setEditingProject}
          categories={categories}
          setIsAddingCategory={setIsAddingCategory}
          isAddingCategory={isAddingCategory}
          onUpdateProject={fetchProjects}
          onRequestClose={() => setEditingProject(null)}
          modalRef={modalRef}
        />,
        document.body
      )}

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
            onClick={openNewProjectForm}
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

            <StatusFilter 
              isOpen={showFilters}
              currentStatus={filterStatus}
              onSelect={setFilterStatus}
              onClose={() => setShowFilters(false)}
            />
          </div>

          {/* Category Filter Dropdown */}
          <CategoryFilter 
            categories={categories}
            currentCategory={filterCategory}
            onSelect={setFilterCategory}
            isOpen={showCategoryFilters}
            onToggle={() => setShowCategoryFilters(!showCategoryFilters)}
          />

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
        <EmptyProjects onAdd={openNewProjectForm} />
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