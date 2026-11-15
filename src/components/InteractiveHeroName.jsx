import { useRef } from 'react';
import gsap from 'gsap';

export default function InteractiveHeroName({ text }) {
  const charRefs = useRef([]);

  const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const popLetter = (idx, strength = 1, delay = 0) => {
    if (prefersReducedMotion()) return;
    const el = charRefs.current[idx];
    if (!el) return;

    const tilt = (idx % 2 === 0 ? -1 : 1) * (11 + Math.random() * 6) * strength;
    gsap.killTweensOf(el);

    const tl = gsap.timeline({ delay });
    tl.to(el, {
      y: -20 * strength,
      scaleX: 1 + 0.14 * strength,
      scaleY: 1 + 0.28 * strength,
      rotation: tilt,
      color: 'var(--accent)',
      textShadow: '0 10px 22px rgba(170, 23, 25, 0.35)',
      duration: 0.18,
      ease: 'power2.out',
      overwrite: 'auto',
    }).to(el, {
      y: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      clearProps: 'color,textShadow',
      duration: 0.72,
      ease: 'elastic.out(1.15, 0.38)',
    });
  };

  const handleHover = (idx) => {
    popLetter(idx, 1, 0);
    popLetter(idx - 1, 0.55, 0.025);
    popLetter(idx + 1, 0.55, 0.025);
    popLetter(idx - 2, 0.25, 0.05);
    popLetter(idx + 2, 0.25, 0.05);
  };

  // Full-name cascading kinetic wave on click/tap
  const handleClickWave = (originIdx) => {
    if (prefersReducedMotion()) return;
    charRefs.current.forEach((_, idx) => {
      const dist = Math.abs(idx - originIdx);
      const strength = Math.max(0.42, 1 - dist * 0.08);
      popLetter(idx, strength, dist * 0.035);
    });
  };

  let globalIndex = 0;
  const words = text.split(' ');

  return (
    <h1
      className="hero-title hero-animate interactive-hero-name"
      aria-label={text}
    >
      {words.map((word, wordIdx) => (
        <span key={`${word}-${wordIdx}`} className="hero-name-word">
          {word.split('').map((char) => {
            const currentIdx = globalIndex++;
            return (
              <span
                key={currentIdx}
                ref={(el) => {
                  charRefs.current[currentIdx] = el;
                }}
                className="hero-name-char"
                onMouseEnter={() => handleHover(currentIdx)}
                onClick={() => handleClickWave(currentIdx)}
                aria-hidden="true"
              >
                {char}
              </span>
            );
          })}
          {wordIdx < words.length - 1 && (
            <span className="hero-name-space" aria-hidden="true">
              {' '}
            </span>
          )}
        </span>
      ))}
    </h1>
  );
}
