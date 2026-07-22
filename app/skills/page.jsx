import Skills from "@/components/Skills";
import "../about.css";
import { createAdminClient } from "@/lib/supabase/server";

export const revalidate = 60;

export default async function SkillsPage() {
  const supabase = await createAdminClient();
  const { data: skillsData } = await supabase
    .from('skills')
    .select('*')
    .order('id', { ascending: true });

  return (
    <main className="section container page-enter">
      <section className="skills">
        <h2 className="section__title">
          My <span>Skills</span>
        </h2>
        <div className="skills__container grid">
          <Skills data={skillsData} />
        </div>
      </section>
    </main>
  );
}
