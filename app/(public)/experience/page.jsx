import Education from "@/components/Education";
import "@/app/(public)/about.css";
import { createAdminClient } from "@/lib/supabase/server";
import SectionHeading from "@/components/ui/SectionHeading";

export const revalidate = 60;
export const metadata = {
  title: "Experience",
  description: "Aman Kumar's professional software engineering and project management experience.",
  alternates: { canonical: "/experience" },
};

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
        <SectionHeading title="My" highlight="Experience" eyebrow="Career" />
        <div className="resume__container grid mx-auto reveal">
          <div className="resume__data">
            <Education data={experienceData} type="experience" />
          </div>
        </div>
      </section>
    </main>
  );
}
