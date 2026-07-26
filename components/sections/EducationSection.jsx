import Education from "@/components/Education";
import "@/app/(public)/about.css";

export default function EducationSection({ educationData }) {
  return (
    <section id="education" className="section container page-enter">
      <section className="resume">
        <h2 className="section__title">
          My <span>Education</span>
        </h2>
        <div className="resume__container grid max-w-3xl mx-auto">
          <div className="resume__data">
            <Education data={educationData} type="education" />
          </div>
        </div>
      </section>
    </section>
  );
}