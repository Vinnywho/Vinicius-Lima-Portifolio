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

    const mists = [];
    const particles = [];
    const drips = [];

    let rafId = null;
    let isSpraying = false;
    let isDissipating = false;
    let dissipationRate = 0.915;
    let currentPos = { x: 0, y: 0 };
    let lastSprayPos = { x: 0, y: 0 };
    let holdFrames = 0;
    let lastHoldSprayTime = 0;
    let mistStepCounter = 0;
    let lastScrollY = window.scrollY;

    // Cor ÚNICA por modo: Dev = Vermelho autoral, Design = Azul vibrante
    const getSingleColor = () => {
      if (modeRef.current === 'design') {
        return { r: 0, g: 102, b: 255 };
      }
      return { r: 170, g: 23, b: 25 };
    };

    const drawAll = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 1. Névoa de núcleo sutil (sem blur pesado ou acúmulo borrado)
      for (let i = 0; i < mists.length; i++) {
        const m = mists[i];
        const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.radius);
        grad.addColorStop(0, `rgba(${m.color.r}, ${m.color.g}, ${m.color.b}, ${m.alpha})`);
        grad.addColorStop(1, `rgba(${m.color.r}, ${m.color.g}, ${m.color.b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Gotas escorrendo (Drips de tinta fresca)
      for (let i = 0; i < drips.length; i++) {
        const d = drips[i];
        ctx.strokeStyle = `rgba(${d.color.r}, ${d.color.g}, ${d.color.b}, ${d.alpha})`;
        ctx.lineWidth = d.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.length);
        ctx.stroke();

        // Gota pesada acumulada na ponta
        ctx.fillStyle = `rgba(${d.color.r}, ${d.color.g}, ${d.color.b}, ${d.alpha})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y + d.length, d.width * 1.25, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Partículas nítidas de aerossol
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const spawnDrip = (x, y, color) => {
      drips.push({
        x: x + (Math.random() - 0.5) * 14,
        y: y + Math.random() * 6,
        length: 0,
        maxLength: 24 + Math.random() * 68,
        speed: 1.25 + Math.random() * 2.1,
        width: 1.4 + Math.random() * 1.5,
        color,
        alpha: 0.92,
      });
      if (drips.length > 90) drips.splice(0, drips.length - 90);
    };

    const sprayAt = (x, y, intensity = 1, allowMist = true) => {
      const color = getSingleColor();

      // Névoa muito sutil e espaçada para não criar rastro de blur
      mistStepCounter += 1;
      if (allowMist && mistStepCounter % 3 === 0) {
        mists.push({
          x,
          y,
          radius: 10 + Math.random() * 8 * intensity,
          color,
          alpha: 0.038 * intensity,
        });
      }

      // Micro-partículas estocásticas nítidas (efeito real de bico de spray)
      const count = Math.floor((24 + Math.random() * 16) * intensity);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.pow(Math.random(), 2.35) * (28 * intensity);
        const px = x + Math.cos(angle) * dist;
        const py = y + Math.sin(angle) * dist;

        particles.push({
          x: px,
          y: py,
          size: Math.random() < 0.84 ? 0.65 + Math.random() * 1.15 : 1.5 + Math.random() * 1.8,
          color,
          alpha: 0.62 + Math.random() * 0.36,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45 - 0.2,
        });
      }

      // Tinta fresca escorre ao acumular ou ocasionalmente em jatos densos
      if (holdFrames >= 6 && Math.random() < 0.42) {
        spawnDrip(x, y, color);
      } else if (Math.random() < 0.045 * intensity) {
        spawnDrip(x, y, color);
      }

      // Limites seguros de memória
      if (mists.length > 180) mists.splice(0, mists.length - 180);
      if (particles.length > 2600) particles.splice(0, particles.length - 2600);
    };

    // Loop unificado de animação: spray contínuo ao segurar + física de drips + dissipação suave
    const tick = (now) => {
      let needsNextFrame = false;

      // 1. Efeito contínuo enquanto o clique está pressionado (mesmo parado!)
      if (isSpraying) {
        needsNextFrame = true;
        if (now - lastHoldSprayTime >= 32) {
          lastHoldSprayTime = now;
          holdFrames += 1;
          sprayAt(currentPos.x, currentPos.y, 0.72, holdFrames % 2 === 0);
        }
      }

      // 2. Crescimento contínuo das gotas escorrendo
      for (let i = 0; i < drips.length; i++) {
        const d = drips[i];
        if (d.length < d.maxLength) {
          d.length = Math.min(d.maxLength, d.length + d.speed);
          needsNextFrame = true;
        }
      }

      // 3. Dissipação suave e orgânica após rolar a página
      if (isDissipating) {
        for (let i = mists.length - 1; i >= 0; i--) {
          mists[i].alpha *= dissipationRate - 0.025;
          mists[i].radius += 0.35;
          if (mists[i].alpha <= 0.008) mists.splice(i, 1);
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.alpha *= dissipationRate;
          p.x += p.vx;
          p.y += p.vy;
          if (p.alpha <= 0.015) particles.splice(i, 1);
        }

        for (let i = drips.length - 1; i >= 0; i--) {
          drips[i].alpha *= dissipationRate;
          drips[i].y += 0.25;
          if (drips[i].alpha <= 0.015) drips.splice(i, 1);
        }

        if (mists.length > 0 || particles.length > 0 || drips.length > 0) {
          needsNextFrame = true;
        } else {
          isDissipating = false;
        }
      }

      drawAll();

      if (needsNextFrame) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    const ensureLoop = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawAll();
    };

    resize();
    window.addEventListener('resize', resize);

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      if (delta > 1 && (mists.length > 0 || particles.length > 0 || drips.length > 0)) {
        isDissipating = true;
        // Acelera levemente se o usuário rolar muito rápido, mantendo dissipação orgânica
        dissipationRate = delta > 60 ? 0.885 : 0.925;
        ensureLoop();
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    const shouldSkipTarget = (target) => {
      if (!target || !target.closest) return false;
      return Boolean(
        target.closest(
          '.hero-deck-body, .interactive-hero-name, .spraylab-canvas, input, textarea, select, button, a, [data-no-spray="true"]'
        )
      );
    };

    const sprayInterpolated = (from, to) => {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dist = Math.hypot(dx, dy);
      const steps = Math.max(1, Math.floor(dist / 8));

      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        sprayAt(from.x + dx * t, from.y + dy * t, 0.85, s === steps);
      }
    };

    const isMobileViewport = () =>
      window.innerWidth <= 768 ||
      (window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches);

    const onPointerDown = (e) => {
      if (e.pointerType === 'touch' || isMobileViewport()) return;
      if (e.button !== undefined && e.button !== 0) return;
      if (shouldSkipTarget(e.target)) return;

      isSpraying = true;
      isDissipating = false;
      holdFrames = 0;
      lastHoldSprayTime = performance.now();
      currentPos = { x: e.clientX, y: e.clientY };
      lastSprayPos = currentPos;

      sprayAt(currentPos.x, currentPos.y, 1.15, true);
      ensureLoop();
    };

    const onPointerMove = (e) => {
      if (e.pointerType === 'touch' || isMobileViewport()) return;
      if (!isSpraying) return;

      const current = { x: e.clientX, y: e.clientY };
      currentPos = current;
      const dist = Math.hypot(current.x - lastSprayPos.x, current.y - lastSprayPos.y);

      if (dist >= 4) {
        if (dist > 14) holdFrames = 0;
        sprayInterpolated(lastSprayPos, current);
        lastSprayPos = current;
        ensureLoop();
      }
    };

    const onPointerUp = () => {
      isSpraying = false;
      holdFrames = 0;
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} className="spray-canvas" aria-hidden="true" />;
}
