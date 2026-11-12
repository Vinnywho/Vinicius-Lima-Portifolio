import { Link } from 'react-router-dom';
import { ArrowUpRight, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function FeaturedProject({ project, index }) {
  const { mode, t, tr, navigateWithTransition } = useApp();
  const isReversed = index % 2 === 1;

  const targetRoute =
    mode === 'design' && project.designShowcase
      ? `/design/${project.slug}`
      : `/projeto/${project.slug}`;

  const ctaLabel =
    mode === 'design' && project.designShowcase
      ? t.projects.viewCaseDesign
      : t.projects.viewCaseDev;

  const handleOpenProject = (e) => {
    e.preventDefault();
    navigateWithTransition(targetRoute);
  };

  return (
    <article
      className={`featured-item gsap-reveal ${isReversed ? 'is-reversed' : ''}`}
    >
      <Link
        to={targetRoute}
        onClick={handleOpenProject}
        className="featured-media"
        aria-label={tr(project.title)}
      >
        <img src={project.coverImage} alt={tr(project.title)} loading="lazy" />
      </Link>

      <div className="featured-content">
        <span
          className="featured-badge"
          style={project.accentColor ? { backgroundColor: project.accentColor } : undefined}
        >
          {t.projects.badgeFeatured} • {project.year}
        </span>

        <h3 className="featured-title" style={{ color: project.accentColor || 'var(--accent)' }}>
          {tr(project.title)}
        </h3>

        <p className="featured-desc">{tr(project.fullDesc)}</p>

        <div className="tech-pills-row">
          {project.techs.map((tech) => (
            <span key={tech.name} className="tech-pill">
              <img src={tech.icon} alt="" aria-hidden="true" />
              <span>{tech.name}</span>
            </span>
          ))}
        </div>

        <div className="featured-actions">
          <Link to={targetRoute} onClick={handleOpenProject} className="btn-primary">
            <Layers size={18} />
            <span>{ctaLabel}</span>
          </Link>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              <span>{t.projects.liveSite}</span>
              <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
