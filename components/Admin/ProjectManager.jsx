'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  FiEye, FiEyeOff, FiEdit, FiEdit3, FiTrash, FiTrash2, FiPlus, FiExternalLink,
  FiCode, FiActivity, FiSearch, FiFilter, FiGrid, FiList,
  FiX, FiChevronDown, FiCheck, FiRefreshCw, FiCloudLightning
} from 'react-icons/fi';
import { useToast, useSuccessToast, useErrorToast } from './Toast';
import { useDeleteConfirm } from './ConfirmModal';
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
  const fileInputRef = useRef(null);

  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const confirmDelete = useDeleteConfirm();

  useEffect(() => {
    fetchProjects();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setEditingProject(null);
        setIsAddingCategory(false);
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setEditingProject(null);
        setIsAddingCategory(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    if (editingProject) {
      window.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingProject]);

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
        body: JSON.stringify(draft),
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

  const updateProject = async () => {
    if (!editingProject) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject),
      });
      if (res.ok) {
        setEditingProject(null);
        setIsAddingCategory(false);
        fetchProjects();
        successToast(`Project "${editingProject.title}" updated successfully`);
      } else {
        errorToast('Failed to update project');
      }
    } catch (error) {
      console.error('Failed to update project:', error);
      errorToast('Failed to synchronize project changes');
    } finally {
      setSaving(false);
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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
 
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
 
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
 
      if (res.ok) {
        const { url } = await res.json();
        setEditingProject({ ...editingProject, image: url, img: url });
        successToast('Image uploaded successfully');
      } else {
        errorToast('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      errorToast('Upload failed');
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
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

  if (loading) return <ProjectSkeleton />;

  return (
    <div className="animate-fade-in pb-10">
      {/* Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" />
          <div
            ref={modalRef}
            className="w-full max-w-2xl relative z-10 p-0 overflow-hidden animate-slide-up shadow-[0_0_100px_rgba(0,0,0,0.8)] border-border/50"
          >
            <div className="p-10 border-b border-border/50 flex items-center justify-between bg-background/50">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                  Asset Refactoring // Node #{editingProject.id.toString().slice(-4)}
                </p>
                <h3 className="text-xl font-bold tracking-tight text-[var(--admin-title)]">Edit Project</h3>
              </div>
              <button onClick={() => { setEditingProject(null); setIsAddingCategory(false); }} className="hover:rotate-90 transition-transform">
                <FiX />
              </button>
            </div>

            <div className="p-10 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Project Title</label>
                    <Input
                      value={editingProject.title || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      placeholder="Project name..."
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Category</label>
                    <div className="space-y-3">
                      <div className="relative">
                        <select
                          value={isAddingCategory ? 'new' : (editingProject.category || '')}
                          onChange={(e) => {
                            if (e.target.value === 'new') {
                              setIsAddingCategory(true);
                              setEditingProject({ ...editingProject, category: '' });
                            } else {
                              setIsAddingCategory(false);
                              setEditingProject({ ...editingProject, category: e.target.value });
                            }
                          }}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold appearance-none outline-none focus:border-indigo-500 transition-colors"
                        >
                          <option value="" disabled>Select Category</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                          <option value="new">+ Add New Category...</option>
                        </select>
                        {!isAddingCategory && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <FiChevronDown size={16} />
                          </div>
                        )}
                      </div>

                      {isAddingCategory && (
                        <div className="animate-slide-up">
                          <Input
                            autoFocus
                            value={editingProject.category || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                            placeholder="Enter new category name..."
                            className="w-full"
                          />
                          <p className="text-[10px] text-slate-500 mt-2 italic">This new category will be saved with the project.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                   <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Image URL</label>
                    <div className="flex gap-2">
                      <Input
                        value={editingProject.image || editingProject.img || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value, img: e.target.value })}
                        placeholder="https://..."
                        className="flex-1"
                      />
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex-shrink-0"
                      >
                        {uploading ? <FiRefreshCw className="animate-spin" /> : <FiCloudLightning />}
                      </Button>
                    </div>
                    {uploading && <p className="text-[10px] text-indigo-500 mt-1 animate-pulse font-bold uppercase tracking-widest">Uploading to Cloudinary...</p>}
                    
                    {(editingProject.image || editingProject.img) && (
                      <div className="mt-4 relative group">
                        <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/5 bg-slate-900/50">
                          <img 
                            src={editingProject.image || editingProject.img} 
                            alt="Preview" 
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                          />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-[10px] font-bold uppercase tracking-[0.3em] bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">Preview Sync Active</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Visibility</label>
                    <Button
                      variant={editingProject.is_hidden ? 'outline' : 'outline'}
                      onClick={() => setEditingProject({ ...editingProject, is_hidden: !editingProject.is_hidden })}
                      className="w-full items-center justify-between"
                    >
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {editingProject.is_hidden ? 'Hidden / Private' : 'Visible / Public'}
                      </span>
                      {editingProject.is_hidden ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Description</label>
                <textarea
                  rows={4}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full resize-none p-2"
                  placeholder="Detailed project breakdown..."
                />
              </div>
            </div>

            <div className="p-10 bg-background/50 border-t border-border/50 flex items-center justify-end gap-4">
              <button
                onClick={() => { setEditingProject(null); setIsAddingCategory(false); }}
                className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors px-4 py-2"
              >
                Discard Changes
              </button>
              <Button
                variant="primary"
                onClick={updateProject}
                disabled={saving || uploading}
              >
                {saving ? <FiRefreshCw className="animate-spin" /> : <FiCloudLightning />}
                {saving ? 'Synchronizing...' : 'Update Mission'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex-1 flex flex-col p-6 lg:flex-row justify-between items-start lg:items-center gap-6 mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--admin-title)]">Asset Showcase</h2>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
            Node Showcase v4.2 // Unified Asset Management
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedProjects.size > 0 && (
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              className="flex items-center gap-2"
            >
              <FiTrash size={16} />
              <span className="hidden sm:inline">Delete {selectedProjects.size}</span>
            </Button>
          )}
          <Button
            variant="outline"
            onClick={addProject}
            className="flex items-center gap-2"
            disabled={saving}
          >
            <FiPlus className="text-xl group-hover:rotate-90 transition-transform duration-500" />
            <span className="hidden sm:inline">New Mission</span>
          </Button>
        </div>
      </div>

      {/* Search & Add Section */}
      <div className="mb-8">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Search Input */}
          <div className="flex items-center">
            <FiSearch className="w-5 h-5 text-slate-500" />
            <Input
              type="text"
              placeholder="Search projects by name, category, or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-0"
            />
            {searchQuery && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSearchQuery('')}
                className="-ml-2"
              >
                <FiX size={14} />
              </Button>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="relative w-fit">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 ${showFilters ? 'text-[var(--first-color)] border-[var(--first-color)]' : ''}`}
            >
              <FiFilter size={16} />
              <span className="hidden sm:inline">
                {filterStatus === 'all' ? 'All Status' :
                 filterStatus === 'online' ? 'Online Only' : 'Offline Only'}
              </span>
              <FiChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>

            {showFilters && (
              <div className="absolute top-full left-0 mt-3 w-56 z-50">
                <div className="admin-dropdown-menu">
                  {[ 
                    { value: 'all', label: 'All Projects', icon: <FiGrid size={16} /> },
                    { value: 'online', label: 'Online Only', icon: <FiEye size={16} /> },
                    { value: 'offline', label: 'Offline Only', icon: <FiEyeOff size={16} /> },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setFilterStatus(option.value);
                        setShowFilters(false);
                      }}
                      className={`admin-dropdown-item ${filterStatus === option.value ? 'active' : ''}`}
                    >
                      <span className="flex-1 flex items-center gap-3">
                        {option.icon}
                        {option.label}
                      </span>
                      {filterStatus === option.value && <FiCheck size={14} strokeWidth={3} />}
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
                className={`flex items-center gap-2 ${showCategoryFilters ? 'text-[var(--first-color)] border-[var(--first-color)]' : ''}`}
              >
                <FiGrid size={16} />
                <span className="hidden sm:inline">
                  {filterCategory === 'all' ? 'All Categories' : filterCategory}
                </span>
                <FiChevronDown size={14} className={`transition-transform ${showCategoryFilters ? 'rotate-180' : ''}`} />
              </Button>

              {showCategoryFilters && (
                <div className="absolute top-full left-0 mt-3 w-56 z-50">
                  <div className="admin-dropdown-menu max-h-60 overflow-y-auto">
                    <button
                      onClick={() => {
                        setFilterCategory('all');
                        setShowCategoryFilters(false);
                      }}
                      className={`admin-dropdown-item ${filterCategory === 'all' ? 'active' : ''}`}
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
                        className={`admin-dropdown-item ${filterCategory === cat ? 'active' : ''}`}
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
          <div className="flex items-center w-48">
            <Button
              variant="outline"
              onClick={() => setViewMode('grid')}
              className={`flex-1 ${viewMode === 'grid' ? 'text-[var(--first-color)]' : ''}`}
            >
              <FiGrid size={18} />
            </Button>
            <Button
              variant="outline"
              onClick={() => setViewMode('list')}
              className={`flex-1 ${viewMode === 'list' ? 'text-[var(--first-color)]' : ''}`}
            >
              <FiList size={18} />
            </Button>
          </div>
        </div>

        {/* Filter Pills & Stats */}
        <div className="mt-8 flex flex-wrap gap-3">
          <div className="flex items-center gap-10 p-6">
            {(searchQuery || filterStatus !== 'all') && (
              <>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Active filters:
                </span>
                {searchQuery && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-500/20 text-slate-400">
                    Search: "{searchQuery}"
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSearchQuery('')}
                      className="-ml-2"
                    >
                      <FiX size={10} />
                    </Button>
                  </span>
                )}
                {filterStatus !== 'all' && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${filterStatus === 'online' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-destructive/20 text-destructive'}`}>
                    {filterStatus === 'online' ? 'Online' : 'Offline'}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setFilterStatus('all')}
                      className="-ml-2"
                    >
                      <FiX size={10} />
                    </Button>
                  </span>
                )}
                {filterCategory !== 'all' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400">
                    Category: {filterCategory}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setFilterCategory('all')}
                      className="-ml-2"
                    >
                      <FiX size={10} />
                    </Button>
                  </span>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={clearSearch}
                  className="text-slate-500 hover:text-[var(--first-color)] transition-colors"
                >
                  Clear all
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-4">
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
      ) : (
        /* List View */
        <div className="space-y-4">
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
      className={`group relative overflow-hidden stagger-${(index % 5) + 1} transition-all duration-500 hover:scale-[1.01] ${isSelected ? 'ring-2 ring-[var(--admin-accent)] shadow-[0_0_40px_var(--admin-accent-glow)]' : ''}`}
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={project.image || project.img || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop'}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-90" />

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
            className={`px-4 py-2 rounded-xl backdrop-blur-xl border transition-all flex items-center gap-3 ${project.is_hidden
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}
          >
            {project.is_hidden ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
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
          className={`absolute top-4 left-4 w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
            isSelected
              ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/40'
              : 'bg-black/20 backdrop-blur-md border-white/20 text-white/40 hover:border-white/40'
          }`}
        >
          {isSelected && <FiCheck size={12} strokeWidth={4} />}
        </button>
      </div>

      {/* Content Section */}
      <div className="p-6 lg:p-8 flex-1 flex flex-col gap-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 rounded-md text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 uppercase tracking-tighter">
            {project.category || 'Portfolio Item'}
          </span>
          <span className="text-xs text-slate-600 font-medium uppercase tracking-widest">
            Last Sync: {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'Just Now'}
          </span>
        </div>

        <h4 className="text-lg font-bold text-[var(--admin-title)] mb-2 tracking-tight group-hover:text-[var(--admin-accent)] transition-colors">
          {project.title}
        </h4>

        <p className="text-xs text-slate-400 line-clamp-2 group-hover:line-clamp-none leading-relaxed mb-6 opacity-70 group-hover:opacity-100 transition-opacity">
          {project.description}
        </p>

        {/* Action Row */}
        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <div className="flex gap-2 opacity-80 hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="px-6 py-2.5 font-bold hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all"
            >
              Edit Details
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-11 h-11 rounded-xl bg-rose-500/5 text-rose-400 border-none !ring-0 !ring-offset-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 hover:bg-rose-500/10 transition-all flex items-center justify-center shadow-lg hover:shadow-rose-500/10"
          >
            <FiTrash2 size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProjectListItem({ project, index, isSelected, onToggleSelect, onToggleVisibility, onEdit, onDelete }) {
  return (
    <div
      className={`flex items-center gap-6 transition-all duration-300 hover:bg-white/2 ${isSelected ? 'ring-2 ring-indigo-500/50 bg-indigo-500/[0.02]' : ''}`}
    >
      <button
        onClick={onToggleSelect}
        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 ${
          isSelected
            ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg'
            : 'border-white/10 bg-white/5 hover:border-white/30'
        }`}
      >
        {isSelected && <FiCheck size={12} strokeWidth={4} />}
      </button>

      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 flex-shrink-0 border border-white/5">
        <img
          src={project.image || project.img || 'https://via.placeholder.com/150'}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
            {project.title}
          </h4>
          <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-white/5 text-slate-500 border border-white/5 uppercase tracking-tighter">
            {project.category}
          </span>
        </div>
        <p className="text-xs text-slate-500 truncate opacity-60 group-hover:opacity-100 transition-opacity">
          {project.description}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleVisibility}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
            project.is_hidden
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}
        >
          {project.is_hidden ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border-none hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
        >
          <FiEdit3 size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="hover:bg-rose-500 hover:text-white transition-all w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border-none !ring-0 !ring-offset-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 shadow-lg hover:shadow-rose-500/10"
        >
          <FiTrash2 size={18} />
        </Button>
        <a
          href={project.details?.[3]?.desc?.props?.href || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:bg-indigo-500 hover:text-white transition-all w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border-none flex items-center justify-center shadow-lg hover:shadow-indigo-500/10"
        >
          <FiExternalLink size={18} />
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