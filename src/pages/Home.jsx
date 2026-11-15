import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, ArrowDown, MessageCircle, SprayCan, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { profile } from '../data/profile';
import { projects } from '../data/projects';
import Phone3D from '../components/Phone3D';
import MobileSkillsMarquee from '../components/MobileSkillsMarquee';
import InteractiveHeroName from '../components/InteractiveHeroName';
import HeroFloatingField from '../components/HeroFloatingField';
import ModeSwitcher from '../components/ModeSwitcher';
import FeaturedProject from '../components/FeaturedProject';
import ProjectCard from '../components/ProjectCard';
import HorizontalScrollShowcase from '../components/HorizontalScrollShowcase';
import Timeline from '../components/Timeline';
import FAQSection from '../components/FAQSection';
import portrait from '../assets/images/portrait.png';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { mode, lang, t, navigateWithTransition } = useApp();
  const rootRef = useRef(null);
  const heroSectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter projects coherently per active facet (Dev vs Design)
  const modeProjects = projects.filter(
    (p) => p.category === 'both' || p.category === mode
  );

  const featuredProjects = modeProjects.filter((p) => p.featured);
  const gridProjects = modeProjects.filter((p) => !p.featured || mode === 'design');

  // GSAP ScrollTrigger animations replacing AOS
  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-animate', {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
      });

      gsap.utils.toArray('.gsap-reveal').forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.75,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            once: true,
          },
        });
      });

      gsap.from('.gsap-card', {
        y: 35,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.projects-grid',
          start: 'top 82%',
          once: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [mode]);

  return (
    <div ref={rootRef}>
      {/* HERO SECTION */}
      <section ref={heroSectionRef} id="home" className="hero-section">
        <HeroFloatingField sectionRef={heroSectionRef} />
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-badge hero-animate">
              {mode === 'dev' ? t.hero.devBadge : t.hero.designBadge}
            </div>

            <InteractiveHeroName
              key={mode}
              text={mode === 'dev' ? profile.devTitle : profile.graffitiName}
            />

            <p className="hero-bio hero-animate">
              {mode === 'dev' ? t.hero.devBio : t.hero.designBio}
            </p>

            <div className="hero-actions hero-animate">
              <a href="#projetos" className="btn-primary">
                <span>{t.hero.ctaProjects}</span>
                <ArrowDown size={16} />
              </a>

              <a
                href={profile.cvPdfUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                <Download size={16} />
                <span>{t.hero.ctaDownloadCv}</span>
              </a>

              <a href="#contato" className="btn-secondary">
                <MessageCircle size={16} />
                <span>{t.nav.contact}</span>
              </a>
            </div>

            <div className="hero-switch-wrap hero-animate">
              <span className="hero-switch-label">{t.hero.switchHint}</span>
              <ModeSwitcher />
            </div>
          </div>

          <div className="hero-animate hero-visual-slot">
            {isMobile ? <MobileSkillsMarquee key={mode} /> : <Phone3D key={mode} />}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="sobre" className="about-section">
        <div className="container about-grid">
          <div className="gsap-reveal">
            <h2 className="about-title">{t.about.title}</h2>
            <p className="about-text">
              {mode === 'dev' ? t.about.devText : t.about.designText}
            </p>

            <div className="about-stats">
              {t.about.stats.map((stat) => (
                <div key={stat.label} className="about-stat-card">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="about-portrait-wrap gsap-reveal">
            <img
              src={portrait}
              alt={profile.name}
              className="about-portrait"
            />
          </div>
        </div>
      </section>

      {/* GSAP HORIZONTAL PINNED SHOWCASE */}
      <HorizontalScrollShowcase />

      {/* PROJECTS SECTION */}
      <section id="projetos" className="projects-section container">
        <h2 className="section-heading">
          {mode === 'dev' ? t.projects.featuredTitleDev : t.projects.featuredTitleDesign}
        </h2>

        <div className="featured-list">
          {featuredProjects.map((proj, index) => (
            <FeaturedProject key={proj.id} project={proj} index={index} />
          ))}
        </div>

        <div id="mais-projetos" style={{ paddingTop: '2rem' }}>
          <h2 className="section-heading">
            {mode === 'dev' ? t.projects.moreTitleDev : t.projects.moreTitleDesign}
          </h2>
          <div className={`projects-grid ${mode === 'design' ? 'is-behance' : ''}`} style={{ marginTop: '2.5rem' }}>
            {gridProjects.map((proj) => (
              <ProjectCard key={proj.id} project={proj} />
            ))}
          </div>
        </div>
      </section>

      {/* SPRAY LAB INVITE (DESIGN MODE ONLY) */}
      {mode === 'design' && (
        <section className="spray-invite-section container">
          <div className="spray-invite-card gsap-reveal">
            <div className="spray-invite-content">
              <div className="spray-invite-badge">
                <SprayCan size={16} />
                <span>
                  {lang === 'pt' ? 'SPRAY LAB • MURAL INTERATIVO' : 'SPRAY LAB • INTERACTIVE CANVAS'}
                </span>
              </div>
              <h2 className="spray-invite-title">
                {lang === 'pt'
                  ? 'Teste sua criatividade no Spray Lab'
                  : 'Test your creativity in Spray Lab'}
              </h2>
              <p className="spray-invite-desc">
                {lang === 'pt'
                  ? 'Escolha suas cores, desenhe com física real de tinta escorrendo e crie sua própria arte urbana direto na tela.'
                  : 'Pick your colors, draw with realistic paint-drip physics, and craft your own street art right on screen.'}
              </p>
            </div>
            <Link
              to="/spray-lab"
              onClick={(e) => {
                e.preventDefault();
                navigateWithTransition('/spray-lab');
              }}
              className="btn-primary spray-invite-cta"
            >
              <SprayCan size={18} />
              <span>{lang === 'pt' ? 'Abrir Spray Lab' : 'Open Spray Lab'}</span>
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
      )}

      {/* INTERACTIVE TIMELINE */}
      <Timeline />

      {/* INTERACTIVE FAQ ON LANDING PAGE */}
      <FAQSection />
    </div>
  );
}
