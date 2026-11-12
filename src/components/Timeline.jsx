import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { experiences } from '../data/experiences';

gsap.registerPlugin(ScrollTrigger);

export default function Timeline() {
  const { mode, t, tr, navigateWithTransition } = useApp();
  const [filter, setFilter] = useState('all');
  const [expandedIds, setExpandedIds] = useState(() => new Set(['freelancer-2026', 'maratona-sbc-2025']));

  const sectionRef = useRef(null);
  const progressRef = useRef(null);

  const filtered = experiences.filter((exp) =>
    filter === 'all' ? true : exp.category === filter
  );

  // Animate central ink progress line on scroll
  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (progressRef.current) progressRef.current.style.transform = 'translateX(-50%) scaleY(1)';
      return;
    }

    const ctx = gsap.context(() => {
      if (progressRef.current && sectionRef.current) {
        gsap.fromTo(
          progressRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
              end: 'bottom 80%',
              scrub: 0.4,
            },
          }
        );
      }

      gsap.from('.timeline-row', {
        y: 35,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.timeline-track',
          start: 'top 80%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [filter]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="experiencias" ref={sectionRef} className="timeline-section container">
      <h2 className="section-heading">{t.experiences.title}</h2>
      <p className="section-subtitle">{t.experiences.subtitle}</p>

      <div className="timeline-filters" role="group" aria-label={t.experiences.title}>
        {['all', 'tech', 'design', 'career'].map((cat) => (
          <button
            key={cat}
            type="button"
            className={`timeline-filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {t.experiences.filters[cat]}
          </button>
        ))}
      </div>

      <div className="timeline-track">
        <div className="timeline-line-bg" aria-hidden="true" />
        <div ref={progressRef} className="timeline-line-progress" aria-hidden="true" />

        {filtered.map((exp, idx) => {
          const isRight = idx % 2 === 1;
          const isOpen = expandedIds.has(exp.id);
          const highlightsList = tr(exp.highlights) || [];

          return (
            <div key={exp.id} className={`timeline-row ${isRight ? 'is-right' : ''}`}>
              <span className="timeline-node" aria-hidden="true" />

              <div className="timeline-card">
                <button
                  type="button"
                  onClick={() => toggleExpand(exp.id)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <div className="timeline-card-top">
                    <span className="timeline-year-badge">{tr(exp.period)}</span>
                    <span className={`timeline-chevron ${isOpen ? 'is-open' : ''}`} aria-hidden="true">
                      <ChevronDown size={18} />
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                    {tr(exp.title)}
                  </h3>

                  <div className="timeline-org">{exp.organization}</div>

                  <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)' }}>
                    {tr(exp.shortDesc)}
                  </p>
                </button>

                <div
                  className={`timeline-expand-wrapper ${isOpen ? 'is-open' : ''}`}
                  aria-hidden={!isOpen}
                >
                  <div className="timeline-expand-inner">
                    <div className="timeline-details-expand">
                      {highlightsList.length > 0 && (
                        <ul>
                          {highlightsList.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}

                      <div className="timeline-tags">
                        {exp.tags.map((tag) => (
                          <span key={tag} className="timeline-tag">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {exp.relatedProjectSlug && (
                        <div style={{ marginTop: '0.9rem' }}>
                          {(() => {
                            const relPath =
                              mode === 'design' && exp.category === 'design'
                                ? `/design/${exp.relatedProjectSlug}`
                                : `/projeto/${exp.relatedProjectSlug}`;
                            return (
                              <Link
                                to={relPath}
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigateWithTransition(relPath);
                                }}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                  fontWeight: 800,
                                  fontSize: '0.86rem',
                                  color: 'var(--accent)',
                                }}
                              >
                                <span>{t.experiences.viewRelated}</span>
                                <ExternalLink size={14} />
                              </Link>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
