import Education from "@/components/Education";
import "../about.css";
import { createClient } from "@/lib/supabase/server";

export default async function EducationPage() {
  const supabase = await createClient();
  const { data: educationData } = await supabase
    .from('education')
    .select('*')
    .order('id', { ascending: true });

  return (
    <main className="section container page-enter">
      <section className="resume">
        <h2 className="section__title">
          My <span>Education</span>
        </h2>
        <div className="resume__container grid max-w-3xl mx-auto">
          <div className="resume__data">
            <Education data={educationData} type="education" />
          </div>
        </div>
      </section>
    </main>
  );
}
