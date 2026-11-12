import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useApp } from '../context/AppContext';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function LoadingScreen({ onComplete }) {
  const { t } = useApp();
  const [percent, setPercent] = useState(0);
  const [done, setDone] = useState(prefersReducedMotion);

  const containerRef = useRef(null);
  const barRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (done) {
      onComplete?.();
      return;
    }

    const counter = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 0.65,
          ease: 'power4.inOut',
          onComplete: () => {
            setDone(true);
            onComplete?.();
          },
        });
      },
    });

    tl.fromTo(
      titleRef.current,
      { y: 30, opacity: 0, scale: 0.92 },
      { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.6)' }
    )
      .to(
        counter,
        {
          val: 100,
          duration: 1.25,
          ease: 'power2.inOut',
          onUpdate: () => setPercent(Math.round(counter.val)),
        },
        '-=0.15'
      )
      .to(
        barRef.current,
        {
          width: '100%',
          duration: 1.25,
          ease: 'power2.inOut',
        },
        '<'
      );

    return () => {
      tl.kill();
    };
  }, [done, onComplete]);

  const handleSkip = () => {
    gsap.killTweensOf(containerRef.current);
    setDone(true);
    onComplete?.();
  };

  if (done) return null;

  return (
    <div ref={containerRef} className="loading-screen" role="status" aria-live="polite">
      <div className="loading-splatter" />
      <div ref={titleRef} className="loading-title">
        ViNiCiuS LiMa
      </div>
      <p className="loading-tagline">{t.loading.tagline}</p>
      <div className="loading-bar-wrap" aria-hidden="true">
        <div ref={barRef} className="loading-bar-fill" />
      </div>
      <span className="loading-percent">{percent}%</span>
      <button type="button" className="loading-skip" onClick={handleSkip}>
        {t.loading.skip}
      </button>
    </div>
  );
}
