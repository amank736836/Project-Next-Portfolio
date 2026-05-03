'use client';

import { useState, useEffect } from 'react';
import { FiEye, FiEyeOff, FiEdit, FiTrash, FiPlus, FiExternalLink, FiCode, FiActivity } from 'react-icons/fi';

export default function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (id, currentStatus) => {
    const res = await fetch('/api/admin/projects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_hidden: !currentStatus }),
    });
    if (res.ok) fetchProjects();
  };

  if (loading) return <ProjectSkeleton />;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-16">
        <div>
          <h2 className="admin-title">Asset Showcase</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Node Showcase v4.2 // Unified Asset Management</p>
        </div>
        <button className="admin-btn admin-btn-primary group">
          <FiPlus className="text-xl group-hover:rotate-90 transition-transform duration-500" /> New Mission
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {projects.map((project, idx) => (
          <div key={project.id} className={`admin-card group !p-0 overflow-hidden stagger-${(idx % 5) + 1} !rounded-2xl w-full`}>
            {/* Image Section */}
            <div className="relative h-24 overflow-hidden bg-slate-900">
              <img 
                src={project.img} 
                alt={project.title} 
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--container-color)] via-transparent to-transparent opacity-80" />
              
              {/* Status Badge */}
              <div className="absolute top-4 right-4 scale-90 origin-top-right">
                <button 
                  onClick={() => toggleVisibility(project.id, project.is_hidden)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl border transition-all duration-500 group/status ${
                    project.is_hidden 
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${project.is_hidden ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                  {project.is_hidden ? <FiEyeOff size={12} className="group-hover/status:rotate-12 transition-transform" /> : <FiEye size={12} className="group-hover/status:scale-110 transition-transform" />}
                  <span className="text-[8px] font-black uppercase tracking-[0.2em]">{project.is_hidden ? 'Offline' : 'Online'}</span>
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="min-w-0">
                  <h3 className="text-sm font-black tracking-tight mb-0.5 group-hover:text-[var(--first-color)] transition-colors truncate">{project.title}</h3>
                  <div className="flex items-center gap-1.5">
                     <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest truncate">Sector {idx + 1}</span>
                     <div className="w-0.5 h-0.5 bg-slate-500 rounded-full" />
                     <span className="text-[7px] font-black text-[var(--first-color)] uppercase tracking-widest truncate">{project.category || 'Module'}</span>
                  </div>
                </div>
                <div className="w-8 h-8 flex-shrink-0 bg-[var(--first-color)]/5 rounded-lg flex items-center justify-center text-[var(--first-color)] border border-[var(--first-color)]/10 shadow-inner">
                   <FiActivity size={12} className="animate-pulse" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-2 pt-4 border-t border-[var(--border-color)]">
                 <div className="flex gap-1.5">
                    <button className="admin-btn admin-btn-secondary !px-3 !py-2 !gap-1.5 !rounded-lg">
                       <FiEdit size={12} /> <span className="text-[7px]">Edit</span>
                    </button>
                    <button className="admin-icon-btn hover:!bg-rose-500 hover:!text-white hover:!border-rose-500 !w-8 !h-8 !rounded-lg">
                       <FiTrash size={14} />
                    </button>
                 </div>
                 <a 
                   href={project.details?.[3]?.desc?.props?.href || '#'} 
                   target="_blank"
                   className="admin-icon-btn !w-8 !h-8 !rounded-lg"
                 >
                   <FiExternalLink size={14} />
                 </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectSkeleton() {
  return (
    <div className="space-y-12 animate-pulse">
       <div className="flex justify-between items-center">
          <div className="h-16 w-64 bg-[var(--container-color)] rounded-2xl" />
          <div className="h-16 w-48 bg-[var(--container-color)] rounded-2xl" />
       </div>
       <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
             <div key={i} className="h-[380px] bg-[var(--container-color)] rounded-3xl border border-[var(--border-color)]" />
          ))}
       </div>
    </div>
  );
}
