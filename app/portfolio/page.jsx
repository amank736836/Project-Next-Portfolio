"use client";

import { useState, useEffect, useMemo } from "react";
import PortfolioItem from "@/components/PortfolioItem";
import "../Portfolio.css";

const PROJECT_CATEGORIES = [
  'all',
  'frontend',
  'backend',
  'chatting',
  'mern',
  'next',
  'sideproject',
  'extension',
  'otherproject'
];

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(projects.map(p => p.category).filter(Boolean));
    return ['all', ...Array.from(cats).sort()];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projects;
    return projects.filter(p => p.category === activeFilter);
  }, [projects, activeFilter]);

  return (
    <section className="portfolio section">
      <h2 className="section__title">
        My <span>Projects</span>
      </h2>

      {/* Category Filter Bar */}
      <div className="portfolio__filters container">
        {categories.map((category) => (
          <span 
            key={category}
            className={`portfolio__item ${activeFilter === category ? 'active-portfolio' : ''}`}
            onClick={() => setActiveFilter(category)}
          >
            {category}
          </span>
        ))}
      </div>

      <div className="portfolio__container container grid">
        {loading ? (
          <div className="col-span-full text-center text-gray-400 py-10 animate-pulse">
            Loading Missions...
          </div>
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((item) => (
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
