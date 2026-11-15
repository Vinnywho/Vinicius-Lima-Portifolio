import { useRef } from 'react';
import gsap from 'gsap';

export default function InteractiveHeroName({ text }) {
  const containerRef = useRef(null);
  const charRefs = useRef([]);

  const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animateLetter = (idx, strength = 1) => {
    if (prefersReducedMotion()) return;
    const el = charRefs.current[idx];
    if (!el) return;

    const tilt = (idx % 2 === 0 ? -1 : 1) * (6 + Math.random() * 6) * strength;
    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      {
        y: -14 * strength,
        scaleY: 1 + 0.18 * strength,
        scaleX: 1 - 0.08 * strength,
        rotation: tilt,
        color: 'var(--accent)',
      },
      {
        y: 0,
        scaleY: 1,
        scaleX: 1,
        rotation: 0,
        clearProps: 'color',
        duration: 0.65,
        ease: 'elastic.out(1, 0.45)',
      }
    );
  };

  const handleInteract = (idx) => {
    animateLetter(idx, 1);
    animateLetter(idx - 1, 0.45);
    animateLetter(idx + 1, 0.45);
  };

  let globalIndex = 0;
  const words = text.split(' ');

  return (
    <h1
      ref={containerRef}
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
                onMouseEnter={() => handleInteract(currentIdx)}
                onClick={() => handleInteract(currentIdx)}
                aria-hidden="true"
              >
                {char}
              </span>
            );
          })}
          {wordIdx < words.length - 1 && <span className="hero-name-space" aria-hidden="true"> </span>}
        </span>
      ))}
    </h1>
  );
}
