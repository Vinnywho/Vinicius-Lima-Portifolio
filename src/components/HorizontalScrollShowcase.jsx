import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Sparkles, Layers, Cpu, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalScrollShowcase() {
  const { mode, t } = useApp();
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  const panelsData = t.horizontalShowcase.panels;

  const panelIcons = [
    <Layers key="0" size={36} />,
    <Sparkles key="1" size={36} />,
    <Cpu key="2" size={36} />,
    <Code key="3" size={36} />,
  ];

  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion || isMobile) {
      // Natural non-pinned layout on mobile/reduced-motion to prevent scroll locks
      return;
    }

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const container = containerRef.current;
      if (!track || !container) return;

      const getScrollDistance = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${getScrollDistance() + 400}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // Staggered reveals per panel using containerAnimation
      const panels = gsap.utils.toArray('.horizontal-panel');
      panels.forEach((panel) => {
        const title = panel.querySelector('.panel-title');
        const badge = panel.querySelector('.panel-badge');
        const desc = panel.querySelector('.panel-desc');
        const highlight = panel.querySelector('.panel-highlight');
        const visual = panel.querySelector('.panel-visual');

        gsap.from([badge, title, desc, highlight], {
          y: 45,
          opacity: 0,
          scale: 0.94,
          stagger: 0.08,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: panel,
            containerAnimation: tween,
            start: 'left 85%',
            toggleActions: 'play none none reverse',
          },
        });

        if (visual) {
          gsap.from(visual, {
            rotation: 10,
            scale: 0.8,
            opacity: 0,
            duration: 0.9,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tween,
              start: 'left 80%',
              toggleActions: 'play none none reverse',
            },
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="horizontal-showcase-section">
      <div className="horizontal-pin-wrap">
        <div className="horizontal-track" ref={trackRef}>
          {/* Intro Intro-Panel */}
          <div className="horizontal-panel intro-panel">
            <div className="panel-inner">
              <span className="panel-badge">
                <Sparkles size={14} />
                <span>{t.horizontalShowcase.tagline}</span>
              </span>

              <h2 className="panel-title display-massive">
                {mode === 'dev' ? 'ENGENHARIA COM ATITUDE' : 'DESIGN COM PRECISÃO'}
              </h2>

              <p className="panel-desc">
                {mode === 'dev'
                  ? 'Como transformo código em experiências imersivas, performáticas e inesquecíveis.'
                  : 'Como a direção de arte e a cultura de rua encontram a tecnologia de alto impacto.'}
              </p>

              <div className="panel-highlight" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Role para navegar horizontalmente</span>
                <ArrowRight size={18} className="scroll-arrow-anim" />
              </div>
            </div>
          </div>

          {/* Dynamic Content Panels */}
          {panelsData.map((panel, idx) => (
            <div key={panel.id} className={`horizontal-panel theme-panel-${idx}`}>
              <div className="panel-inner">
                <div className="panel-top-row">
                  <span className="panel-badge">
                    {panelIcons[idx % panelIcons.length]}
                    <span>{panel.badge}</span>
                  </span>
                  <span className="panel-counter">0{idx + 1} / 04</span>
                </div>

                <h3 className="panel-title">{panel.title}</h3>

                <p className="panel-desc">{panel.desc}</p>

                <div className="panel-highlight">
                  <span className="highlight-pill">{panel.highlight}</span>
                </div>
              </div>

              <div className="panel-visual" aria-hidden="true">
                <div className="visual-halo" />
                <div className="visual-graphic">
                  <span className="visual-big-num">0{idx + 1}</span>
                  <div className="visual-icon-box">{panelIcons[idx % panelIcons.length]}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Outro Call to Action Panel */}
          <div className="horizontal-panel outro-panel">
            <div className="panel-inner">
              <span className="panel-badge">
                <Code size={14} />
                <span>PRÓXIMO PASSO</span>
              </span>

              <h3 className="panel-title">PRONTO PARA CONSTRUIR ALGO ÚNICO?</h3>

              <p className="panel-desc">
                De sistemas web complexos a identidades visuais de alta intensidade. Vamos conversar sobre o seu próximo projeto.
              </p>

              <div className="panel-highlight" style={{ marginTop: '1.5rem' }}>
                <a
                  href="#contato"
                  className="btn-primary"
                  onClick={(e) => {
                    const el = document.getElementById('contato');
                    if (el) {
                      e.preventDefault();
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <span>{t.contact.eyebrow}</span>
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
