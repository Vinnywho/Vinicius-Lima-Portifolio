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

    // Arrays de partículas e gotas que escorrem (drips)
    const mists = [];
    const particles = [];
    const drips = [];
    let rafId = null;
    let isSpraying = false;
    let lastPos = { x: 0, y: 0 };
    let stationaryFrames = 0;

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
        // Azul cobalto / elétrico urbano
        return [
          { r: 0, g: 102, b: 255 },
          { r: 37, g: 99, b: 235 },
          { r: 56, g: 189, b: 248 },
          { r: 29, g: 78, b: 216 },
        ];
      }
      // Vermelho grafite autoral
      return [
        { r: 170, g: 23, b: 25 },
        { r: 217, g: 38, b: 41 },
        { r: 140, g: 15, b: 18 },
        { r: 248, g: 113, b: 113 },
      ];
    };

    const sprayAt = (x, y, intensity = 1) => {
      const palette = getPalette();
      const baseColor = palette[Math.floor(Math.random() * palette.length)];

      // 1. Névoa central difusa de aerossol (Soft Mist Core)
      mists.push({
        x,
        y,
        radius: 18 + Math.random() * 16 * intensity,
        color: baseColor,
        alpha: 0.14 * intensity,
        decay: 0.004,
      });

      // 2. Micro-gotículas pulverizadas com distribuição estocástica (Splatter)
      const particleCount = Math.floor((35 + Math.random() * 25) * intensity);
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        // Raio com dispersão gaussiana/exponencial (maioria perto do centro, poucas nas bordas)
        const dist = Math.pow(Math.random(), 2.2) * (38 * intensity);
        const px = x + Math.cos(angle) * dist;
        const py = y + Math.sin(angle) * dist;

        particles.push({
          x: px,
          y: py,
          size: Math.random() < 0.85 ? 0.6 + Math.random() * 1.4 : 1.8 + Math.random() * 2.2,
          color: palette[Math.floor(Math.random() * palette.length)],
          alpha: 0.65 + Math.random() * 0.35,
          decay: 0.005 + Math.random() * 0.005,
        });
      }

      // 3. Gotas escorrendo (Drips de tinta fresca)
      // Se o usuário ficar borrifando no mesmo lugar ou arrastar muito devagar
      if (stationaryFrames > 12 && Math.random() < 0.28) {
        drips.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + Math.random() * 8,
          length: 0,
          maxLength: 25 + Math.random() * 65,
          speed: 1.2 + Math.random() * 2.2,
          width: 1.5 + Math.random() * 1.5,
          color: baseColor,
          alpha: 0.85,
          decay: 0.004,
        });
      }

      // Limitar arrays para 60fps constante
      if (mists.length > 250) mists.splice(0, mists.length - 250);
      if (particles.length > 1600) particles.splice(0, particles.length - 1600);
      if (drips.length > 80) drips.splice(0, drips.length - 80);

      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Renderizar névoas suaves de fundo
      for (let i = mists.length - 1; i >= 0; i--) {
        const m = mists[i];
        m.alpha -= m.decay;
        if (m.alpha <= 0.005) {
          mists.splice(i, 1);
          continue;
        }

        const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.radius);
        grad.addColorStop(0, `rgba(${m.color.r}, ${m.color.g}, ${m.color.b}, ${m.alpha})`);
        grad.addColorStop(0.5, `rgba(${m.color.r}, ${m.color.g}, ${m.color.b}, ${m.alpha * 0.5})`);
        grad.addColorStop(1, `rgba(${m.color.r}, ${m.color.g}, ${m.color.b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Renderizar gotas escorrendo (Drips)
      for (let i = drips.length - 1; i >= 0; i--) {
        const d = drips[i];
        if (d.length < d.maxLength) {
          d.length += d.speed;
        } else {
          d.alpha -= d.decay;
        }

        if (d.alpha <= 0.01) {
          drips.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = `rgba(${d.color.r}, ${d.color.g}, ${d.color.b}, ${d.alpha})`;
        ctx.lineWidth = d.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.length);
        ctx.stroke();

        // Poça de acúmulo na ponta da gota
        ctx.fillStyle = `rgba(${d.color.r}, ${d.color.g}, ${d.color.b}, ${d.alpha})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y + d.length, d.width * 1.25, 0, Math.PI * 2);
        ctx.fill();
      }

      // Renderizar micro-partículas estocásticas
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.alpha -= p.decay;
        if (p.alpha <= 0.01) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (mists.length > 0 || particles.length > 0 || drips.length > 0) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = null;
      }
    };

    const shouldSkipTarget = (target) => {
      if (!target || !target.closest) return false;
      return Boolean(
        target.closest('.phone-realistic-body, input, textarea, select, [data-no-spray="true"]')
      );
    };

    const onPointerDown = (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      if (shouldSkipTarget(e.target)) return;

      isSpraying = true;
      stationaryFrames = 0;
      lastPos = { x: e.clientX, y: e.clientY };
      sprayAt(e.clientX, e.clientY, 1.3);
    };

    const onPointerMove = (e) => {
      if (!isSpraying) return;
      const dx = e.clientX - lastPos.x;
      const dy = e.clientY - lastPos.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 4) {
        stationaryFrames++;
      } else {
        stationaryFrames = 0;
      }

      const steps = Math.min(Math.max(1, Math.floor(dist / 8)), 8);
      for (let s = 1; s <= steps; s++) {
        const ix = lastPos.x + (dx * s) / steps;
        const iy = lastPos.y + (dy * s) / steps;
        sprayAt(ix, iy, 0.9);
      }
      lastPos = { x: e.clientX, y: e.clientY };
    };

    const stopSpray = () => {
      isSpraying = false;
      stationaryFrames = 0;
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
