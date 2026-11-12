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
  const canRef = useRef(null);
  const nozzleSprayRef = useRef(null);
  const barRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (done) {
      onComplete?.();
      return;
    }

    const can = canRef.current;
    const nozzle = nozzleSprayRef.current;
    const title = titleRef.current;
    const bar = barRef.current;
    const container = containerRef.current;

    const counter = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(container, {
          yPercent: -100,
          duration: 0.7,
          ease: 'power4.inOut',
          onComplete: () => {
            setDone(true);
            onComplete?.();
          },
        });
      },
    });

    // 1. Chacoalha a lata de spray (efeito da esfera misturadora metálica "clack-clack")
    tl.fromTo(
      can,
      { y: 30, opacity: 0, scale: 0.8 },
      { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.8)' }
    )
      .to(can, {
        rotate: -12,
        duration: 0.08,
        repeat: 5,
        yoyo: true,
        ease: 'power1.inOut',
      })
      // 2. Aciona o bico e borrifa o jato de spray
      .fromTo(
        nozzle,
        { scale: 0, opacity: 0 },
        { scale: 1.3, opacity: 1, duration: 0.25, ease: 'power2.out' },
        '-=0.05'
      )
      // 3. A tinta revela o nome em grafite
      .fromTo(
        title,
        { opacity: 0, scale: 0.85, filter: 'blur(10px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.45, ease: 'power2.out' },
        '-=0.15'
      )
      // 4. Carrega a pressão de tinta até 100%
      .to(
        counter,
        {
          val: 100,
          duration: 1.15,
          ease: 'power2.inOut',
          onUpdate: () => setPercent(Math.round(counter.val)),
        },
        '-=0.1'
      )
      .to(
        bar,
        {
          width: '100%',
          duration: 1.15,
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
      {/* Lata de Spray com Animação Autoral */}
      <div ref={canRef} className="loading-spraycan-visual" aria-hidden="true">
        <div className="spraycan-cap">
          <div className="spraycan-nozzle" />
        </div>
        <div className="spraycan-body">
          <div className="spraycan-label-tag">VL</div>
          <div className="spraycan-stripe" />
        </div>
        {/* Jato de spray aerossol saindo do bico */}
        <div ref={nozzleSprayRef} className="spraycan-mist-burst" />
      </div>

      <div ref={titleRef} className="loading-title">
        ViNiCiuS LiMa
      </div>

      <p className="loading-tagline">{t.loading.tagline}</p>

      {/* Barra de Pressão de Tinta */}
      <div className="loading-bar-wrap" aria-hidden="true">
        <div ref={barRef} className="loading-bar-fill" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)' }}>
        <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>PRESSURE:</span>
        <span className="loading-percent">{percent}%</span>
      </div>

      <button type="button" className="loading-skip" onClick={handleSkip}>
        {t.loading.skip}
      </button>
    </div>
  );
}
