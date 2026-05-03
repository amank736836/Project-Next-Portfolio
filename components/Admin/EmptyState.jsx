'use client';

import { FiBox, FiGrid, FiUser, FiCode, FiBook, FiBriefcase, FiPlus, FiSearch, FiInbox } from 'react-icons/fi';

const icons = {
  projects: <FiGrid className="text-indigo-400" size={48} />,
  skills: <FiCode className="text-indigo-400" size={48} />,
  info: <FiUser className="text-indigo-400" size={48} />,
  education: <FiBook className="text-indigo-400" size={48} />,
  experience: <FiBriefcase className="text-indigo-400" size={48} />,
  default: <FiBox className="text-indigo-400" size={48} />,
  search: <FiSearch className="text-slate-500" size={48} />,
  inbox: <FiInbox className="text-slate-500" size={48} />,
};

const titles = {
  projects: 'No Projects Found',
  skills: 'Skill Matrix Empty',
  info: 'Identity Data Absent',
  education: 'Academy Records Missing',
  experience: 'Mission Logs Empty',
  default: 'No Data Available',
  search: 'No Results Found',
  inbox: 'All Clear',
};

const descriptions = {
  projects: 'The showcase is currently empty. Add your first project to begin populating the portfolio matrix.',
  skills: 'No capabilities detected in the system. Inject new skills to build your technical proficiency matrix.',
  info: 'Identity nodes are not yet configured. Initialize personal data to establish your profile.',
  education: 'Academic records are absent from the database. Add your educational background to complete the profile.',
  experience: 'No mission logs recorded. Document your work experience to build a comprehensive career timeline.',
  default: 'The data stream is currently empty. Initialize data collection to populate this sector.',
  search: 'Your search query returned no matches. Try adjusting your search terms or filters.',
  inbox: 'There are no pending items requiring your attention at this time.',
};

export default function EmptyState({ 
  type = 'default',
  title,
  description,
  action,
  actionLabel = 'Initialize',
  icon,
  className = ''
}) {
  const displayIcon = icon || icons[type] || icons.default;
  const displayTitle = title || titles[type] || titles.default;
  const displayDescription = description || descriptions[type] || descriptions.default;

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-8 ${className}`}>
      {/* Animated container */}
      <div className="relative mb-8">
        {/* Background glow */}
        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
        
        {/* Icon container */}
        <div className="relative w-24 h-24 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center animate-float">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-transparent" />
          {displayIcon}
        </div>
        
        {/* Orbiting dots decoration */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
          <div className="absolute -top-1 left-1/2 w-2 h-2 bg-indigo-400/50 rounded-full transform -translate-x-1/2" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
          <div className="absolute top-1/2 -right-1 w-1.5 h-1.5 bg-emerald-400/50 rounded-full transform -translate-y-1/2" />
        </div>
      </div>

      {/* Text content */}
      <div className="text-center max-w-md">
        <h3 className="text-xl font-black tracking-tight mb-3 text-white">
          {displayTitle}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          {displayDescription}
        </p>

        {/* Action button */}
        {action && (
          <button
            onClick={action}
            className="admin-btn admin-btn-primary group"
          >
            <FiPlus className="group-hover:rotate-90 transition-transform duration-300" />
            {actionLabel}
          </button>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}

// Specialized empty states for common use cases
export function EmptyProjects({ onAdd }) {
  return (
    <EmptyState 
      type="projects" 
      action={onAdd} 
      actionLabel="New Mission"
    />
  );
}

export function EmptySkills({ onAdd }) {
  return (
    <EmptyState 
      type="skills" 
      action={onAdd} 
      actionLabel="Inject Skill"
    />
  );
}

export function EmptyInfo({ onAdd }) {
  return (
    <EmptyState 
      type="info" 
      action={onAdd} 
      actionLabel="Add Identity Data"
    />
  );
}

export function EmptyEducation({ onAdd }) {
  return (
    <EmptyState 
      type="education" 
      action={onAdd} 
      actionLabel="Add Academy Record"
    />
  );
}

export function EmptyExperience({ onAdd }) {
  return (
    <EmptyState 
      type="experience" 
      action={onAdd} 
      actionLabel="Log Mission"
    />
  );
}

export function EmptySearch({ searchTerm, onClear }) {
  return (
    <EmptyState 
      type="search"
      title={`No results for "${searchTerm}"`}
      description="Try adjusting your search terms or clearing filters to find what you're looking for."
      action={onClear}
      actionLabel="Clear Search"
    />
  );
}
