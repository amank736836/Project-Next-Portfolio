"use client";

import { useMemo, useState } from "react";
import PortfolioItem from "@/components/PortfolioItem";
import SectionHeading from "@/components/ui/SectionHeading";
import "@/app/(public)/Portfolio.css";

/**
 * Projects grid with working category filtering.
 *
 * The previous markup rendered filter pills as inert spans; filtering now
 * happens client-side and the grid re-staggers with a blur/rise animation every
 * time the active filter changes.
 */
export default function ProjectsSection({ projectsData }) {
  const allProjects = useMemo(() => (Array.isArray(projectsData) ? projectsData : []), [projectsData]);
  const [active, setActive] = useState("all");

  const categories = useMemo(
    () => ["all", ...new Set(allProjects.map((p) => p.category).filter(Boolean))],
    [allProjects]
  );

  const visible = useMemo(
    () => (active === "all" ? allProjects : allProjects.filter((project) => project.category === active)),
    [active, allProjects]
  );

  return (
    <section id="projects" className="portfolio section">
      <SectionHeading title="My" highlight="Projects" eyebrow="Selected work" />

      {categories.length > 2 && (
        <div className="portfolio__filters container reveal delay-1" role="tablist" aria-label="Filter projects by category">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={category === active}
              className={`portfolio__item ${category === active ? "active-portfolio" : ""}`}
              data-filter={category}
              onClick={() => setActive(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div
        className="portfolio__container container grid reveal delay-2"
        key={active}
        aria-live="polite"
      >
        {visible.length > 0 ? (
          visible.map((item, index) => (
            <PortfolioItem
              key={item.id}
              img={item.img}
              title={item.title}
              details={item.details}
              category={item.category}
              shortDescription={item.description}
              techStack={item.techStack}
              liveUrl={item.liveUrl}
              githubUrl={item.githubUrl}
              index={index}
            />
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
