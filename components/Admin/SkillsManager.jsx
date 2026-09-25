'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  FiPlus, FiSearch, FiFilter, FiChevronDown, FiX, FiEye, FiEyeOff, FiGrid, FiList,
  FiCode, FiServer, FiDatabase, FiCpu, FiZap, FiKey
} from 'react-icons/fi';
import { useToast, useSuccessToast, useErrorToast } from './Toast';
import { useDeleteConfirm } from './ConfirmModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLoading } from './LoadingContext';
import EditSkillForm from './Skills/EditSkillForm';
import SkillCard from './Skills/SkillCard';
import SkillGridCard from './Skills/SkillGridCard';
import CategoryManager from './Skills/CategoryManager';
import CategoryFilter from './Skills/CategoryFilter';
import { EmptySkills, EmptySearchSkill } from './Skills/EmptyStates';

export default function SkillsManager({ initialSkills, initialCategories }) {
  const [skills, setSkills] = useState(initialSkills || []);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(!initialSkills);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showCategoryFilters, setShowCategoryFilters] = useState(false);
  const [categories, setCategories] = useState(initialCategories?.map(c => c.name) || ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools']);
  const [viewMode, setViewMode] = useState('grid');
  const [editingSkill, setEditingSkill] = useState(null);
  const [saving, setSaving] = useState(false);
  const modalRef = useRef(null);

  const { startLoading, stopLoading } = useLoading();
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const confirmDelete = useDeleteConfirm();

  const fetchSkills = useCallback(async () => {
    startLoading();
    try {
      const res = await fetch('/api/admin/skills');
      const data = await res.json();
      setSkills(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
      errorToast('Failed to load skills');
    } finally {
      setLoading(false);
      stopLoading();
    }
  }, [errorToast, startLoading, stopLoading]);

  const fetchCategories = useCallback(async () => {
    startLoading();
    try {
      const res = await fetch('/api/admin/skill-categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data.map(c => c.name) : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  useEffect(() => {
    if (!initialSkills) fetchSkills();
    if (!initialCategories) fetchCategories();
  }, [fetchSkills, fetchCategories, initialSkills, initialCategories]);

  const openNewSkillForm = (prefillCategory) => {
    setEditingSkill({
      title: '',
      percentage: 85,
      category: prefillCategory || 'General',
      icon: '⭐',
      color: '#6B7280',
      is_featured: false,
      is_hidden: false,
    });
  };

  const handleSaveSkill = async (skillData) => {
    startLoading();
    setSaving(true);
    try {
      const isNew = !skillData.id;
      const res = await fetch('/api/admin/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([skillData, ...skills.filter(s => s.id !== skillData.id).map(s => ({ ...s, is_featured: s.is_featured, is_hidden: s.is_hidden }))]),
      });

      if (res.ok) {
        fetchSkills();
        successToast(isNew ? 'Skill added to matrix' : 'Skill updated');
        setEditingSkill(null);
      } else {
        errorToast('Failed to save skill');
      }
    } catch (error) {
      console.error('Failed to save skill:', error);
      errorToast('Failed to save skill');
    } finally {
      setSaving(false);
      stopLoading();
    }
  };

  const handleDelete = async (skill) => {
    const confirmed = await confirmDelete(`"${skill.title}"`);
    if (confirmed) {
      startLoading();
      try {
        const res = await fetch(`/api/admin/skills?id=${skill.id}`, { method: 'DELETE' });
        if (res.ok) {
          setSkills(current => current.filter(item => item.id !== skill.id));
          successToast('Skill removed from matrix');
        } else {
          errorToast('Failed to delete skill');
        }
      } catch (error) {
        console.error('Failed to delete skill:', error);
        errorToast('Failed to delete skill');
      } finally {
        stopLoading();
      }
    }
  };

  const toggleFeatured = async (skill) => {
    const featuredCount = skills.filter(s => s.is_featured && s.id !== skill.id).length;
    if (!skill.is_featured && featuredCount >= 5) {
      errorToast('Maximum 5 featured skills allowed for hero section');
      return;
    }

    startLoading();
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skills.map(s => s.id === skill.id ? { ...s, is_featured: !s.is_featured } : s)),
      });
      if (res.ok) {
        fetchSkills();
        successToast(skill.is_featured ? 'Removed from hero badges' : 'Added to hero badges');
      }
    } catch (error) {
      errorToast('Failed to update featured status');
    } finally {
      stopLoading();
    }
  };

  const toggleVisibility = async (skill) => {
    startLoading();
    try {
      const res = await fetch(`/api/admin/skills?id=${skill.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_hidden: !skill.is_hidden }),
      });
      if (res.ok) {
        fetchSkills();
        successToast(skill.is_hidden ? 'Skill is now visible' : 'Skill is now hidden');
      } else {
        errorToast('Failed to update visibility');
      }
    } catch (error) {
      errorToast('Failed to update visibility');
    } finally {
      stopLoading();
    }
  };

  const addCategory = async () => {
    if (!newCategoryName.trim()) return;
    const name = newCategoryName.trim();
    startLoading();
    try {
      const res = await fetch('/api/admin/skill-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const cat = await res.json();
        setCategories(prev => [...prev, cat.name]);
        setNewCategoryName('');
        setIsAddingCategory(false);
        successToast(`Category "${name}" added`);
      } else {
        const err = await res.json();
        errorToast(err.error || 'Failed to add category');
      }
    } catch (error) {
      errorToast('Failed to add category');
    } finally {
      stopLoading();
    }
  };

  const deleteCategory = async (cat) => {
    const confirmed = await confirmDelete(`Category "${cat}"`);
    if (confirmed) {
      startLoading();
      try {
        const res = await fetch(`/api/admin/skill-categories?id=${encodeURIComponent(cat)}`, { method: 'DELETE' });
        if (res.ok) {
          setCategories(c => c.filter(c => c !== cat));
          setSkills(s => s.map(skill => skill.category === cat ? { ...skill, category: 'General' } : skill));
          successToast('Category removed');
        } else {
          const err = await res.json();
          errorToast(err.error || 'Failed to delete category');
        }
      } catch (error) {
        errorToast('Failed to delete category');
      } finally {
        stopLoading();
      }
    }
  };

  const filteredSkills = useMemo(() => {
    let result = skills;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.title?.toLowerCase().includes(query) ||
        s.category?.toLowerCase().includes(query)
      );
    }
    if (filterCategory !== 'all') {
      result = result.filter(s => s.category === filterCategory);
    }
    return result.sort((a, b) => {
      if (a.is_featured !== b.is_featured) return b.is_featured - a.is_featured;
      return (a.id || 0) - (b.id || 0);
    });
  }, [skills, searchQuery, filterCategory]);

  const featuredCount = skills.filter(s => s.is_featured).length;
  const hiddenCount = skills.filter(s => s.is_hidden).length;

  // Category icon mapping
  const categoryIcons = {
    'Frontend': FiCode,
    'Backend': FiServer,
    'Database': FiDatabase,
    'DevOps': FiCpu,
    'Tools': FiZap,
    'General': FiZap,
  };

  // Category colors for visual distinction
  const categoryColors = {
    'Frontend': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    'Backend': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    'Database': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    'DevOps': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    'Tools': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    'General': 'text-slate-400 bg-slate-400/10 border-slate-400/20',
  };

  // Group skills by category for list view
  const groupedSkills = useMemo(() => {
    const groups = {};
    for (const skill of filteredSkills) {
      const cat = skill.category || 'General';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(skill);
    }
    const categoryOrder = ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools'];
    return Object.entries(groups)
      .sort(([a], [b]) => {
        const aIdx = categoryOrder.indexOf(a);
        const bIdx = categoryOrder.indexOf(b);
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        if (aIdx !== -1) return -1;
        if (bIdx !== -1) return 1;
        return a.localeCompare(b);
      });
  }, [filteredSkills]);

  return (
    <div className="matrix-page animate-fade-in pb-10">
      {typeof window !== 'undefined' && editingSkill && createPortal(
        <EditSkillForm
          editingSkill={editingSkill}
          setEditingSkill={setEditingSkill}
          categories={categories}
          onSave={handleSaveSkill}
          onRequestClose={() => setEditingSkill(null)}
          saving={saving}
          modalRef={modalRef}
        />,
        document.body
      )}

      {/* Header - Increased Hierarchy */}
      <div className="matrix-page-header flex-1 flex flex-col px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-6 lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6 mb-5">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--admin-title)]">Skill Matrix</h2>
          <p className="text-[12px] sm:text-xs font-medium uppercase tracking-wider text-slate-500">
            Manage skills & hero badges <span className="font-mono text-[var(--admin-accent)]">{featuredCount}/5</span> featured, <span className="font-mono text-slate-400">{hiddenCount}</span> hidden
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <CategoryManager
            categories={categories}
            setCategories={setCategories}
            isAddingCategory={isAddingCategory}
            setIsAddingCategory={(val) => {
              setIsAddingCategory(val);
              if (val) setShowCategoryFilters(false);
            }}
            newCategoryName={newCategoryName}
            setNewCategoryName={setNewCategoryName}
            onAddCategory={addCategory}
            onDeleteCategory={deleteCategory}
          />
          <Button
            onClick={openNewSkillForm}
            className="flex items-center gap-2 sm:gap-3 px-5 sm:px-7 h-11 sm:h-12 rounded-lg sm:rounded-xl !bg-[var(--admin-accent)] hover:brightness-110 !text-white transition-all group text-xs sm:text-sm shadow-[0_0_20px_rgba(var(--admin-accent-rgb),0.4)] border-none"
          >
            <FiPlus className="group-hover:rotate-90 transition-transform duration-300" size={18} />
            <span className="font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]">New Skill</span>
          </Button>
        </div>
      </div>

      {/* Toolbar - Search + Filters + View */}
      <div className="matrix-toolbar mb-5 mx-4 sm:mx-6 lg:mx-8 p-3 sm:p-4 rounded-2xl border border-white/10 bg-white/[0.025]">
        {/* Row 1: Search Bar - Primary Action */}
        <div className="relative mb-3">
          <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 sm:px-5 border border-white/10 focus-within:border-[var(--admin-accent)] focus-within:ring-2 focus-within:ring-[var(--admin-accent)]/20 focus-within:shadow-[0_0_20px_rgba(var(--admin-accent-rgb),0.15)] transition-all h-12 sm:h-13">
            <FiSearch className="w-5 h-5 text-slate-500 flex-shrink-0" />
            <Input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-0 bg-transparent border-none text-sm sm:text-base outline-none h-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-white transition-colors p-1.5">
                <FiX size={16} />
              </button>
            )}
            <kbd className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 text-[10px] font-mono text-slate-500 border border-white/10 ml-2">
              <FiKey size={12} /> <span>⌘K</span>
            </kbd>
          </div>
        </div>

        {/* Row 2: Filters + Stats + View Toggle */}
        <div className="matrix-toolbar-controls flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 flex-wrap">
          {/* Category Filter Dropdown */}
          <div className="relative w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => {
                setShowCategoryFilters(!showCategoryFilters);
                if (!showCategoryFilters) setIsAddingCategory(false);
              }}
              className={`category-filter-trigger flex items-center gap-2 text-sm px-4 h-10 rounded-lg ${showCategoryFilters ? 'text-[var(--first-color)] border-[var(--first-color)]' : ''}`}
            >
              <FiFilter size={14} />
              <span className="font-medium">{filterCategory === 'all' ? 'All Categories' : filterCategory}</span>
              <FiChevronDown size={12} className={`transition-transform ${showCategoryFilters ? 'rotate-180' : ''}`} />
            </Button>
            <CategoryFilter
              categories={categories}
              currentCategory={filterCategory}
              onSelect={setFilterCategory}
              isOpen={showCategoryFilters}
              onToggle={() => setShowCategoryFilters(!showCategoryFilters)}
            />
          </div>

          {/* Stats */}
          <div className="matrix-toolbar-stats hidden sm:flex items-center gap-4 text-[11px] font-medium text-slate-400 ml-auto sm:ml-0 border-t sm:border-t-0 pt-3 sm:pt-0">
            <span className="font-mono text-[var(--admin-title)]">{filteredSkills.length}<span className="text-slate-500">{filteredSkills.length !== skills.length ? ` / ${skills.length}` : ''}</span> skills</span>
            <span className={featuredCount >= 5 ? 'text-amber-400' : 'text-slate-400'}>★ {featuredCount}/5 featured</span>
            {hiddenCount > 0 && <span className="text-slate-500">🙈 {hiddenCount} hidden</span>}
          </div>

          {/* View Toggle - Larger Hit Area */}
          <div className="matrix-toolbar-view flex items-center gap-2 ml-auto w-full sm:w-auto justify-end">
            <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg"
                title="List view"
              >
                <FiList size={16} />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg"
                title="Grid view"
              >
                <FiGrid size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(searchQuery || filterCategory !== 'all') && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-3 border-t border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-500/20 text-slate-400 border border-slate-500/20">
                &ldquo;{searchQuery}&rdquo;
                <button onClick={() => setSearchQuery('')} className="hover:text-white transition-colors ml-1">
                  <FiX size={10} />
                </button>
              </span>
            )}
            {filterCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">
                {filterCategory}
                <button onClick={() => setFilterCategory('all')} className="hover:text-white transition-colors ml-1">
                  <FiX size={10} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {skills.length === 0 ? (
        <EmptySkills onAdd={openNewSkillForm} />
      ) : filteredSkills.length === 0 ? (
        <EmptySearchSkill searchTerm={searchQuery} onClear={() => { setSearchQuery(''); setFilterCategory('all'); }} />
      ) : (
        <div className="matrix-grid-content px-4 sm:px-6 lg:px-8">
          {viewMode === 'list' ? (
            /* List View - Category Sections */
            <div className="space-y-6">
              {groupedSkills.map(([category, categorySkills], catIdx) => {
                const CategoryIcon = categoryIcons[category] || FiZap;
                return (
                <div key={category} className="animate-fade-in" style={{ animationDelay: `${catIdx * 80}ms` }}>
                  {/* Category Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${categoryColors[category] || categoryColors.General}`}>
                        <CategoryIcon size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-[var(--admin-title)] tracking-tight">{category}</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{categorySkills.length} skill{categorySkills.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto h-px bg-gradient-to-r from-[var(--admin-accent)]/30 to-transparent" />
                  </div>

                  {/* Skills in this category */}
                  <div className="admin-card !p-3 overflow-hidden border-white/[0.05] hover:border-[var(--admin-accent)]/30 bg-white/[0.015] hover:bg-white/[0.03] transition-all duration-500 !rounded-[1.5rem]">
                    <div className="space-y-2">
                      {categorySkills.map((skill, idx) => (
                        <SkillCard
                          key={skill.id}
                          skill={skill}
                          index={idx}
                          onToggleFeatured={() => toggleFeatured(skill)}
                          onToggleVisibility={() => toggleVisibility(skill)}
                          isHidden={skill.is_hidden}
                          onEdit={() => setEditingSkill(skill)}
                          onDelete={() => handleDelete(skill)}
                          featuredCount={featuredCount}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Add Skill Button for Category - Compact */}
                  <button
                    onClick={() => openNewSkillForm(category)}
                    className="w-full mt-3 admin-btn-admin-secondary group flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-white/5 hover:border-[var(--admin-accent)]/30 bg-white/[0.01] hover:bg-white/[0.03] transition-all !rounded-[1.5rem]"
                  >
                    <FiPlus size={16} className="group-hover:rotate-90 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-[var(--admin-accent)] transition-colors">+ Add to {category}</span>
                  </button>
                </div>
              )})}
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSkills.map((skill, idx) => (
                <SkillGridCard
                  key={skill.id}
                  skill={skill}
                  index={idx}
                  onToggleFeatured={() => toggleFeatured(skill)}
                  onToggleVisibility={() => toggleVisibility(skill)}
                  isHidden={skill.is_hidden}
                  onEdit={() => setEditingSkill(skill)}
                  onDelete={() => handleDelete(skill)}
                  featuredCount={featuredCount}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
