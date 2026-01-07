const ProjectCard = ({ title, desc, bgImage, icons, onClick }) => (
  <div className="projeto" style={{ backgroundImage: `url(${bgImage})` }} onClick={onClick}>
    <h3>{title}</h3>
    <p>{desc}</p>
    <div className="tecnologias">
      {icons.map((icon, index) => <img key={index} src={icon} alt="tech" />)}
    </div>
  </div>
);

export default ProjectCard;