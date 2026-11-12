import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export default function SprayCanvas() {
  const { mode } = useApp();
  const canvasRef = useRef(null);
  const modeRef = useRef(mode);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles = [];
    let rafId = null;
    let isSpraying = false;
    let lastPos = { x: 0, y: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const getPalette = () => {
      if (modeRef.current === 'design') {
        return ['255, 77, 0', '230, 57, 70', '255, 130, 67'];
      }
      return ['170, 23, 25', '217, 38, 41', '130, 15, 18'];
    };

    const spawnSpray = (x, y, density = 22) => {
      const palette = getPalette();
      for (let i = 0; i < density; i++) {
        // Distribuição concentrada no centro e dispersa nas bordas (efeito aerossol real)
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.pow(Math.random(), 1.6) * 32;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        const size = radius < 10 ? 2.5 + Math.random() * 5.5 : 1 + Math.random() * 2.5;

        particles.push({
          x: px,
          y: py,
          size,
          rgb: palette[Math.floor(Math.random() * palette.length)],
          alpha: 0.55 + Math.random() * 0.4,
          decay: 0.008 + Math.random() * 0.008, // Some gradualmente (~1.5s - 2.5s)
        });
      }

      // Cap de segurança para manter sempre 60fps
      if (particles.length > 1800) {
        particles.splice(0, particles.length - 1800);
      }

      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.alpha -= p.decay;
        if (p.alpha <= 0.01) {
          particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(${p.rgb}, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (particles.length > 0) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = null;
      }
    };

    const shouldSkipTarget = (target) => {
      if (!target || !target.closest) return false;
      return Boolean(
        target.closest('.phone3d-body, input, textarea, select, [data-no-spray="true"]')
      );
    };

    const onPointerDown = (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      if (shouldSkipTarget(e.target)) return;

      isSpraying = true;
      lastPos = { x: e.clientX, y: e.clientY };
      spawnSpray(e.clientX, e.clientY, 26);
    };

    const onPointerMove = (e) => {
      if (!isSpraying) return;
      const dx = e.clientX - lastPos.x;
      const dy = e.clientY - lastPos.y;
      const dist = Math.hypot(dx, dy);

      // Interpola traços rápidos para não deixar espaços vazios ao arrastar rápido
      const steps = Math.min(Math.max(1, Math.floor(dist / 10)), 6);
      for (let s = 1; s <= steps; s++) {
        const ix = lastPos.x + (dx * s) / steps;
        const iy = lastPos.y + (dy * s) / steps;
        spawnSpray(ix, iy, 12);
      }
      lastPos = { x: e.clientX, y: e.clientY };
    };

    const stopSpray = () => {
      isSpraying = false;
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stopSpray);
    window.addEventListener('pointercancel', stopSpray);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', stopSpray);
      window.removeEventListener('pointercancel', stopSpray);
    };
  }, []);

  return <canvas ref={canvasRef} className="spray-canvas" aria-hidden="true" />;
}
