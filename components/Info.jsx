import { calculateAge } from '@/lib/utils';

const Info = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <>
      {data.map(({ title, description }, index) => {
        // Only calculate age if the title is strictly "Age" (case-insensitive and ignoring punctuation)
        const isAgeField = title.toLowerCase().replace(/[^a-z]/g, "") === "age";
        
        const displayDescription =
          isAgeField && description.includes("/")
            ? `${calculateAge(description)} Years`
            : description;

        return (
          <li className="info__item" key={index}>
            <span className="info__title">{title}</span>
            <h3 className="info__description">{displayDescription}</h3>
          </li>
        );
      })}
    </>
  );
};

export default Info;
