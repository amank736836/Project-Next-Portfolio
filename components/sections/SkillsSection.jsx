import Skills from "@/components/Skills";
import "@/app/(public)/about.css";

export default function SkillsSection({ skillsData }) {
  return (
    <section id="skills" className="section container reveal">
      <section className="skills">
        <h2 className="section__title reveal delay-1">
          My <span>Skills</span>
        </h2>
        <div className="skills__container grid reveal delay-2">
          <Skills data={skillsData} />
        </div>
      </section>
    </section>
  );
}