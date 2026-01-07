const ExperienceItem = ({ title, description }) => (
  <div className="timeline-item">
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

export default ExperienceItem;