import Skills from "@/components/Skills";
import SectionHeading from "@/components/ui/SectionHeading";
import "@/app/(public)/about.css";

export default function SkillsSection({ skillsData }) {
  return (
    <section id="skills" className="section container reveal">
      <section className="skills">
        <SectionHeading title="My" highlight="Skills" eyebrow="Toolbox" className="reveal" />
        <div className="skills__container grid reveal delay-2">
          <Skills data={skillsData} />
        </div>
      </section>
    </section>
  );
}