import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Menu, X, Sun, Moon, Globe, Code2, Palette, FileText, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { profile } from '../data/profile';

export default function FloatingMenu() {
  const {
    mode,
    switchMode,
    theme,
    toggleTheme,
    lang,
    toggleLang,
    menuOpen,
    setMenuOpen,
    t,
  } = useApp();

  const overlayRef = useRef(null);
  const linksRef = useRef([]);
  const panelRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Animate fullscreen menu open/close with GSAP
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (menuOpen) {
      document.body.style.overflow = 'hidden';

      if (prefersReducedMotion) {
        gsap.set(overlay, { clipPath: 'circle(150% at calc(100% - 2.8rem) 2.8rem)' });
        return;
      }

      const tl = gsap.timeline();
      tl.to(overlay, {
        clipPath: 'circle(150% at calc(100% - 2.8rem) 2.8rem)',
        duration: 0.55,
        ease: 'power3.inOut',
      })
        .fromTo(
          linksRef.current.filter(Boolean),
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power3.out' },
          '-=0.25'
        )
        .fromTo(
          panelRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' },
          '-=0.3'
        );
    } else {
      document.body.style.overflow = '';
      if (prefersReducedMotion) {
        gsap.set(overlay, { clipPath: 'circle(0% at calc(100% - 2.8rem) 2.8rem)' });
      } else {
        gsap.to(overlay, {
          clipPath: 'circle(0% at calc(100% - 2.8rem) 2.8rem)',
          duration: 0.42,
          ease: 'power3.inOut',
        });
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Close on Escape key
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, setMenuOpen]);

  const goToSection = (sectionId) => {
    setMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToRoute = (path) => {
    setMenuOpen(false);
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { num: '01', label: t.nav.home, action: () => goToSection('home') },
    { num: '02', label: t.nav.about, action: () => goToSection('sobre') },
    { num: '03', label: t.nav.projects, action: () => goToSection('projetos') },
    { num: '04', label: t.nav.experiences, action: () => goToSection('experiencias') },
    { num: '05', label: t.nav.sprayLab, action: () => goToRoute('/spray-lab') },
    { num: '06', label: t.nav.faq, action: () => goToSection('faq') },
    { num: '07', label: t.nav.contact, action: () => goToSection('contato') },
    { num: '08', label: t.nav.cvLab, action: () => goToRoute('/cv-lab') },
  ];

  return (
    <>
      <header className={`floating-topbar no-print ${menuOpen ? 'is-menu-open' : ''}`}>
        {/* Brand Badge Fixo no Canto Superior Esquerdo */}
        <button
          type="button"
          className="floating-brand-badge"
          onClick={() => goToRoute('/')}
          aria-label="Vinicius Lima — Home"
        >
          <span className="brand-dot" aria-hidden="true" />
          <span className="brand-name-text">Vinicius Lima</span>
          <span className="brand-role-hide" style={{ opacity: 0.65, fontSize: '0.78rem' }}>
            • {mode === 'dev' ? 'DEV' : 'DESIGN'}
          </span>
        </button>

        {/* Controles Fixos no Canto Superior Direito */}
        <div className="floating-corner-controls">
          {/* Botão de Destaque para Transicionar Dev ⇄ Designer */}
          <button
            type="button"
            className="corner-pill-btn corner-mode-btn"
            onClick={() => switchMode()}
            aria-label={t.nav.modeLabel}
            title={mode === 'dev' ? 'Mudar para Modo Designer' : 'Mudar para Modo Dev'}
          >
            {mode === 'dev' ? (
              <>
                <Palette size={16} style={{ color: '#0066ff' }} />
                <span className="corner-mode-text">DESIGN</span>
              </>
            ) : (
              <>
                <Code2 size={16} style={{ color: '#aa1719' }} />
                <span className="corner-mode-text">DEV</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="corner-pill-btn corner-lang-btn"
            onClick={toggleLang}
            aria-label={t.nav.langLabel}
            title={t.nav.langLabel}
          >
            <Globe size={16} className="corner-lang-icon" />
            <span>{lang.toUpperCase()}</span>
          </button>

          <button
            type="button"
            className="corner-pill-btn"
            onClick={toggleTheme}
            aria-label={t.nav.themeLabel}
            title={t.nav.themeLabel}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span className="hide-mobile">
              {theme === 'dark' ? t.nav.light : t.nav.dark}
            </span>
          </button>

          <button
            type="button"
            className="corner-pill-btn corner-menu-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="fullscreen-nav-overlay"
            aria-label={menuOpen ? t.nav.closeMenu : t.nav.menuLabel}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Overlay Fullscreen Animado */}
      <div
        id="fullscreen-nav-overlay"
        ref={overlayRef}
        className={`fullscreen-menu no-print ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="fullscreen-menu-grid">
          <nav aria-label="Menu principal">
            <ul className="fullscreen-nav-list">
              {navItems.map((item, idx) => (
                <li
                  key={item.num}
                  ref={(el) => {
                    linksRef.current[idx] = el;
                  }}
                >
                  <button
                    type="button"
                    className="fullscreen-nav-link"
                    onClick={item.action}
                  >
                    <span className="fullscreen-nav-num">{item.num}</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <aside ref={panelRef} className="fullscreen-menu-panel">
            <div>
              <div className="menu-panel-group-title">{t.nav.modeLabel}</div>
              <div className="menu-toggle-row">
                <button
                  type="button"
                  className={`menu-chip-btn ${mode === 'dev' ? 'active' : ''}`}
                  onClick={() => {
                    setMenuOpen(false);
                    switchMode('dev');
                  }}
                >
                  <Code2 size={16} />
                  {t.nav.devMode}
                </button>
                <button
                  type="button"
                  className={`menu-chip-btn ${mode === 'design' ? 'active' : ''}`}
                  onClick={() => {
                    setMenuOpen(false);
                    switchMode('design');
                  }}
                >
                  <Palette size={16} />
                  {t.nav.designMode}
                </button>
              </div>
            </div>

            <div>
              <div className="menu-panel-group-title">{t.nav.themeLabel} & {t.nav.langLabel}</div>
              <div className="menu-toggle-row">
                <button type="button" className="menu-chip-btn" onClick={toggleTheme}>
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                  {theme === 'dark' ? t.nav.light : t.nav.dark}
                </button>
                <button type="button" className="menu-chip-btn" onClick={toggleLang}>
                  <Globe size={16} />
                  {lang === 'pt' ? 'English (EN)' : 'Português (PT-BR)'}
                </button>
                <button
                  type="button"
                  className="menu-chip-btn"
                  onClick={() => goToRoute('/cv-lab')}
                >
                  <FileText size={16} />
                  {t.nav.cvLab}
                </button>
              </div>
            </div>

            <div>
              <div className="menu-panel-group-title">{t.footer.connect}</div>
              <div className="menu-social-links">
                <a href={profile.links.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
                <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
                <a href={profile.links.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
                <a href={`mailto:${profile.email}`}>Email</a>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', opacity: 0.72, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Sparkles size={16} style={{ flexShrink: 0, color: 'var(--accent)' }} />
              {t.nav.sprayHint}
            </p>
          </aside>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.82rem',
            opacity: 0.55,
            fontFamily: 'var(--font-mono)',
          }}
        >
          <span>{profile.location}</span>
          <span>{profile.email}</span>
        </div>
      </div>
    </>
  );
}
