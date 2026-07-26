import Skills from "@/components/Skills";
import "@/app/(public)/about.css";

export default function SkillsSection({ skillsData }) {
  return (
    <section id="skills" className="section container page-enter">
      <section className="skills">
        <h2 className="section__title">
          My <span>Skills</span>
        </h2>
        <div className="skills__container grid">
          <Skills data={skillsData} />
        </div>
      </section>
    </section>
  );
}