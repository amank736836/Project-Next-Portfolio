import Education from "@/components/Education";
import "@/app/(public)/about.css";

export default function EducationSection({ educationData }) {
  return (
    <section id="education" className="section container reveal">
      <section className="resume">
        <h2 className="section__title reveal delay-1">
          My <span>Education</span>
        </h2>
        <div className="resume__container grid max-w-3xl mx-auto reveal delay-2">
          <div className="resume__data">
            <Education data={educationData} type="education" />
          </div>
        </div>
      </section>
    </section>
  );
}