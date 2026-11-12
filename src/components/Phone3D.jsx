import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Rotate3d, ArrowLeft, ExternalLink, Wifi, Battery, Sparkles } from 'lucide-react';
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
  const glareRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentTime, setCurrentTime] = useState('14:20');

  // Atualiza relógio da status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${h}:${m}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  // Drag rotation state
  const rotRef = useRef({ x: 5, y: -10 });
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    startRotX: 5,
    startRotY: -10,
  });

  // Animação de entrada 3D e rotação
  useEffect(() => {
    const phone = phoneRef.current;
    if (!phone) return;

    if (prefersReducedMotion()) {
      gsap.set(phone, { rotateX: 5, rotateY: -10 });
      return;
    }

    rotRef.current = { x: 5, y: -10 };

    const tl = gsap.timeline();
    tl.fromTo(
      phone,
      { rotateY: -180, rotateX: 20, scale: 0.88, opacity: 0 },
      {
        rotateY: -10,
        rotateX: 5,
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
      }
    );

    return () => {
      tl.kill();
    };
  }, [mode]);

  const onPointerDown = (e) => {
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

      if (Math.hypot(dx, dy) > 5) {
        dragRef.current.moved = true;
      }

      const nextY = dragRef.current.startRotY + dx * 0.4;
      const nextX = Math.max(-28, Math.min(28, dragRef.current.startRotX - dy * 0.3));

      rotRef.current = { x: nextX, y: nextY };
      gsap.set(phoneRef.current, { rotateX: nextX, rotateY: nextY });

      // Desloca o reflexo de vidro dinamicamente conforme a inclinação
      if (glareRef.current) {
        const glareX = -nextY * 3;
        const glareY = nextX * 3;
        gsap.set(glareRef.current, {
          transform: `translate(${glareX}px, ${glareY}px) rotate(25deg)`,
        });
      }
    };

    const onPointerUp = () => {
      if (!dragRef.current.active) return;
      dragRef.current.active = false;

      // Retorna suavemente se estiver excessivamente inclinado
      if (phoneRef.current && Math.abs(rotRef.current.y) > 35) {
        rotRef.current = { x: 5, y: -10 };
        gsap.to(phoneRef.current, {
          rotateX: 5,
          rotateY: -10,
          duration: 0.7,
          ease: 'power2.out',
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
          ...skills.filter((s) => s.id === 'figma' || s.id === 'css' || s.id === 'html'),
          ...designCapabilities,
        ];

  const relatedProjects = selectedItem?.relatedSlugs
    ? projects.filter((p) => selectedItem.relatedSlugs.includes(p.slug))
    : [];

  return (
    <div className="phone-realistic-stage">
      <div
        ref={phoneRef}
        className="phone-realistic-body"
        onPointerDown={onPointerDown}
        role="region"
        aria-label="Smartphone Interativo Vinicius Lima"
      >
        {/* Botões Físicos Laterais Metálicos */}
        <div className="phone-btn-power" aria-hidden="true" />
        <div className="phone-btn-action" aria-hidden="true" />
        <div className="phone-btn-vol-up" aria-hidden="true" />
        <div className="phone-btn-vol-down" aria-hidden="true" />

        {/* Traseira Ultra-Realista (com módulo de 3 câmeras, flash e LiDAR) */}
        <div className="phone-back-face" aria-hidden="true">
          <div className="phone-camera-plate">
            <div className="phone-lens-ring">
              <span className="phone-lens-glass" />
            </div>
            <div className="phone-lens-ring">
              <span className="phone-lens-glass" />
            </div>
            <div className="phone-lens-ring">
              <span className="phone-lens-glass" />
            </div>
            <div className="phone-flash-led" />
            <div className="phone-lidar-sensor" />
          </div>
          <div className="phone-back-branding">
            <div className="phone-logo-mark">VL</div>
            <span>VINNYWHO PRO</span>
          </div>
        </div>

        {/* Frente do Smartphone com Vidro e Tela Retina */}
        <div className="phone-front-face">
          {/* Reflexo de Vidro Especular Dinâmico */}
          <div ref={glareRef} className="phone-glass-glare" aria-hidden="true" />

          <div className="phone-inner-screen">
            {/* Status Bar do Sistema */}
            <header className="phone-status-bar">
              <span className="phone-clock">{currentTime}</span>

              {/* Dynamic Island com Câmera Frontal e Sensor */}
              <div className="phone-dynamic-island">
                <span className="phone-camera-dot" />
                <span className="phone-sensor-dot" />
              </div>

              <div className="phone-status-icons">
                <span style={{ fontSize: '0.62rem', fontWeight: 800 }}>5G</span>
                <Wifi size={12} />
                <Battery size={13} />
              </div>
            </header>

            {/* Conteúdo da Tela: Grid de Apps ou Visualização de App */}
            {!selectedItem ? (
              <div className="phone-home-view">
                {/* Widget de Cabeçalho do Usuário */}
                <div className="phone-user-widget">
                  <div className="phone-widget-badge">
                    <Sparkles size={13} style={{ color: 'var(--accent)' }} />
                    <span>{mode === 'dev' ? 'DEV STACK' : 'DESIGN LAB'}</span>
                  </div>
                  <h4 className="phone-widget-title">
                    {mode === 'dev' ? 'Engenharia Front-End' : 'Design Gráfico & UI'}
                  </h4>
                  <p className="phone-widget-sub">
                    {mode === 'dev' ? 'Ciência da Computação • FECAP' : 'Branding, Editorial & UI/UX'}
                  </p>
                </div>

                {/* Grid de Aplicativos / Tecnologias */}
                <div className="phone-apps-matrix">
                  {itemsToDisplay.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="phone-app-tile"
                      onClick={() => handleSelectItem(item)}
                    >
                      <div className="phone-app-icon-wrap" style={{ backgroundColor: item.color ? `${item.color}15` : 'rgba(255,255,255,0.08)' }}>
                        {item.icon ? (
                          <img src={item.icon} alt={item.name} className="phone-app-img" />
                        ) : (
                          <span className="phone-app-text-badge" style={{ backgroundColor: item.color }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="phone-app-name">{item.name}</span>
                    </button>
                  ))}
                </div>

                {/* Dock Inferior com Ferramentas Chave */}
                <div className="phone-dock">
                  {itemsToDisplay.slice(0, 4).map((dItem) => (
                    <button
                      key={`dock-${dItem.id}`}
                      type="button"
                      className="phone-dock-icon"
                      onClick={() => handleSelectItem(dItem)}
                      title={dItem.name}
                    >
                      {dItem.icon ? (
                        <img src={dItem.icon} alt={dItem.name} />
                      ) : (
                        <span style={{ fontWeight: 800, fontSize: '0.65rem', color: '#fff' }}>
                          {dItem.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Janela do App Aberto */
              <div className="phone-app-opened-view">
                <div>
                  <button
                    type="button"
                    className="phone-app-back-btn"
                    onClick={() => setSelectedItem(null)}
                  >
                    <ArrowLeft size={14} />
                    <span>{t.hero.phoneCloseCard}</span>
                  </button>

                  <div className="phone-opened-header">
                    <div className="phone-opened-icon" style={{ backgroundColor: selectedItem.color ? `${selectedItem.color}20` : 'rgba(255,255,255,0.1)' }}>
                      {selectedItem.icon ? (
                        <img src={selectedItem.icon} alt={selectedItem.name} />
                      ) : (
                        <span style={{ fontWeight: 800, fontSize: '1rem', color: selectedItem.color }}>
                          {selectedItem.badge}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                        {selectedItem.name}
                      </h3>
                      <span style={{ fontSize: '0.72rem', opacity: 0.7, fontFamily: 'var(--font-mono)' }}>
                        {selectedItem.category ? tr(selectedItem.category) : 'Competência'}
                      </span>
                    </div>
                  </div>

                  {/* Nível de Domínio */}
                  <div className="phone-meter-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: 6, fontWeight: 700 }}>
                      <span>{t.hero.phoneLevel}</span>
                      <span style={{ color: 'var(--accent)' }}>{selectedItem.level}%</span>
                    </div>
                    <div className="phone-meter-bar">
                      <div className="phone-meter-fill" style={{ width: `${selectedItem.level}%`, backgroundColor: 'var(--accent)' }} />
                    </div>
                  </div>

                  <p className="phone-opened-desc">{tr(selectedItem.description)}</p>
                </div>

                {/* Projetos Relacionados */}
                {relatedProjects.length > 0 && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <div className="phone-rel-title">{t.nav.projects}:</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {relatedProjects.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          className="phone-rel-item"
                          onClick={() =>
                            navigate(mode === 'design' && p.designShowcase ? `/design/${p.slug}` : `/projeto/${p.slug}`)
                          }
                        >
                          <span>{tr(p.title)}</span>
                          <ExternalLink size={12} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Barra Home Gestural */}
            <div className="phone-home-bar" aria-hidden="true" />
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
