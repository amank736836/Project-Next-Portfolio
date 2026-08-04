"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import PortfolioItem from "@/components/PortfolioItem";
import "@/app/(public)/Portfolio.css";

export default function ProjectsPageClient() {
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('projects')
          .select('*')
          .eq('is_hidden', false)
          .order('id', { ascending: true });
        setProjects(data || []);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const allProjects = useMemo(() => Array.isArray(projects) ? projects : [], [projects]);
  const categories = useMemo(() => 
    ['all', ...new Set(allProjects.map(p => p.category).filter(Boolean))].sort(), 
    [allProjects]
  );

  if (loading) {
    return (
      <section className="portfolio section">
        <h2 className="section__title">
          My <span>Projects</span>
        </h2>

        <div className="portfolio__filters container skeleton-filters">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="portfolio__item skeleton-filter"></span>
          ))}
        </div>

        <div className="portfolio__container container grid skeleton-projects">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="portfolio__item skeleton-project">
              <div className="skeleton-image"></div>
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-tags">
                  <span className="skeleton-tag"></span>
                  <span className="skeleton-tag"></span>
                  <span className="skeleton-tag"></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="portfolio section">
      <h2 className="section__title">
        My <span>Projects</span>
      </h2>

      {categories.length > 2 && (
        <div className="portfolio__filters container">
          {categories.map((category) => (
            <span
              key={category}
              className={`portfolio__item ${category === 'all' ? 'active-portfolio' : ''}`}
              data-filter={category}
            >
              {category}
            </span>
          ))}
        </div>
      )}

      <div className="portfolio__container container grid">
        {allProjects.length > 0 ? (
          allProjects.map((item) => (
            <PortfolioItem key={item.id} {...item} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-10">
            No projects found in this sector.
          </div>
        )}
      </div>
    </section>
  );
}