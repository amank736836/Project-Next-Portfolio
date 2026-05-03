import PortfolioItem from "@/components/PortfolioItem";
import "../Portfolio.css";
import { createClient } from "@/lib/supabase/server";

export default async function Portfolio() {
  const supabase = await createClient();
  
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_hidden', false)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching projects:', error);
  }

  return (
    <section className="portfolio section">
      <h2 className="section__title">
        My <span>Portfolio</span>
      </h2>
      <div className="portfolio__container container grid">
        {projects?.map((item) => (
          <PortfolioItem key={item.id} {...item} />
        ))}
        {(!projects || projects.length === 0) && (
          <div className="col-span-full text-center text-gray-400 py-10">
            No projects found.
          </div>
        )}
      </div>
    </section>
  );
}
