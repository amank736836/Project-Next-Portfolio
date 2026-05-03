import parse from "html-react-parser";
import { FaGraduationCap, FaBriefcase } from "react-icons/fa";

const Education = ({ data, type }) => {
  if (!data || data.length === 0) return null;

  return (
    <>
      {data.map((val) => {
        return (
          <div className="resume__item" key={val.id}>
            <div className="resume__icon">
              {type === 'experience' ? <FaBriefcase /> : <FaGraduationCap />}
            </div>
            <span className="resume__date">{val.year}</span>
            <h3 className="resume__subtitle">{parse(val.title)}</h3>
            <p className="resume__description">{val.description}</p>
          </div>
        );
      })}
    </>
  );
};

export default Education;
