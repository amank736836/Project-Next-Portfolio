import Education from "@/components/Education";
import SectionHeading from "@/components/ui/SectionHeading";
import "@/app/(public)/about.css";

export default function ExperienceSection({ experienceData }) {
  return (
    <section id="experience" className="section container reveal">
      <section className="resume">
        <SectionHeading title="My" highlight="Experience" eyebrow="Career" className="reveal" />
        <div className="resume__container grid mx-auto reveal delay-2">
          <div className="resume__data">
            <Education data={experienceData} type="experience" />
          </div>
        </div>
      </section>
    </section>
  );
}