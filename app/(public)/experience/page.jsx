import Education from "@/components/Education";
import "@/app/(public)/about.css";
import { createAdminClient } from "@/lib/supabase/server";

export const revalidate = 60;

export default async function ExperiencePage() {
  const supabase = await createAdminClient();
  const { data: experienceData } = await supabase
    .from('experience')
    .select('*')
    .eq('is_hidden', false)
    .order('id', { ascending: true });

  return (
    <main className="section container page-enter">
      <section className="resume">
        <h2 className="section__title">
          My <span>Experience</span>
        </h2>
        <div className="resume__container grid mx-auto">
          <div className="resume__data">
            <Education data={experienceData} type="experience" />
          </div>
        </div>
      </section>
    </main>
  );
}
