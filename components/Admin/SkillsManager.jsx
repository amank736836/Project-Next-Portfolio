'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  FiPlus, FiSearch, FiFilter, FiChevronDown, FiX, FiEye, FiEyeOff, FiGrid, FiList
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

export default function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showCategoryFilters, setShowCategoryFilters] = useState(false);
  const [categories, setCategories] = useState(['Frontend', 'Backend', 'Database', 'DevOps', 'Tools']);
  const [viewMode, setViewMode] = useState('grid'); // 'list' | 'grid'
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
    fetchSkills();
    fetchCategories();
  }, [fetchSkills, fetchCategories]);

  const openNewSkillForm = () => {
    setEditingSkill({
      title: '',
      percentage: 85,
      category: 'General',
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

  return (
    <div className="animate-fade-in pb-10">
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

      <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[var(--admin-title)]">Skill Matrix</h2>
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
            Manage skills & hero badges — {featuredCount}/5 featured, {hiddenCount} hidden
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Button
            onClick={openNewSkillForm}
            className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 h-10 sm:h-12 rounded-lg sm:rounded-xl bg-[var(--admin-accent)] hover:brightness-110 text-white transition-all group text-xs sm:text-sm shadow-[0_0_20px_rgba(var(--admin-accent-rgb),0.4)] border-none"
          >
            <FiPlus className="group-hover:rotate-90 transition-transform duration-300" size={18} />
            <span className="font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]">New Skill</span>
          </Button>
        </div>
      </div>

      <div className="mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8">

        {/* Row 1: Search bar — full width */}
        <div className="flex items-center gap-2 bg-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 border border-white/10 focus-within:border-[var(--admin-accent)] focus-within:shadow-[0_0_15px_rgba(var(--admin-accent-rgb),0.2)] transition-all h-10 sm:h-11 mb-3">
          <FiSearch className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <Input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-0 bg-transparent border-none text-xs sm:text-sm outline-none h-full"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-white transition-colors p-1">
              <FiX size={14} />
            </button>
          )}
        </div>

        {/* Row 2: Filters + view toggle */}
        <div className="flex items-center gap-2 flex-wrap">

          {/* Category filter */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => {
                setShowCategoryFilters(!showCategoryFilters);
                if (!showCategoryFilters) setIsAddingCategory(false);
              }}
              className={`flex items-center gap-1.5 text-xs px-3 h-9 rounded-lg ${showCategoryFilters ? 'text-[var(--first-color)] border-[var(--first-color)]' : ''}`}
            >
              <FiFilter size={13} />
              <span>{filterCategory === 'all' ? 'All Categories' : filterCategory}</span>
              <FiChevronDown size={11} className={`transition-transform ${showCategoryFilters ? 'rotate-180' : ''}`} />
            </Button>
            <CategoryFilter
              categories={categories}
              currentCategory={filterCategory}
              onSelect={setFilterCategory}
              isOpen={showCategoryFilters}
              onToggle={() => setShowCategoryFilters(!showCategoryFilters)}
            />
          </div>

          {/* Category manager */}
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

          {/* Stats */}
          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-600 ml-2">
            <span className="font-mono">{filteredSkills.length}{filteredSkills.length !== skills.length ? ` / ${skills.length}` : ''} skills</span>
            <span className={featuredCount >= 5 ? 'text-amber-400' : ''}>{featuredCount}/5 featured</span>
            {hiddenCount > 0 && <span>{hiddenCount} hidden</span>}
          </div>

          {/* View toggle — right edge */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">View</span>
            <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="h-7 w-7"
                title="List view"
              >
                <FiList size={14} />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="h-7 w-7"
                title="Grid view"
              >
                <FiGrid size={14} />
              </Button>
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {(searchQuery || filterCategory !== 'all') && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/20 text-slate-400 border border-slate-500/20">
                &ldquo;{searchQuery}&rdquo;
                <button onClick={() => setSearchQuery('')} className="hover:text-white transition-colors">
                  <FiX size={9} />
                </button>
              </span>
            )}
            {filterCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">
                {filterCategory}
                <button onClick={() => setFilterCategory('all')} className="hover:text-white transition-colors">
                  <FiX size={9} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {skills.length === 0 ? (
        <EmptySkills onAdd={openNewSkillForm} />
      ) : filteredSkills.length === 0 ? (
        <EmptySearchSkill searchTerm={searchQuery} onClear={() => { setSearchQuery(''); setFilterCategory('all'); }} />
      ) : (
        <div className="px-4 sm:px-6 lg:px-8">
          {viewMode === 'list' ? (
            <div className="space-y-2 sm:space-y-3">
              {filteredSkills.map((skill, idx) => (
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
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