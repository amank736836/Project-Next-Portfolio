import Info from "@/components/Info";
import { FaDownload } from "react-icons/fa";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import "../about.css";
import { FaEye } from "react-icons/fa6";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";

export const revalidate = 60;

export default async function About() {
  const supabase = await createAdminClient();
  const { data: infoData } = await supabase.from('personal_info').select('*');

  const aboutDescription = infoData?.find(i => i.key === 'about_description')?.description;
  let personalInfo = infoData?.filter(i => 
    i.key !== 'about_description' && 
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
    <main className="section container">
      <section className="about">
        <h2 className="section__title">
          About <span>Me</span>
        </h2>
        <div className="about__container grid">
          <div className="about__info">
            <h3 className="section__subtitle">Personal Infos</h3>
            {aboutDescription && (
              <p className="about__description mb-8 text-slate-400 leading-relaxed">
                {aboutDescription}
              </p>
            )}
            <ul className="info__list grid">
              <Info data={personalInfo} />
            </ul>
            <div className="mt-12 flex flex-row flex-wrap items-center justify-center gap-4 sm:gap-8">
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
