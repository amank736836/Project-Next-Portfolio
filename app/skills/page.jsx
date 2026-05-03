import Skills from "@/components/Skills";
import "../about.css";

export default function SkillsPage() {
  return (
    <main className="section container page-enter">
      <section className="skills">
        <h2 className="section__title">
          My <span>Skills</span>
        </h2>
        <div className="skills__container grid">
          <Skills />
        </div>
      </section>
    </main>
  );
}
