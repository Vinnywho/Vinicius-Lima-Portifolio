import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Sparkles, Layers, Cpu, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalScrollShowcase() {
  const { mode, t } = useApp();
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const mobileCarouselRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  const panelsData = t.horizontalShowcase.panels;

  const panelIcons = [
    <Layers key="0" size={30} />,
    <Sparkles key="1" size={30} />,
    <Cpu key="2" size={30} />,
    <Code key="3" size={30} />,
  ];

  // Detect mobile resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // GSAP pinned horizontal scroll on Desktop
  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || isMobile) {
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
          end: () => `+=${getScrollDistance() + 350}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // Parallax reveals per panel
      const panels = gsap.utils.toArray('.horizontal-panel');
      panels.forEach((panel) => {
        const title = panel.querySelector('.panel-title');
        const badge = panel.querySelector('.panel-badge');
        const desc = panel.querySelector('.panel-desc');
        const highlight = panel.querySelector('.panel-highlight');
        const visual = panel.querySelector('.panel-visual');

        gsap.from([badge, title, desc, highlight], {
          y: 40,
          opacity: 0,
          scale: 0.95,
          stagger: 0.08,
          duration: 0.8,
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
            rotation: 12,
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
  }, [isMobile]);

  // Update active slide on mobile scroll
  const handleMobileScroll = (e) => {
    const el = e.currentTarget;
    const cardWidth = el.clientWidth * 0.82;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveSlide(Math.max(0, Math.min(panelsData.length - 1, index)));
  };

  const scrollToSlide = (idx) => {
    const el = mobileCarouselRef.current;
    if (!el) return;
    const card = el.children[idx];
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  // Mobile Version: Touch Snap Carousel
  if (isMobile) {
    return (
      <section className="mobile-showcase-section container">
        <header className="mobile-showcase-header">
          <span className="panel-badge">
            <Sparkles size={14} />
            <span>{t.horizontalShowcase.tagline}</span>
          </span>

          <h2 className="mobile-showcase-title">
            {mode === 'dev'
              ? t.horizontalShowcase.introTitleDev
              : t.horizontalShowcase.introTitleDesign}
          </h2>

          <p className="mobile-showcase-desc">
            {mode === 'dev'
              ? t.horizontalShowcase.introDescDev
              : t.horizontalShowcase.introDescDesign}
          </p>

          <div className="mobile-swipe-hint">
            <span>{t.horizontalShowcase.mobileSwipeHint}</span>
          </div>
        </header>

        <div
          ref={mobileCarouselRef}
          className="mobile-showcase-carousel"
          onScroll={handleMobileScroll}
        >
          {panelsData.map((panel, idx) => (
            <div key={panel.id} className="mobile-showcase-card">
              <div className="panel-top-row">
                <span className="panel-badge">
                  {panelIcons[idx % panelIcons.length]}
                  <span>{panel.badge}</span>
                </span>
                <span className="panel-counter">0{idx + 1} / 04</span>
              </div>

              <h3 className="mobile-card-title">{panel.title}</h3>
              <p className="mobile-card-desc">{panel.desc}</p>

              <div className="panel-highlight">
                <span className="highlight-pill">{panel.highlight}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="mobile-dots-indicator" aria-hidden="true">
          {panelsData.map((panel, idx) => (
            <button
              key={panel.id}
              type="button"
              className={`mobile-dot ${activeSlide === idx ? 'is-active' : ''}`}
              onClick={() => scrollToSlide(idx)}
              aria-label={`Ir para pilar 0${idx + 1}`}
            />
          ))}
        </div>
      </section>
    );
  }

  // Desktop Version: Pinned GSAP Horizontal Experience
  return (
    <section ref={containerRef} className="horizontal-showcase-section">
      <div className="horizontal-pin-wrap">
        <div className="horizontal-track" ref={trackRef}>
          {/* Intro Panel */}
          <div className="horizontal-panel intro-panel">
            <div className="panel-inner">
              <span className="panel-badge">
                <Sparkles size={14} />
                <span>{t.horizontalShowcase.tagline}</span>
              </span>

              <h2 className="panel-title display-massive">
                {mode === 'dev'
                  ? t.horizontalShowcase.introTitleDev
                  : t.horizontalShowcase.introTitleDesign}
              </h2>

              <p className="panel-desc">
                {mode === 'dev'
                  ? t.horizontalShowcase.introDescDev
                  : t.horizontalShowcase.introDescDesign}
              </p>

              <div className="panel-highlight" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{t.horizontalShowcase.scrollHint}</span>
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
                <span>{t.horizontalShowcase.outroBadge}</span>
              </span>

              <h3 className="panel-title">{t.horizontalShowcase.outroTitle}</h3>

              <p className="panel-desc">{t.horizontalShowcase.outroDesc}</p>

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
