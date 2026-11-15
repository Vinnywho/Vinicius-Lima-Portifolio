import { useRef } from 'react';
import gsap from 'gsap';

export default function InteractiveHeroName({ text }) {
  const wrapRef = useRef(null);
  const spotRef = useRef(null);

  const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleMouseMove = (e) => {
    const el = wrapRef.current;
    const spot = spotRef.current;
    if (!el || !spot) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    spot.style.setProperty('--spot-x', `${x}px`);
    spot.style.setProperty('--spot-y', `${y}px`);
    spot.style.opacity = '1';

    if (!prefersReducedMotion()) {
      const nx = x / rect.width - 0.5;
      const ny = y / rect.height - 0.5;
      gsap.to(el, {
        rotateY: nx * 7,
        rotateX: -ny * 7,
        y: -3,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const handleMouseLeave = () => {
    const el = wrapRef.current;
    const spot = spotRef.current;
    if (spot) spot.style.opacity = '0';
    if (el && !prefersReducedMotion()) {
      gsap.to(el, {
        rotateY: 0,
        rotateX: 0,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
  };

  const handleClick = () => {
    const el = wrapRef.current;
    if (!el || prefersReducedMotion()) return;
    gsap.fromTo(
      el,
      { scale: 1.03 },
      { scale: 1, duration: 0.45, ease: 'elastic.out(1, 0.5)' }
    );
  };

  return (
    <div className="hero-name-stage hero-animate">
      <h1
        ref={wrapRef}
        className="hero-title interactive-hero-name"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <span className="hero-name-base">{text}</span>
        <span ref={spotRef} className="hero-name-spotlight" aria-hidden="true">
          {text}
        </span>
      </h1>
    </div>
  );
}
