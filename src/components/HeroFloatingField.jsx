import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import codeIcon from '../assets/Icons/code-svgrepo-com.svg';
import rockIcon from '../assets/Icons/rock-and-roll-concert-svgrepo-com.svg';

const PERSONAL_ICONS = [
  {
    id: 'code-identity',
    icon: codeIcon,
    alt: 'Code',
    pos: 'pos-code',
    depth: 26,
    floatY: -14,
    floatRot: -6,
    duration: 3.4,
  },
  {
    id: 'rock-identity',
    icon: rockIcon,
    alt: 'Rock and Roll',
    pos: 'pos-rock',
    depth: -28,
    floatY: 14,
    floatRot: 7,
    duration: 3.9,
  },
];

export default function HeroFloatingField({ sectionRef }) {
  const fieldRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const field = fieldRef.current;
    const section = sectionRef?.current;
    if (!field) return;

    const ctx = gsap.context(() => {
      // Smooth independent float on inner icon wrapper
      gsap.utils.toArray('.hero-icon-bob').forEach((el) => {
        const fy = Number(el.dataset.fy || -12);
        const frot = Number(el.dataset.frot || 5);
        const dur = Number(el.dataset.dur || 3.5);

        gsap.to(el, {
          y: fy,
          rotation: frot,
          duration: dur,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    }, fieldRef);

    // Smooth parallax on outer wrapper so it never conflicts with inner bob
    const isFinePointer =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(pointer: fine)').matches;

    let cleanupMouse = null;
    if (isFinePointer && section) {
      const parallaxNodes = Array.from(field.querySelectorAll('.hero-icon-parallax'));
      const quickSetters = parallaxNodes.map((el) => ({
        xTo: gsap.quickTo(el, 'x', { duration: 0.75, ease: 'power3.out' }),
        yTo: gsap.quickTo(el, 'y', { duration: 0.75, ease: 'power3.out' }),
        depth: Number(el.dataset.depth || 24),
      }));

      const onMove = (e) => {
        const rect = section.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        quickSetters.forEach(({ xTo, yTo, depth }) => {
          xTo(nx * depth);
          yTo(ny * depth);
        });
      };

      const onLeave = () => {
        quickSetters.forEach(({ xTo, yTo }) => {
          xTo(0);
          yTo(0);
        });
      };

      section.addEventListener('mousemove', onMove);
      section.addEventListener('mouseleave', onLeave);
      cleanupMouse = () => {
        section.removeEventListener('mousemove', onMove);
        section.removeEventListener('mouseleave', onLeave);
      };
    }

    return () => {
      if (cleanupMouse) cleanupMouse();
      ctx.revert();
    };
  }, [sectionRef]);

  const handleIconBurst = (e, id) => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const btn = e.currentTarget;
    const ring = btn.querySelector('.hero-icon-ring');

    gsap.killTweensOf(btn);
    if (id === 'code-identity') {
      gsap.fromTo(
        btn,
        { scale: 1.25, rotation: -18 },
        { scale: 1, rotation: 360, duration: 0.85, ease: 'elastic.out(1, 0.45)' }
      );
    } else {
      // Rock & Roll playful headbang shake + pop
      gsap.timeline()
        .to(btn, { scale: 1.28, rotation: -18, duration: 0.12, ease: 'power2.out' })
        .to(btn, { rotation: 16, duration: 0.12, ease: 'power1.inOut' })
        .to(btn, { rotation: -12, duration: 0.12, ease: 'power1.inOut' })
        .to(btn, { scale: 1, rotation: 0, duration: 0.55, ease: 'elastic.out(1, 0.4)' });
    }

    if (ring) {
      gsap.fromTo(
        ring,
        { scale: 0.7, opacity: 0.85 },
        { scale: 1.9, opacity: 0, duration: 0.65, ease: 'power2.out' }
      );
    }
  };

  return (
    <div ref={fieldRef} className="hero-floating-field" aria-hidden="true">
      <span className="hero-ambient-orb orb-1" />
      <span className="hero-ambient-orb orb-2" />

      {PERSONAL_ICONS.map((item) => (
        <div
          key={item.id}
          data-depth={item.depth}
          className={`hero-icon-parallax ${item.pos}`}
        >
          <div
            className="hero-icon-bob"
            data-fy={item.floatY}
            data-frot={item.floatRot}
            data-dur={item.duration}
          >
            <button
              type="button"
              tabIndex={-1}
              className="hero-personal-icon-btn"
              onClick={(e) => handleIconBurst(e, item.id)}
              data-no-spray="true"
              title={item.alt}
            >
              <span className="hero-icon-ring" />
              <img src={item.icon} alt="" className="hero-personal-icon-img" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
