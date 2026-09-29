import Education from "@/components/Education";
import "@/app/(public)/about.css";
import { createAdminClient } from "@/lib/supabase/server";

export const revalidate = 60;
export const metadata = {
  title: "Education",
  description: "Aman Kumar's education, engineering background, and academic experience.",
  alternates: { canonical: "/education" },
};

export default async function EducationPage() {
  const supabase = await createAdminClient();
  const { data: educationData } = await supabase
    .from('education')
    .select('*')
    .eq('is_hidden', false)
    .order('id', { ascending: true });

  return (
    <main className="section container page-enter">
      <section className="resume">
        <h2 className="section__title">
          My <span>Education</span>
        </h2>
        <div className="resume__container grid mx-auto">
          <div className="resume__data">
            <Education data={educationData} type="education" />
          </div>
        </div>
      </section>
    </main>
  );
}
