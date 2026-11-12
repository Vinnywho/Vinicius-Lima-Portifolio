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

    // Elementos de tinta gráfica mantidos na tela
    const mists = [];
    const particles = [];
    const drips = [];

    let rafId = null;
    let isSpraying = false;
    let lastPos = { x: 0, y: 0 };
    let stationaryFrames = 0;
    let lastScrollY = window.scrollY;

    // Cor ÚNICA por modo: Dev = Vermelho autoral, Design = Azul vibrante
    const getSingleColor = () => {
      if (modeRef.current === 'design') {
        return { r: 0, g: 102, b: 255 }; // Azul vibrante
      }
      return { r: 170, g: 23, b: 25 }; // Vermelho grafite autoral
    };

    // Desenha tudo na tela instantaneamente
    const drawAll = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 1. Névoas suaves de fundo
      for (let i = 0; i < mists.length; i++) {
        const m = mists[i];
        const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.radius);
        grad.addColorStop(0, `rgba(${m.color.r}, ${m.color.g}, ${m.color.b}, ${m.alpha})`);
        grad.addColorStop(0.5, `rgba(${m.color.r}, ${m.color.g}, ${m.color.b}, ${m.alpha * 0.45})`);
        grad.addColorStop(1, `rgba(${m.color.r}, ${m.color.g}, ${m.color.b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Gotas escorrendo (Drips)
      for (let i = 0; i < drips.length; i++) {
        const d = drips[i];
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

      // 3. Micro-partículas estocásticas
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Loop de animação APENAS enquanto há drips crescendo
    const updateDrips = () => {
      let hasGrowingDrip = false;

      for (let i = 0; i < drips.length; i++) {
        const d = drips[i];
        if (d.length < d.maxLength) {
          d.length = Math.min(d.maxLength, d.length + d.speed);
          hasGrowingDrip = true;
        }
      }

      drawAll();

      if (hasGrowingDrip) {
        rafId = requestAnimationFrame(updateDrips);
      } else {
        rafId = null;
      }
    };

    const triggerDripUpdate = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(updateDrips);
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

    // Borrifar tinta na posição
    const sprayAt = (x, y, intensity = 1) => {
      const color = getSingleColor();

      // 1. Névoa central
      mists.push({
        x,
        y,
        radius: 18 + Math.random() * 14 * intensity,
        color,
        alpha: 0.18 * intensity,
      });

      // 2. Micro-gotículas pulverizadas
      const count = Math.floor((30 + Math.random() * 20) * intensity);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.pow(Math.random(), 2.2) * (34 * intensity);
        const px = x + Math.cos(angle) * dist;
        const py = y + Math.sin(angle) * dist;

        particles.push({
          x: px,
          y: py,
          size: Math.random() < 0.85 ? 0.7 + Math.random() * 1.3 : 1.6 + Math.random() * 2.2,
          color,
          alpha: 0.75 + Math.random() * 0.25,
        });
      }

      // 3. Gotas escorrendo (Drips de tinta fresca acumulada)
      if (stationaryFrames > 10 && Math.random() < 0.32) {
        drips.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + Math.random() * 6,
          length: 0,
          maxLength: 20 + Math.random() * 60,
          speed: 1.4 + Math.random() * 2.2,
          width: 1.6 + Math.random() * 1.6,
          color,
          alpha: 0.9,
        });
        triggerDripUpdate();
      }

      // Limitar arrays para estabilidade
      if (mists.length > 350) mists.splice(0, mists.length - 350);
      if (particles.length > 2500) particles.splice(0, particles.length - 2500);
      if (drips.length > 90) drips.splice(0, drips.length - 90);

      drawAll();
    };

    // Fade progressivo ao ROLAR A TELA
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      if (delta > 0 && (mists.length > 0 || particles.length > 0 || drips.length > 0)) {
        // Reduz a opacidade da tinta proporcionalmente ao scroll
        const fadeStep = Math.min(delta * 0.018, 0.22);

        for (let i = mists.length - 1; i >= 0; i--) {
          mists[i].alpha -= fadeStep * 0.9;
          if (mists[i].alpha <= 0.01) mists.splice(i, 1);
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          particles[i].alpha -= fadeStep;
          if (particles[i].alpha <= 0.01) particles.splice(i, 1);
        }

        for (let i = drips.length - 1; i >= 0; i--) {
          drips[i].alpha -= fadeStep;
          if (drips[i].alpha <= 0.01) drips.splice(i, 1);
        }

        drawAll();
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    const shouldSkipTarget = (target) => {
      if (!target || !target.closest) return false;
      return Boolean(
        target.closest(
          '.phone-realistic-body, input, textarea, select, button, a, [data-no-spray="true"]'
        )
      );
    };

    // Interpolação suave ao arrastar para traço contínuo
    const sprayInterpolated = (from, to) => {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dist = Math.hypot(dx, dy);
      const steps = Math.max(1, Math.floor(dist / 9));

      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        sprayAt(from.x + dx * t, from.y + dy * t, 0.85);
      }
    };

    const onPointerDown = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      if (shouldSkipTarget(e.target)) return;

      isSpraying = true;
      stationaryFrames = 0;
      lastPos = { x: e.clientX, y: e.clientY };
      sprayAt(e.clientX, e.clientY, 1.2);
    };

    const onPointerMove = (e) => {
      if (!isSpraying) return;

      const current = { x: e.clientX, y: e.clientY };
      const dist = Math.hypot(current.x - lastPos.x, current.y - lastPos.y);

      if (dist < 4) {
        stationaryFrames += 1;
        sprayAt(current.x, current.y, 0.4);
      } else {
        stationaryFrames = 0;
        sprayInterpolated(lastPos, current);
        lastPos = current;
      }
    };

    const onPointerUp = () => {
      isSpraying = false;
      stationaryFrames = 0;
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

  return (
    <canvas
      ref={canvasRef}
      className="spray-canvas"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 5,
        width: '100vw',
        height: '100vh',
      }}
    />
  );
}
