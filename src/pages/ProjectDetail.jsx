import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, GitBranch, Palette, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { projects } from '../data/projects';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { t, tr, navigateWithTransition } = useApp();

  const devProjects = projects.filter((p) => p.category === 'dev' || p.category === 'both');
  const currentIndex = devProjects.findIndex((p) => p.slug === slug);
  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!project) {
    return (
      <div className="detail-page container">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigateWithTransition('/')}
        >
          <ArrowLeft size={16} />
          <span>{t.projectDetail.backHome}</span>
        </button>
      </div>
    );
  }

  const prevProject =
    currentIndex > 0
      ? devProjects[currentIndex - 1]
      : devProjects[devProjects.length - 1];
  const nextProject =
    currentIndex >= 0
      ? devProjects[(currentIndex + 1) % devProjects.length]
      : null;

  const devInfo = project.devDetails;
  const highlights = devInfo ? tr(devInfo.highlights) : [];
  const gallery = devInfo?.gallery?.length ? devInfo.gallery : [project.coverImage];

  return (
    <article className="detail-page container">
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.75rem' }}>
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault();
            navigateWithTransition('/');
          }}
          className="btn-secondary"
        >
          <ArrowLeft size={16} />
          <span>{t.projectDetail.backHome}</span>
        </Link>

        {project.designShowcase && (
          <Link
            to={`/design/${project.slug}`}
            onClick={(e) => {
              e.preventDefault();
              navigateWithTransition(`/design/${project.slug}`);
            }}
            className="btn-secondary"
          >
            <Palette size={16} />
            <span>{t.projectDetail.switchToDesign}</span>
          </Link>
        )}
      </div>

      <header className="detail-hero-card">
        <span className="featured-badge" style={{ backgroundColor: project.accentColor || 'var(--accent)' }}>
          {project.year}
        </span>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.1rem, 5vw, 3.8rem)',
            color: 'var(--accent)',
            lineHeight: 1.08,
            marginBottom: '1rem',
          }}
        >
          {tr(project.title)}
        </h1>

        <p style={{ fontSize: '1.12rem', color: 'var(--text-secondary)', maxWidth: '820px', marginBottom: '1.5rem' }}>
          {tr(project.fullDesc)}
        </p>

        <div className="featured-actions">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-primary">
              <span>{t.projectDetail.liveDemo}</span>
              <ArrowUpRight size={18} />
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn-secondary">
              <GitBranch size={18} />
              <span>{t.projectDetail.sourceCode}</span>
            </a>
          )}
        </div>

        <img className="detail-cover" src={project.coverImage} alt={tr(project.title)} />
      </header>

      {devInfo && (
        <div className="detail-two-col">
          <section className="detail-box">
            <h2>{t.projectDetail.challenge}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{tr(devInfo.challenge)}</p>
          </section>

          <section className="detail-box">
            <h2>{t.projectDetail.solution}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{tr(devInfo.solution)}</p>
          </section>
        </div>
      )}

      <div className="detail-two-col">
        <section className="detail-box">
          <h2>{t.projectDetail.stack}</h2>
          <div className="tech-pills-row" style={{ marginBottom: 0 }}>
            {project.techs.map((tech) => (
              <span key={tech.name} className="tech-pill" style={{ padding: '0.55rem 0.95rem' }}>
                <img src={tech.icon} alt="" aria-hidden="true" style={{ width: 22, height: 22 }} />
                <span>{tech.name}</span>
              </span>
            ))}
          </div>
        </section>

        {highlights.length > 0 && (
          <section className="detail-box">
            <h2>{t.projectDetail.highlights}</h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {highlights.map((h, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 3 }} />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {gallery.length > 1 && (
        <section className="detail-box" style={{ marginBottom: '2.5rem' }}>
          <h2>{t.projectDetail.gallery}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {gallery.map((imgSrc, idx) => (
              <img
                key={idx}
                src={imgSrc}
                alt={`${tr(project.title)} - ${idx + 1}`}
                style={{ width: '100%', borderRadius: '14px', border: '2px solid var(--border-color)' }}
              />
            ))}
          </div>
        </section>
      )}

      <nav
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '2.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-color)',
        }}
        aria-label="Navegação entre projetos"
      >
        {prevProject && prevProject.slug !== project.slug ? (
          <Link
            to={`/projeto/${prevProject.slug}`}
            onClick={(e) => {
              e.preventDefault();
              navigateWithTransition(`/projeto/${prevProject.slug}`);
            }}
            className="btn-secondary"
          >
            <ArrowLeft size={16} />
            <span>
              {t.projectDetail.prevProject}: {tr(prevProject.title)}
            </span>
          </Link>
        ) : <div />}

        {nextProject && nextProject.slug !== project.slug && (
          <Link
            to={`/projeto/${nextProject.slug}`}
            onClick={(e) => {
              e.preventDefault();
              navigateWithTransition(`/projeto/${nextProject.slug}`);
            }}
            className="btn-primary"
          >
            <span>
              {t.projectDetail.nextProject}: {tr(nextProject.title)}
            </span>
            <ArrowRight size={18} />
          </Link>
        )}
      </nav>
    </article>
  );
}
