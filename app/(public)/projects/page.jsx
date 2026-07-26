import PortfolioItem from "@/components/PortfolioItem";
import { createAdminClient } from "@/lib/supabase/server";
import "@/app/(public)/Portfolio.css";

export const revalidate = 60;

export default async function PortfolioPage() {
  const supabase = await createAdminClient();
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('is_hidden', false)
    .order('id', { ascending: true });

  const allProjects = Array.isArray(projects) ? projects : [];
  const categories = ['all', ...new Set(allProjects.map(p => p.category).filter(Boolean))].sort();

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