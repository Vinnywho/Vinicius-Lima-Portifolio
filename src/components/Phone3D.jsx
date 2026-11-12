import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Rotate3d, ArrowLeft, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { skills, designCapabilities } from '../data/skills';
import { projects } from '../data/projects';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Phone3D() {
  const { mode, t, tr } = useApp();
  const navigate = useNavigate();

  const phoneRef = useRef(null);
  const bootRef = useRef(null);
  const gridRef = useRef(null);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isBooted, setIsBooted] = useState(prefersReducedMotion);

  // Drag rotation state
  const rotRef = useRef({ x: 6, y: -14 });
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    startRotX: 6,
    startRotY: -14,
  });

  // 360-degree 3D entry spin + screen boot animation with GSAP
  useEffect(() => {
    const phone = phoneRef.current;
    const boot = bootRef.current;
    if (!phone) return;

    if (prefersReducedMotion()) {
      gsap.set(phone, { rotateX: 6, rotateY: -12 });
      return;
    }

    rotRef.current = { x: 6, y: -12 };

    const tl = gsap.timeline();
    tl.fromTo(
      phone,
      { rotateY: -360, rotateX: 16, scale: 0.85, opacity: 0 },
      {
        rotateY: -12,
        rotateX: 6,
        scale: 1,
        opacity: 1,
        duration: 1.35,
        ease: 'power3.out',
      }
    );

    if (boot) {
      tl.fromTo(
        boot,
        { opacity: 1 },
        {
          opacity: 0,
          duration: 0.45,
          delay: 0.15,
          ease: 'power2.out',
          onComplete: () => setIsBooted(true),
        },
        '-=0.3'
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  const onPointerDown = (e) => {
    // Allow clicking buttons inside without hijacking unless user drags
    dragRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      startRotX: rotRef.current.x,
      startRotY: rotRef.current.y,
    };
  };

  useEffect(() => {
    const onPointerMove = (e) => {
      if (!dragRef.current.active || !phoneRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;

      if (Math.hypot(dx, dy) > 6) {
        dragRef.current.moved = true;
      }

      const nextY = dragRef.current.startRotY + dx * 0.45;
      const nextX = Math.max(-35, Math.min(35, dragRef.current.startRotX - dy * 0.35));

      rotRef.current = { x: nextX, y: nextY };
      gsap.set(phoneRef.current, { rotateX: nextX, rotateY: nextY });
    };

    const onPointerUp = () => {
      if (!dragRef.current.active) return;
      dragRef.current.active = false;

      // Snap smoothly back to front angle if spun away, unless user is inspecting front slightly tilted
      if (phoneRef.current && Math.abs(rotRef.current.y) > 45) {
        rotRef.current = { x: 6, y: -12 };
        gsap.to(phoneRef.current, {
          rotateX: 6,
          rotateY: -12,
          duration: 0.75,
          ease: 'elastic.out(1, 0.7)',
        });
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  const handleSelectItem = (item) => {
    if (dragRef.current.moved) return;
    setSelectedItem(item);
  };

  const itemsToDisplay =
    mode === 'dev'
      ? skills
      : [
          ...skills.filter((s) => s.id === 'figma' || s.id === 'css'),
          ...designCapabilities,
        ];

  const relatedProjects = selectedItem?.relatedSlugs
    ? projects.filter((p) => selectedItem.relatedSlugs.includes(p.slug))
    : [];

  return (
    <div className="phone3d-stage">
      <div
        ref={phoneRef}
        className="phone3d-body"
        onPointerDown={onPointerDown}
        role="region"
        aria-label={mode === 'dev' ? t.hero.phoneTitleDev : t.hero.phoneTitleDesign}
      >
        <div className="phone3d-edge-left" />
        <div className="phone3d-edge-right" />

        {/* Traseira 3D do smartphone */}
        <div className="phone3d-back" aria-hidden="true">
          <div className="phone3d-camera-module">
            <span className="phone3d-lens" />
            <span className="phone3d-lens" />
            <span className="phone3d-lens" />
          </div>
          <div className="phone3d-back-logo">VL</div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', opacity: 0.55 }}>
            VINNYWHO EDITION
          </span>
        </div>

        {/* Frente 3D com Tela Interativa */}
        <div className="phone3d-front">
          <div className="phone3d-screen">
            <div className="phone3d-island" aria-hidden="true">
              <span className="phone3d-front-cam" />
            </div>

            {!isBooted && (
              <div ref={bootRef} className="phone3d-boot-overlay">
                <div
                  style={{
                    fontFamily: 'Grafitti, sans-serif',
                    fontSize: '2.2rem',
                    color: 'var(--accent)',
                    letterSpacing: '0.08em',
                  }}
                >
                  VL OS
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', opacity: 0.75 }}>
                  {t.hero.phoneBoot}
                </span>
              </div>
            )}

            <div className="phone3d-header">
              <span className="phone3d-app-title">
                {mode === 'dev' ? t.hero.phoneTitleDev : t.hero.phoneTitleDesign}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '99px',
                  background: 'var(--accent)',
                  color: '#fff',
                }}
              >
                {itemsToDisplay.length}
              </span>
            </div>

            {!selectedItem ? (
              <>
                <p
                  style={{
                    fontSize: '0.74rem',
                    color: 'rgba(251,251,242,0.7)',
                    marginBottom: '0.65rem',
                  }}
                >
                  {t.hero.phoneSelectPrompt}
                </p>
                <div ref={gridRef} className="phone3d-apps-grid">
                  {itemsToDisplay.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="phone3d-app-btn"
                      onClick={() => handleSelectItem(item)}
                    >
                      {item.icon ? (
                        <img src={item.icon} alt={item.name} />
                      ) : (
                        <span
                          className="phone3d-design-badge"
                          style={{ backgroundColor: item.color }}
                        >
                          {item.badge}
                        </span>
                      )}
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="phone3d-detail-view">
                <div>
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      color: '#fbfbf2',
                      padding: '0.35rem 0.7rem',
                      borderRadius: '99px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginBottom: '0.85rem',
                    }}
                  >
                    <ArrowLeft size={14} />
                    {t.hero.phoneCloseCard}
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    {selectedItem.icon ? (
                      <img
                        src={selectedItem.icon}
                        alt={selectedItem.name}
                        style={{ width: 40, height: 40, objectFit: 'contain' }}
                      />
                    ) : (
                      <span
                        className="phone3d-design-badge"
                        style={{ backgroundColor: selectedItem.color, width: 42, height: 42 }}
                      >
                        {selectedItem.badge}
                      </span>
                    )}
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{selectedItem.name}</h3>
                      <span style={{ fontSize: '0.72rem', opacity: 0.7, fontFamily: 'var(--font-mono)' }}>
                        {selectedItem.category ? tr(selectedItem.category) : 'Design'}
                      </span>
                    </div>
                  </div>

                  {/* Barra de Proficiência */}
                  <div style={{ marginBottom: '0.85rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)',
                        marginBottom: '0.25rem',
                      }}
                    >
                      <span>{t.hero.phoneLevel}</span>
                      <span>{selectedItem.level}%</span>
                    </div>
                    <div
                      style={{
                        height: 7,
                        borderRadius: 99,
                        background: 'rgba(255,255,255,0.12)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${selectedItem.level}%`,
                          background: 'var(--accent)',
                          borderRadius: 99,
                        }}
                      />
                    </div>
                  </div>

                  <p style={{ fontSize: '0.8rem', lineHeight: 1.45, color: 'rgba(251,251,242,0.88)' }}>
                    {tr(selectedItem.description)}
                  </p>
                </div>

                {relatedProjects.length > 0 && (
                  <div style={{ marginTop: '0.85rem' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        opacity: 0.65,
                        marginBottom: '0.4rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      {t.nav.projects}:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {relatedProjects.slice(0, 2).map((proj) => (
                        <button
                          key={proj.id}
                          type="button"
                          onClick={() =>
                            navigate(mode === 'design' && proj.designShowcase ? `/design/${proj.slug}` : `/projeto/${proj.slug}`)
                          }
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.45rem 0.65rem',
                            borderRadius: '10px',
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: '#fbfbf2',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          <span>{tr(proj.title)}</span>
                          <ExternalLink size={12} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <span className="phone3d-drag-hint">
        <Rotate3d size={16} />
        {t.hero.phoneDragHint}
      </span>
    </div>
  );
}
