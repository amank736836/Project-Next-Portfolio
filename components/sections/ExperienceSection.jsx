import Education from "@/components/Education";
import "@/app/(public)/about.css";

export default function ExperienceSection({ experienceData }) {
  return (
    <section id="experience" className="section container reveal">
      <section className="resume">
        <h2 className="section__title reveal delay-1">
          My <span>Experience</span>
        </h2>
        <div className="resume__container grid mx-auto reveal delay-2">
          <div className="resume__data">
            <Education data={experienceData} type="experience" />
          </div>
        </div>
      </section>
    </section>
  );
}