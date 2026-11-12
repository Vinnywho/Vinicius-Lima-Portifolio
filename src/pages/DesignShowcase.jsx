import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Code2, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { projects } from '../data/projects';

export default function DesignShowcase() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, tr } = useApp();
  const [copiedHex, setCopiedHex] = useState(null);

  const designProjects = projects.filter((p) => p.designShowcase);
  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!project || !project.designShowcase) {
    return (
      <div className="detail-page container">
        <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          <span>{t.projectDetail.backHome}</span>
        </button>
      </div>
    );
  }

  const ds = project.designShowcase;
  const deliverables = tr(ds.deliverables) || [];
  const nextDesign =
    designProjects[(designProjects.findIndex((p) => p.slug === slug) + 1) % designProjects.length];

  const handleCopyHex = async (hex) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 1500);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <article className="detail-page container">
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/" className="btn-secondary">
          <ArrowLeft size={16} />
          <span>{t.projectDetail.backHome}</span>
        </Link>

        {project.devDetails && (
          <Link to={`/projeto/${project.slug}`} className="btn-secondary">
            <Code2 size={16} />
            <span>{t.projectDetail.switchToDev}</span>
          </Link>
        )}
      </div>

      <div className="behance-stream">
        {/* Behance Header */}
        <header>
          <span
            className="featured-badge"
            style={{ backgroundColor: project.accentColor || 'var(--accent)' }}
          >
            BEHANCE SHOWCASE • {project.year}
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-display-design)',
              fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              marginBottom: '1rem',
            }}
          >
            {tr(project.title)}
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '800px' }}>
            {tr(project.fullDesc)}
          </p>
        </header>

        {/* Project Meta Strip */}
        <div className="behance-meta-strip">
          <div>
            <div className="menu-panel-group-title" style={{ color: 'var(--text-secondary)' }}>
              {t.projectDetail.client}
            </div>
            <strong>{ds.client}</strong>
          </div>
          <div>
            <div className="menu-panel-group-title" style={{ color: 'var(--text-secondary)' }}>
              {t.projectDetail.role}
            </div>
            <strong>{tr(ds.role)}</strong>
          </div>
          <div>
            <div className="menu-panel-group-title" style={{ color: 'var(--text-secondary)' }}>
              {t.projectDetail.typography}
            </div>
            <strong>{ds.typography.heading}</strong>
          </div>
          <div>
            <div className="menu-panel-group-title" style={{ color: 'var(--text-secondary)' }}>
              {t.projectDetail.deliverables}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
              {deliverables.map((item) => (
                <span key={item} className="timeline-tag">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Palette Bar */}
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              marginBottom: '0.6rem',
            }}
          >
            {t.projectDetail.palette}
          </div>
          <div className="palette-row">
            {ds.palette.map((hex) => (
              <button
                key={hex}
                type="button"
                className="palette-swatch"
                onClick={() => handleCopyHex(hex)}
              >
                <span className="palette-dot" style={{ backgroundColor: hex }} />
                <span>{copiedHex === hex ? t.projectDetail.copied : hex}</span>
                {copiedHex === hex && <Check size={14} style={{ color: '#22c55e' }} />}
              </button>
            ))}
          </div>
        </div>

        {/* Continuous Behance Visual Stream */}
        {ds.behanceBlocks.map((block, idx) => {
          if (block.type === 'hero-image') {
            return (
              <figure key={idx} className="behance-board">
                <img src={block.image} alt={tr(block.caption)} />
                {block.caption && (
                  <figcaption className="behance-board-caption">
                    {tr(block.caption)}
                  </figcaption>
                )}
              </figure>
            );
          }

          if (block.type === 'text-section') {
            return (
              <section key={idx} className="detail-box" style={{ boxShadow: 'none' }}>
                <h2 style={{ fontSize: '1.5rem' }}>{tr(block.heading)}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.06rem' }}>
                  {tr(block.body)}
                </p>
              </section>
            );
          }

          if (block.type === 'metrics') {
            return (
              <section
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                }}
              >
                {block.items.map((m, mIdx) => (
                  <div
                    key={mIdx}
                    className="detail-box"
                    style={{ textAlign: 'center', boxShadow: 'none' }}
                  >
                    <div
                      style={{
                        fontSize: '2.2rem',
                        fontWeight: 900,
                        color: project.accentColor || 'var(--accent)',
                      }}
                    >
                      {m.value}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {tr(m.label)}
                    </div>
                  </div>
                ))}
              </section>
            );
          }

          return null;
        })}

        {/* Bottom Actions */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            paddingTop: '1rem',
          }}
        >
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-primary">
              <span>{t.projectDetail.liveDemo}</span>
              <ArrowUpRight size={18} />
            </a>
          )}

          {nextDesign && nextDesign.slug !== project.slug && (
            <Link to={`/design/${nextDesign.slug}`} className="btn-secondary">
              <span>{t.projectDetail.nextProject}: {tr(nextDesign.title)}</span>
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
