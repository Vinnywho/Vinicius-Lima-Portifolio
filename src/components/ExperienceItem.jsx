import React from 'react';
import aos from "aos";
import "aos/dist/aos.css";


function ExperienceItem({ title, description, index }) {
  React.useEffect(() => {
    aos.init({
      duration: 1000
    });
  }, []);
  const isEven = index % 2 === 0;
  const animation = isEven ? "fade-right" : "fade-left";
  const delay = index * 200;

  return (
    <div className="timeline-item" data-aos={animation} data-aos-delay={delay}>
      <h3 className="timeline-titulo">{title}</h3>
      {description && (
        <p>
          {description.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

export default ExperienceItem;