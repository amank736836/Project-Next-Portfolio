"use client";

import { useEffect, useState } from "react";
import SkillsManager from "@/components/Admin/SkillsManager";

export default function MatrixPageClient() {
  const [skills, setSkills] = useState(null);
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [skillsRes, categoriesRes] = await Promise.all([
          fetch('/api/admin/skills'),
          fetch('/api/admin/skill-categories')
        ]);
        const [skillsData, categoriesData] = await Promise.all([
          skillsRes.json(),
          categoriesRes.json()
        ]);
        setSkills(Array.isArray(skillsData) ? skillsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error('Failed to fetch matrix data:', error);
        setSkills([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="animate-fade-in pb-10">
        <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[var(--admin-title)]">Skill Matrix</h2>
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
              Manage skills & hero badges
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

        <div className="px-4 sm:px-6 lg:px-8 space-y-2 sm:space-y-3">
          {[...Array(8)].map((_, idx) => (
            <div key={idx} className="reveal-scale bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 animate-pulse">
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/5" />
                <div className="flex-1 min-w-0">
                  <div className="h-5 w-48 bg-white/5 rounded animate-pulse mb-2" />
                  <div className="h-3 w-32 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <SkillsManager initialSkills={skills} initialCategories={categories} />;
}