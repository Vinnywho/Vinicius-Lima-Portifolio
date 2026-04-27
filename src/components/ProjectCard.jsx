import React from "react";

function ProjectCard({ title, desc, bgImage, icons, onClick, index }) {
  const delay = index * 200;

  return (
    <div 
      className="projeto-container" 
      data-aos="fade-up" 
      data-aos-delay={delay}
    >
      <div 
        className="projeto" 
        style={{ backgroundImage: `url(${bgImage})` }} 
        onClick={onClick}
      >
        <h3>{title}</h3>
        <p>{desc}</p>
        <div className="tecnologias">
          {icons.map((icon, idx) => (
            <img key={idx} src={icon} alt="tech" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;