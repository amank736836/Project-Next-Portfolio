'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { 
  FiPlus, FiTrash,
  FiSearch, FiFilter, FiGrid, FiList,
  FiX, FiChevronDown
} from 'react-icons/fi';
import { useToast, useSuccessToast, useErrorToast } from './Toast';
import { useDeleteConfirm } from './ConfirmModal';
import EditProjectForm from './EditProjectForm';
import EmptyState, { EmptyProjects, EmptySearch } from './EmptyState';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import StatusFilter from './StatusFilter';
import CategoryFilter from './CategoryFilter';
import { ProjectCard, ProjectListItem } from './ProjectItems';

import ProjectManagerHeader from './ProjectManager/ProjectManagerHeader';
import ProjectFilters from './ProjectManager/ProjectFilters';
import ProjectGridView from './ProjectManager/ProjectGridView';
import ProjectListView from './ProjectManager/ProjectListView';
import ProjectSkeleton from './ProjectManager/ProjectSkeleton';

const normalizeProject = (project) => {
  let details = project?.details;

  for (let attempt = 0; attempt < 2 && typeof details === 'string'; attempt += 1) {
    try {
      details = JSON.parse(details);
    } catch {
      details = [];
    }
  }

  return {
    ...project,
    details: Array.isArray(details) ? details : [],
  };
};

export default function ProjectManager({ initialProjects }) {
  const [projects, setProjects] = useState(() =>
    Array.isArray(initialProjects) ? initialProjects.map(normalizeProject) : []
  );
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(!initialProjects);
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

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      const processed = (Array.isArray(data) ? data : []).map(normalizeProject);
      setProjects(processed);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      errorToast('Failed to load projects from the matrix');
    } finally {
      setLoading(false);
    }
  }, [errorToast]);

  useEffect(() => {
    if (!initialProjects) fetchProjects();
  }, [fetchProjects, initialProjects]);

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
  }, [projects, searchQuery, filterStatus, filterCategory]);

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
    <div className="showcase-page animate-fade-in pb-10">
      {/* Edit Form rendered via portal to escape CSS transform containing block */}
      {typeof window !== 'undefined' && editingProject && createPortal(
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
      <ProjectManagerHeader
        onAddProject={openNewProjectForm}
        selectedCount={selectedProjects.size}
        onBulkDelete={handleBulkDelete}
      />

      {/* Search & Filter Section */}
      <ProjectFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        showCategoryFilters={showCategoryFilters}
        setShowCategoryFilters={setShowCategoryFilters}
        viewMode={viewMode}
        setViewMode={setViewMode}
        categories={categories}
        onClearSearch={clearSearch}
        projects={projects}
        filteredProjects={filteredProjects}
      />

      {/* Empty States */}
      {projects.length === 0 ? (
        <EmptyProjects onAdd={openNewProjectForm} />
      ) : filteredProjects.length === 0 ? (
        <EmptySearch
          searchTerm={searchQuery}
          onClear={clearSearch}
        />
      ) : loading ? (
        <ProjectSkeleton />
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <ProjectGridView
          filteredProjects={filteredProjects}
          selectedProjects={selectedProjects}
          onToggleSelect={toggleSelection}
          onToggleVisibility={toggleVisibility}
          onEdit={setEditingProject}
          onDelete={handleDelete}
        />
      ) : (
        /* List View */
        <ProjectListView
          filteredProjects={filteredProjects}
          selectedProjects={selectedProjects}
          onToggleSelect={toggleSelection}
          onToggleVisibility={toggleVisibility}
          onEdit={setEditingProject}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
