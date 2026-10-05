"use client";

import { useEffect, useState } from "react";
import ProjectManager from "@/components/Admin/ProjectManager";

export default function ShowcasePageClient() {
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/projects');
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch showcase data:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="admin-reveal pb-10">
        <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[var(--admin-title)]">Showcase</h2>
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
              Manage portfolio projects
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="w-32 h-10 bg-white/5 rounded-lg border border-white/10 animate-pulse" />
          </div>
        </div>

        <div className="mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2 bg-white/5 rounded-lg sm:rounded-xl px-3 sm:px-4 border border-white/10 animate-pulse h-10 sm:h-11" />
            <div className="flex items-center gap-2 bg-white/5 rounded-lg sm:rounded-xl px-3 sm:px-4 border border-white/10 animate-pulse h-10 sm:h-11" />
            <div className="flex items-center gap-2 bg-white/5 rounded-lg sm:rounded-xl px-3 sm:px-4 border border-white/10 animate-pulse h-10 sm:h-11" />
            <div className="flex items-center gap-2 bg-white/5 rounded-lg sm:rounded-xl px-3 sm:px-4 border border-white/10 animate-pulse h-10 sm:h-11" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {[...Array(8)].map((_, idx) => (
            <div key={idx} className="reveal-scale bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 animate-pulse">
              <div className="aspect-video bg-white/5 rounded-lg mb-3" />
              <div className="h-5 w-3/4 bg-white/5 rounded animate-pulse mb-2" />
              <div className="h-3 w-1/2 bg-white/5 rounded animate-pulse mb-3" />
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-white/5 rounded-full animate-pulse" />
                <div className="h-6 w-24 bg-white/5 rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <ProjectManager initialProjects={projects} />;
}