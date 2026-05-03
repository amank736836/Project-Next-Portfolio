const Info = ({ data }) => {
  if (!data || data.length === 0) return null;

  const calculateAge = (dob) => {
    const [day, month, year] = dob.split("/").map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <>
      {data.map(({ title, description }, index) => {
        // Only calculate age if the title is strictly "Age" (case-insensitive and ignoring punctuation)
        const isAgeField = title.toLowerCase().replace(/[^a-z]/g, "") === "age";
        
        const displayDescription =
          isAgeField && description.includes("/")
            ? calculateAge(description)
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
