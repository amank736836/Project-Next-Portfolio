import Info from "@/components/Info";
import { FaDownload } from "react-icons/fa";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import "@/app/(public)/about.css";
import { FaEye } from "react-icons/fa6";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import SectionHeading from "@/components/ui/SectionHeading";

export const revalidate = 60;
export const metadata = {
  title: "About Aman Kumar",
  description: "Learn about Aman Kumar, a full-stack developer, his background, skills, and professional experience.",
  alternates: { canonical: "/about" },
};

export default async function About() {
  const supabase = await createAdminClient();
  // Public surface: never render rows the admin has marked as hidden.
  const { data: infoData } = await supabase.from('personal_info').select('*').eq('is_hidden', false);

  const aboutDescription = infoData?.find(i => i.key === 'about_description')?.description;
  let personalInfo = infoData?.filter(i => 
    i.key !== 'about_description' && 
    i.key !== 'site_mode' &&
    !i.key.startsWith('default_theme_')
  );

  if (personalInfo) {
    const desiredOrder = [
      'first name', 'last name',
      'email', 'phone',
      'address', 'nationality',
      'languages', 'linkedin'
    ];

    personalInfo.sort((a, b) => {
      const aTitle = (a.title || '').toLowerCase().trim();
      const bTitle = (b.title || '').toLowerCase().trim();
      
      let aIndex = desiredOrder.findIndex(key => aTitle.includes(key));
      let bIndex = desiredOrder.findIndex(key => bTitle.includes(key));
      
      if (aIndex === -1) {
        aIndex = aTitle.includes('custom') ? 9999 : 999;
      }
      if (bIndex === -1) {
        bIndex = bTitle.includes('custom') ? 9999 : 999;
      }
      
      if (aIndex === bIndex && aIndex >= 999) {
        return aTitle.localeCompare(bTitle);
      }
      
      return aIndex - bIndex;
    });
  }

  return (
    <main className="section container page-enter">
      <section className="about">
        <SectionHeading title="About" highlight="Me" eyebrow="Who I am" />
        <div className="about__container grid">
          <div className="about__info reveal-left">
            <h3 className="section__subtitle reveal delay-1">Personal Infos</h3>
            {aboutDescription && (
              <p className="about__description mb-8 text-slate-400 leading-relaxed">
                {aboutDescription}
              </p>
            )}
            <ul className="info__list grid reveal reveal-stagger delay-2">
              <Info data={personalInfo} />
            </ul>
            <div className="mt-12 flex flex-row flex-wrap items-center justify-center gap-4 sm:gap-8 reveal delay-4">
              <a href="/assets/Aman_Resume.pdf" download="" className="button">
                Download Cv
                <span className="button__icon">
                  <FaDownload />
                </span>
              </a>
              <Link href="/resume">
                <div className="button">
                  View Cv
                  <span className="button__icon">
                    <FaEye />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
