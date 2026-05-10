const Skills = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <>
        {
            data.map(({ title }, index) => {
                return (
                    <div className="progress__box" key={index}>
                        <h3 className="skills__title">{title}</h3>
                    </div>
                )
            })
        }
    </>
  )
}

export default Skills