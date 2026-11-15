import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  Sparkles,
  Layers,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Code2,
  Palette,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { skills, designCapabilities } from '../data/skills';
import { projects } from '../data/projects';

const RING_RADIUS = 26;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const checkReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const checkFinePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(pointer: fine)').matches;

export default function Phone3D() {
  const { mode, theme, lang, t, tr, switchMode, navigateWithTransition } = useApp();

  const stageRef = useRef(null);
  const deckRef = useRef(null);
  const backplateRef = useRef(null);
  const reactorInfoRef = useRef(null);
  const ringCircleRef = useRef(null);
  const levelTextRef = useRef(null);
  const caseCardRef = useRef(null);
  const satelliteRefs = useRef([]);

  const itemsToDisplay = useMemo(
    () =>
      mode === 'dev'
        ? skills
        : [
            ...skills.filter((s) => s.id === 'figma' || s.id === 'css' || s.id === 'html'),
            ...designCapabilities,
          ],
    [mode]
  );

  const featuredCases = useMemo(
    () => projects.filter((p) => (p.category === 'both' || p.category === mode) && p.featured),
    [mode]
  );

  // 4 distinct highlight satellites orbiting the 3D deck corners
  const orbitalSatellites = useMemo(() => {
    const preferredIds =
      mode === 'dev'
        ? ['react', 'javascript', 'csharp', 'supabase']
        : ['figma', 'photoshop', 'css', 'html'];

    const matched = preferredIds
      .map((id) => itemsToDisplay.find((item) => item.id === id))
      .filter(Boolean);

    return matched.length === 4 ? matched : itemsToDisplay.slice(0, 4);
  }, [itemsToDisplay, mode]);

  const [activeTab, setActiveTab] = useState('stack');
  const [selectedSkillId, setSelectedSkillId] = useState(() => itemsToDisplay[0]?.id);
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const selectedSkill = useMemo(
    () => itemsToDisplay.find((item) => item.id === selectedSkillId) || itemsToDisplay[0],
    [itemsToDisplay, selectedSkillId]
  );

  const activeCase = featuredCases[activeCaseIdx % Math.max(1, featuredCases.length)] || featuredCases[0];

  const resolveSkillColor = (item) => {
    if (!item?.color) return 'var(--accent)';
    if (item.color.toUpperCase() === '#FFFFFF') {
      return theme === 'dark' ? '#e4e4e7' : '#18181b';
    }
    return item.color;
  };

  // Spatial 3D entrance, continuous satellite bobbing, and pointer tilt via gsap.quickTo
  useEffect(() => {
    const stage = stageRef.current;
    const deck = deckRef.current;
    if (!stage || !deck) return;

    satelliteRefs.current.length = orbitalSatellites.length;

    const reducedMotion = checkReducedMotion();
    if (reducedMotion) {
      gsap.set(deck, { rotateX: 0, rotateY: 0, scale: 1, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        deck,
        { y: 36, rotateY: -14, rotateX: 8, scale: 0.94, opacity: 0 },
        { y: 0, rotateY: 0, rotateX: 0, scale: 1, opacity: 1, duration: 0.95, ease: 'power3.out' }
      );

      if (backplateRef.current) {
        gsap.fromTo(
          backplateRef.current,
          { opacity: 0, scale: 0.92 },
          { opacity: 1, scale: 1, duration: 0.85, delay: 0.12, ease: 'power2.out' }
        );
      }

      satelliteRefs.current.filter(Boolean).forEach((sat, idx) => {
        const floatY = idx % 2 === 0 ? -9 : 9;
        const rot = idx % 2 === 0 ? -5 : 5;
        gsap.fromTo(
          sat,
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.65, delay: 0.25 + idx * 0.08, ease: 'back.out(1.7)' }
        );
        gsap.to(sat, {
          y: floatY,
          rotation: rot,
          duration: 2.8 + idx * 0.45,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.9 + idx * 0.15,
        });
      });
    }, stageRef);

    let cleanupPointer = null;
    if (checkFinePointer()) {
      const rotYTo = gsap.quickTo(deck, 'rotateY', { duration: 0.55, ease: 'power3.out' });
      const rotXTo = gsap.quickTo(deck, 'rotateX', { duration: 0.55, ease: 'power3.out' });

      const onPointerMove = (e) => {
        const rect = stage.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;

        rotYTo(nx * 8);
        rotXTo(-ny * 6);
      };

      const onPointerLeave = () => {
        rotYTo(0);
        rotXTo(0);
      };

      stage.addEventListener('pointermove', onPointerMove);
      stage.addEventListener('pointerleave', onPointerLeave);
      cleanupPointer = () => {
        stage.removeEventListener('pointermove', onPointerMove);
        stage.removeEventListener('pointerleave', onPointerLeave);
      };
    }

    return () => {
      if (cleanupPointer) cleanupPointer();
      ctx.revert();
    };
  }, [mode, orbitalSatellites.length]);

  // Auto-cycle selected skill in the Reactor every 4.5s when active
  useEffect(() => {
    if (isPaused || isHovered || activeTab !== 'stack' || checkReducedMotion()) return;
    if (itemsToDisplay.length <= 1) return;

    const timer = setInterval(() => {
      setSelectedSkillId((prevId) => {
        const currentIdx = itemsToDisplay.findIndex((item) => item.id === prevId);
        const nextIdx = (currentIdx + 1) % itemsToDisplay.length;
        return itemsToDisplay[nextIdx].id;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, isHovered, activeTab, itemsToDisplay]);

  // Reactor reveal + circular SVG gauge + animated proficiency counter
  useEffect(() => {
    if (activeTab !== 'stack' || !selectedSkill) return;

    const targetLevel = selectedSkill.level || 0;
    const targetOffset = RING_CIRCUMFERENCE * (1 - targetLevel / 100);

    if (checkReducedMotion()) {
      if (ringCircleRef.current) {
        ringCircleRef.current.style.strokeDashoffset = `${targetOffset}`;
      }
      if (levelTextRef.current) {
        levelTextRef.current.textContent = `${targetLevel}%`;
      }
      return;
    }

    const ctx = gsap.context(() => {
      if (reactorInfoRef.current) {
        gsap.fromTo(
          reactorInfoRef.current,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
        );
      }

      if (ringCircleRef.current) {
        gsap.fromTo(
          ringCircleRef.current,
          { strokeDashoffset: RING_CIRCUMFERENCE },
          { strokeDashoffset: targetOffset, duration: 0.75, ease: 'power3.out' }
        );
      }

      if (levelTextRef.current) {
        const counter = { val: 0 };
        gsap.to(counter, {
          val: targetLevel,
          duration: 0.65,
          ease: 'power2.out',
          onUpdate: () => {
            if (levelTextRef.current) {
              levelTextRef.current.textContent = `${Math.round(counter.val)}%`;
            }
          },
        });
      }
    }, stageRef);

    return () => ctx.revert();
  }, [selectedSkill, activeTab]);

  // Case spotlight reveal animation
  useEffect(() => {
    if (activeTab !== 'cases' || !caseCardRef.current || checkReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        caseCardRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
      );
    }, stageRef);

    return () => ctx.revert();
  }, [activeTab, activeCaseIdx, mode]);

  const handleSelectSkill = (item, sourceEl) => {
    setSelectedSkillId(item.id);
    setActiveTab('stack');
    setIsPaused(true);

    if (sourceEl && !checkReducedMotion()) {
      gsap.fromTo(
        sourceEl,
        { scale: 1.2 },
        { scale: 1, duration: 0.48, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' }
      );
    }
  };

  const relatedProjects = useMemo(() => {
    if (!selectedSkill?.relatedSlugs?.length) return [];
    return projects.filter((p) => selectedSkill.relatedSlugs.includes(p.slug));
  }, [selectedSkill]);

  const handleOpenProject = (proj) => {
    const route =
      mode === 'design' && proj.designShowcase
        ? `/design/${proj.slug}`
        : `/projeto/${proj.slug}`;
    navigateWithTransition(route);
  };

  const handlePrevCase = () => {
    setActiveCaseIdx((prev) => (prev - 1 + featuredCases.length) % featuredCases.length);
  };

  const handleNextCase = () => {
    setActiveCaseIdx((prev) => (prev + 1) % featuredCases.length);
  };

  const hudModeLabel =
    mode === 'dev'
      ? 'DEV_OS // STACK & ARCHITECTURE'
      : 'DESIGN_LAB // UI/UX & BRANDING';

  const pauseLabel = isPaused
    ? lang === 'pt'
      ? 'Iniciar rotação automática'
      : 'Start auto-cycle'
    : lang === 'pt'
    ? 'Pausar rotação automática'
    : 'Pause auto-cycle';

  const activeColor = resolveSkillColor(selectedSkill);

  return (
    <div
      ref={stageRef}
      className="hero-deck-stage"
      data-no-spray="true"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={deckRef}
        className="hero-deck-body"
        role="region"
        aria-label={
          mode === 'dev'
            ? lang === 'pt'
              ? 'Deck Interativo de Stack e Projetos'
              : 'Interactive Stack & Projects Deck'
            : lang === 'pt'
            ? 'Estúdio Interativo de Design e Cases'
            : 'Interactive Design & Cases Studio'
        }
      >
        {/* Offset 3D Depth Backplate */}
        <div ref={backplateRef} className="hero-deck-backplate" aria-hidden="true" />

        {/* 4 Floating Orbital Corner Satellites */}
        {orbitalSatellites.map((sat, idx) => {
          const isSatActive = activeTab === 'stack' && selectedSkill?.id === sat.id;
          return (
            <button
              key={`sat-${sat.id}`}
              ref={(el) => {
                satelliteRefs.current[idx] = el;
              }}
              type="button"
              className={`hero-deck-satellite sat-pos-${idx + 1} ${isSatActive ? 'is-active' : ''}`}
              style={{ '--sat-color': resolveSkillColor(sat) }}
              onClick={(e) => handleSelectSkill(sat, e.currentTarget)}
              title={sat.name}
              aria-label={`${sat.name} (${sat.level}%)`}
            >
              <img src={sat.icon} alt="" className="hero-deck-sat-icon hero-deck-skill-icon" />
              <span className="hero-deck-sat-label">{sat.name}</span>
            </button>
          );
        })}

        {/* Main Spatial Studio Surface */}
        <div className="hero-deck-surface">
          {/* Top Studio HUD */}
          <header className="hero-deck-hud">
            <div className="hero-deck-hud-title">
              <span className="hero-deck-dots" aria-hidden="true">
                <span className="dot-accent" />
                <span className="dot-mid" />
                <span className="dot-soft" />
              </span>
              <span className="hero-deck-hud-label">{hudModeLabel}</span>
            </div>

            <div className="hero-deck-hud-controls">
              <div className="hero-deck-tabs" role="tablist" aria-label="Deck Views">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'stack'}
                  className={`hero-deck-tab ${activeTab === 'stack' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('stack')}
                >
                  <Sparkles size={13} aria-hidden="true" />
                  <span>{lang === 'pt' ? 'Stack & Domínio' : 'Stack & Craft'}</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'cases'}
                  className={`hero-deck-tab ${activeTab === 'cases' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('cases')}
                >
                  <Layers size={13} aria-hidden="true" />
                  <span>{lang === 'pt' ? 'Cases' : 'Cases'}</span>
                </button>
              </div>

              {activeTab === 'stack' && (
                <button
                  type="button"
                  className="hero-deck-pause-btn"
                  onClick={() => setIsPaused((prev) => !prev)}
                  aria-label={pauseLabel}
                  title={pauseLabel}
                >
                  {isPaused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
                </button>
              )}
            </div>
          </header>

          {/* Main Deck Body */}
          <div className="hero-deck-content">
            {activeTab === 'stack' && selectedSkill ? (
              <div className="hero-deck-stack-view">
                {/* Active Skill Reactor */}
                <div
                  className="hero-reactor-card"
                  style={{ '--skill-color': activeColor }}
                >
                  <div className="hero-reactor-gauge" aria-hidden="true">
                    <svg viewBox="0 0 64 64" className="hero-reactor-svg">
                      <circle
                        cx="32"
                        cy="32"
                        r={RING_RADIUS}
                        className="hero-reactor-track"
                      />
                      <circle
                        ref={ringCircleRef}
                        cx="32"
                        cy="32"
                        r={RING_RADIUS}
                        className="hero-reactor-progress"
                        strokeDasharray={RING_CIRCUMFERENCE}
                        strokeDashoffset={RING_CIRCUMFERENCE}
                      />
                    </svg>
                    <span ref={levelTextRef} className="hero-reactor-pct">
                      {selectedSkill.level}%
                    </span>
                  </div>

                  <div ref={reactorInfoRef} className="hero-reactor-info">
                    <div className="hero-reactor-head">
                      <div className="hero-reactor-icon-box">
                        <img
                          src={selectedSkill.icon}
                          alt=""
                          className="hero-reactor-icon hero-deck-skill-icon"
                        />
                      </div>
                      <div className="hero-reactor-titles">
                        <span className="hero-reactor-cat">
                          {selectedSkill.category
                            ? tr(selectedSkill.category)
                            : lang === 'pt'
                            ? 'Especialidade Design'
                            : 'Design Craft'}
                        </span>
                        <h3 className="hero-reactor-name">{selectedSkill.name}</h3>
                      </div>
                    </div>

                    <p className="hero-reactor-desc">{tr(selectedSkill.description)}</p>

                    {relatedProjects.length > 0 && (
                      <div className="hero-reactor-projects">
                        <span className="hero-reactor-rel-label">{t.nav.projects}:</span>
                        <div className="hero-reactor-chips">
                          {relatedProjects.map((proj) => (
                            <button
                              key={proj.id}
                              type="button"
                              className="hero-reactor-chip"
                              onClick={() => handleOpenProject(proj)}
                            >
                              <span>{tr(proj.title)}</span>
                              <ArrowUpRight size={11} aria-hidden="true" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Interactive Magnetic Skill Matrix */}
                <div className="hero-deck-matrix-wrap">
                  <div className="hero-deck-matrix-head">
                    <span>
                      {mode === 'dev' ? t.hero.phoneTitleDev : t.hero.phoneTitleDesign}
                    </span>
                    <span className="hero-deck-matrix-hint">
                      {lang === 'pt' ? 'Clique para inspecionar' : 'Click to inspect'}
                    </span>
                  </div>

                  <div className="hero-deck-skills-grid">
                    {itemsToDisplay.map((item) => {
                      const isActive = selectedSkill.id === item.id;
                      const itemColor = resolveSkillColor(item);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          className={`hero-deck-skill-tile ${isActive ? 'is-active' : ''}`}
                          style={{ '--skill-color': itemColor }}
                          onClick={(e) => handleSelectSkill(item, e.currentTarget)}
                        >
                          <span className="hero-deck-tile-icon-wrap">
                            <img
                              src={item.icon}
                              alt=""
                              className="hero-deck-tile-icon hero-deck-skill-icon"
                            />
                          </span>
                          <span className="hero-deck-tile-name">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* Featured Cases Spotlight View */
              activeCase && (
                <div ref={caseCardRef} className="hero-deck-cases-view">
                  <div className="hero-case-preview">
                    <img
                      src={activeCase.coverImage}
                      alt={tr(activeCase.title)}
                      className="hero-case-img"
                    />
                    <span className="hero-case-year">{activeCase.year}</span>
                    <span className="hero-case-counter">
                      {String(activeCaseIdx + 1).padStart(2, '0')} /{' '}
                      {String(featuredCases.length).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="hero-case-body">
                    <h3 className="hero-case-title">{tr(activeCase.title)}</h3>
                    <p className="hero-case-desc">{tr(activeCase.shortDesc)}</p>

                    <div className="hero-case-techs">
                      {activeCase.techs.slice(0, 4).map((tech) => (
                        <span key={tech.name} className="hero-case-tech-pill">
                          <img
                            src={tech.icon}
                            alt=""
                            aria-hidden="true"
                            className="hero-deck-skill-icon"
                          />
                          <span>{tech.name}</span>
                        </span>
                      ))}
                    </div>

                    <div className="hero-case-actions">
                      <div className="hero-case-nav">
                        <button
                          type="button"
                          className="hero-case-nav-btn"
                          onClick={handlePrevCase}
                          aria-label={t.projectDetail.prevProject}
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          type="button"
                          className="hero-case-nav-btn"
                          onClick={handleNextCase}
                          aria-label={t.projectDetail.nextProject}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="btn-primary hero-case-cta"
                        onClick={() => handleOpenProject(activeCase)}
                      >
                        <span>
                          {mode === 'design' && activeCase.designShowcase
                            ? t.projects.viewCaseDesign
                            : t.projects.viewCaseDev}
                        </span>
                        <ArrowUpRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Deck Footer Status Bar */}
          <footer className="hero-deck-footer">
            <div className="hero-deck-status-meta">
              <span className="hero-deck-count">
                {itemsToDisplay.length}{' '}
                {mode === 'dev'
                  ? lang === 'pt'
                    ? 'Tecnologias'
                    : 'Technologies'
                  : lang === 'pt'
                  ? 'Disciplinas'
                  : 'Disciplines'}
              </span>
              <span className="hero-deck-sep" aria-hidden="true">
                •
              </span>
              <span className="hero-deck-origin">
                {mode === 'dev'
                  ? 'FECAP • Ciência da Computação'
                  : 'SBC 2025 • Designer Oficial'}
              </span>
            </div>

            <div className="hero-deck-footer-actions">
              <button
                type="button"
                className="hero-deck-quick-btn"
                onClick={() => switchMode()}
              >
                {mode === 'dev' ? (
                  <>
                    <Palette size={12} aria-hidden="true" />
                    <span>{lang === 'pt' ? 'Modo Design' : 'Design Mode'}</span>
                  </>
                ) : (
                  <>
                    <Code2 size={12} aria-hidden="true" />
                    <span>{lang === 'pt' ? 'Modo Dev' : 'Dev Mode'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="hero-deck-quick-btn is-accent"
                onClick={() => navigateWithTransition('/spray-lab')}
              >
                <Compass size={12} aria-hidden="true" />
                <span>Spray Lab</span>
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
