'use client';

import { ProjectCard } from '../ProjectItems';

export default function ProjectGridView({ 
  filteredProjects, 
  selectedProjects, 
  onToggleSelect, 
  onToggleVisibility, 
  onEdit, 
  onDelete 
}) {
  return (
    <div className="showcase-grid-content px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {filteredProjects.map((project, idx) => (
          <ProjectCard
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
    </div>
  );
}
