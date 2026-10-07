import parse from "html-react-parser";
import { FaGraduationCap, FaBriefcase } from "react-icons/fa";
import TiltCard from "@/components/ui/TiltCard";

const Education = ({ data, type }) => {
  if (!data || data.length === 0) return null;

  return (
    <>
      {data.map((val, index) => {
        const delayClass = `delay-${(index % 6) + 1}`;
        return (
          <TiltCard as="div" max={5} className={`resume__item reveal-left ${delayClass}`} key={val.id}>
            <div className="resume__icon">
              {type === 'experience' ? <FaBriefcase /> : <FaGraduationCap />}
            </div>
            <span className="resume__date">{val.year}</span>
            <h3 className="resume__subtitle">{parse(val.title)}</h3>
            <p className="resume__description">{val.description}</p>
            {val.gpa && (
              <div className="resume__detail">
                <span className="resume__detail-label">GPA:</span>
                <span className="resume__detail-value">{val.gpa}</span>
              </div>
            )}
            {val.subjects && (
              <div className="resume__detail">
                <span className="resume__detail-label">Key Subjects:</span>
                <span className="resume__detail-value">{val.subjects}</span>
              </div>
            )}
            {val.achievements && (
              <div className="resume__detail">
                <span className="resume__detail-label">Achievements:</span>
                <span className="resume__detail-value">{val.achievements}</span>
              </div>
            )}
          </TiltCard>
        );
      })}
    </>
  );
};

export default Education;
