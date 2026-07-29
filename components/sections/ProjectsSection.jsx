import PortfolioItem from "@/components/PortfolioItem";
import "@/app/(public)/Portfolio.css";

export default function ProjectsSection({ projectsData }) {
  const allProjects = Array.isArray(projectsData) ? projectsData : [];
  const categories = ['all', ...new Set(allProjects.map(p => p.category).filter(Boolean))].sort();

  return (
    <section id="projects" className="portfolio section reveal">
      <h2 className="section__title reveal delay-1">
        My <span>Projects</span>
      </h2>

      {categories.length > 2 && (
        <div className="portfolio__filters container reveal delay-2">
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

      <div className="portfolio__container container grid reveal delay-3">
        {allProjects.length > 0 ? (
          allProjects.map((item, index) => (
            <PortfolioItem 
              key={item.id} 
              img={item.img} 
              title={item.title} 
              details={item.details} 
              category={item.category}
              description={item.description}
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