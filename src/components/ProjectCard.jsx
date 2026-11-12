import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProjectCard({ project }) {
  const { mode, t, tr, navigateWithTransition } = useApp();

  const targetRoute =
    mode === 'design' && project.designShowcase
      ? `/design/${project.slug}`
      : `/projeto/${project.slug}`;

  const ctaText =
    mode === 'design' && project.designShowcase
      ? t.projects.viewCaseDesign
      : t.projects.viewCaseDev;

  const handleClick = (e) => {
    e.preventDefault();
    navigateWithTransition(targetRoute);
  };

  return (
    <Link
      to={targetRoute}
      onClick={handleClick}
      className={`project-card gsap-card ${mode === 'design' ? 'is-behance' : ''}`}
    >
      <div className="project-card-media">
        <img src={project.coverImage} alt={tr(project.title)} loading="lazy" />
        <div className="project-card-overlay-techs">
          {project.techs.slice(0, 5).map((tech) => (
            <img key={tech.name} src={tech.icon} alt={tech.name} title={tech.name} />
          ))}
        </div>
      </div>

      <div className="project-card-body">
        <div>
          <h3>{tr(project.title)}</h3>
          <p>{tr(project.shortDesc)}</p>
        </div>

        <span className="project-card-cta">
          <span>{ctaText}</span>
          <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}
