import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Code2, Check, ZoomIn, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { projects } from '../data/projects';

export default function DesignShowcase() {
  const { slug } = useParams();
  const { t, tr, lang, navigateWithTransition } = useApp();
  const [copiedHex, setCopiedHex] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);

  const designProjects = projects.filter((p) => p.designShowcase);
  const currentIndex = designProjects.findIndex((p) => p.slug === slug);
  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  useEffect(() => {
    if (!lightboxImg) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxImg(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxImg]);

  if (!project || !project.designShowcase) {
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

  const ds = project.designShowcase;
  const deliverables = tr(ds.deliverables) || [];
  const prevDesign =
    currentIndex > 0
      ? designProjects[currentIndex - 1]
      : designProjects[designProjects.length - 1];
  const nextDesign =
    currentIndex >= 0
      ? designProjects[(currentIndex + 1) % designProjects.length]
      : null;

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

        {project.devDetails && (
          <Link
            to={`/projeto/${project.slug}`}
            onClick={(e) => {
              e.preventDefault();
              navigateWithTransition(`/projeto/${project.slug}`);
            }}
            className="btn-secondary"
          >
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
          <h1 className="detail-hero-title">
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
                <button
                  type="button"
                  className="behance-zoom-trigger"
                  onClick={() =>
                    setLightboxImg({ src: block.image, caption: tr(block.caption) })
                  }
                  aria-label={tr(block.caption) || tr(project.title)}
                >
                  <img src={block.image} alt={tr(block.caption)} loading="lazy" />
                  <span className="behance-zoom-badge">
                    <ZoomIn size={15} />
                    <span>{lang === 'pt' ? 'Ampliar' : 'Zoom'}</span>
                  </span>
                </button>
                {block.caption && (
                  <figcaption className="behance-board-caption">
                    {tr(block.caption)}
                  </figcaption>
                )}
              </figure>
            );
          }

          if (block.type === 'scroll-frame') {
            return (
              <figure key={idx} className="behance-scroll-block">
                <div className="behance-browser-bar">
                  <div className="behance-browser-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="behance-browser-title">
                    {tr(block.title) || (lang === 'pt' ? 'Role a página para explorar' : 'Scroll inside to explore')}
                  </span>
                  <button
                    type="button"
                    className="behance-expand-btn"
                    onClick={() =>
                      setLightboxImg({ src: block.image, caption: tr(block.caption) })
                    }
                  >
                    <ZoomIn size={14} />
                    <span>{lang === 'pt' ? 'Tela cheia' : 'Expand'}</span>
                  </button>
                </div>
                <div className="behance-scroll-viewport">
                  <img src={block.image} alt={tr(block.caption)} loading="lazy" />
                </div>
                {block.caption && (
                  <figcaption className="behance-board-caption">
                    {tr(block.caption)}
                  </figcaption>
                )}
              </figure>
            );
          }

          if (block.type === 'gallery-grid') {
            return (
              <section key={idx} className="behance-gallery-block">
                {block.heading && (
                  <h2 className="behance-gallery-heading">{tr(block.heading)}</h2>
                )}
                <div className="behance-gallery-grid">
                  {block.items.map((item, itemIdx) => (
                    <figure key={itemIdx} className="behance-grid-card">
                      <button
                        type="button"
                        className="behance-grid-media"
                        onClick={() =>
                          setLightboxImg({ src: item.image, caption: tr(item.caption) })
                        }
                        aria-label={tr(item.caption) || `Screen ${itemIdx + 1}`}
                      >
                        <img src={item.image} alt={tr(item.caption)} loading="lazy" />
                        <span className="behance-zoom-badge">
                          <ZoomIn size={14} />
                        </span>
                      </button>
                      {item.caption && (
                        <figcaption className="behance-grid-caption">
                          {tr(item.caption)}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </section>
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

        {/* Bottom Actions with Bidirectional Navigation */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            paddingTop: '1.75rem',
            marginTop: '1.5rem',
            borderTop: '1px solid var(--border-color)',
          }}
          aria-label="Navegação entre projetos de design"
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            {prevDesign && prevDesign.slug !== project.slug && (
              <Link
                to={`/design/${prevDesign.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigateWithTransition(`/design/${prevDesign.slug}`);
                }}
                className="btn-secondary"
              >
                <ArrowLeft size={16} />
                <span>
                  {t.projectDetail.prevProject}: {tr(prevDesign.title)}
                </span>
              </Link>
            )}

            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-primary">
                <span>{t.projectDetail.liveDemo}</span>
                <ArrowUpRight size={18} />
              </a>
            )}
          </div>

          {nextDesign && nextDesign.slug !== project.slug && (
            <Link
              to={`/design/${nextDesign.slug}`}
              onClick={(e) => {
                e.preventDefault();
                navigateWithTransition(`/design/${nextDesign.slug}`);
              }}
              className="btn-secondary"
            >
              <span>{t.projectDetail.nextProject}: {tr(nextDesign.title)}</span>
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* Lightbox Modal para inspecionar telas em alta resolução */}
      {lightboxImg && (
        <div
          className="behance-lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxImg(null)}
        >
          <div className="behance-lightbox-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="behance-lightbox-close"
              onClick={() => setLightboxImg(null)}
              aria-label={lang === 'pt' ? 'Fechar visualização' : 'Close preview'}
            >
              <X size={22} />
            </button>
            <div className="behance-lightbox-scroll">
              <img src={lightboxImg.src} alt={lightboxImg.caption || ''} />
            </div>
            {lightboxImg.caption && (
              <p className="behance-lightbox-caption">{lightboxImg.caption}</p>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
