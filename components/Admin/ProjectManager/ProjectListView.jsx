'use client';

import { ProjectListItem } from '../ProjectItems';

export default function ProjectListView({ 
  filteredProjects, 
  selectedProjects, 
  onToggleSelect, 
  onToggleVisibility, 
  onEdit, 
  onDelete 
}) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 space-y-2 sm:space-y-3">
      {filteredProjects.map((project, idx) => (
        <ProjectListItem
          key={project.id}
          project={project}
          index={idx}
          isSelected={selectedProjects.has(project.id)}
          onToggleSelect={() => onToggleSelect(project.id)}
          onToggleVisibility={() => onToggleVisibility(project.id, project.is_hidden)}
          onEdit={() => onEdit(project)}
          onDelete={() => onDelete(project)}
        />
      ))}
    </div>
  );
}