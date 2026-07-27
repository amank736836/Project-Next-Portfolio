const Skills = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <>
        {
            data.map(({ title }, index) => {
                return (
                    <div className="skills__item" key={index}>
                        <h3 className="skills__title">{title}</h3>
                    </div>
                )
            })
        }
    </>
  )
}

export default Skills