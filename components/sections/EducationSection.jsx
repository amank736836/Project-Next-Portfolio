import Education from "@/components/Education";
import SectionHeading from "@/components/ui/SectionHeading";
import "@/app/(public)/about.css";

export default function EducationSection({ educationData }) {
  return (
    <section id="education" className="section container reveal">
      <section className="resume">
        <SectionHeading title="My" highlight="Education" eyebrow="Background" className="reveal" />
        <div className="resume__container grid mx-auto reveal delay-2">
          <div className="resume__data">
            <Education data={educationData} type="education" />
          </div>
        </div>
      </section>
    </section>
  );
}